import Crowdfund from "../models/crowdfund.model.js";
import Razorpay from "razorpay";
import User from "../models/user.model.js";
import axios from "axios";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // Import the file system module


const RAZORPAY_KEY_ID = "rzp_test_8VRxJZtuThJe8R"
const RAZORPAY_KEY_SECRET = "slNvyKaT3PKeNuIlmehlX1mj"

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
});

/**
 * Create or get Razorpay contact and fund account for the user.
 * This will be used to transfer funds directly to the creator's bank account.
 */
const createOrGetRazorpayContactAndFundAccount = async (user) => {
    try {
        // Check if the user already has a contact and fund account
        if (user.razorpayContactId && user.razorpayFundAccountId) {
            return { contactId: user.razorpayContactId, fundAccountId: user.razorpayFundAccountId };
        }

        // Step 1: Create Contact
        const contactData = {
            name: user.fullName || "Test User",
            email: user.email || "test12@example.com",
            contact: user.phone || "9000090000",
            type: "vendor", // Vendor type for fund transfer
            reference_id: `contact_${user._id}`,
        };

        const contactResponse = await axios.post("https://api.razorpay.com/v1/contacts", contactData, {
            auth: { username: RAZORPAY_KEY_ID, password: RAZORPAY_KEY_SECRET },
            headers: { "Content-Type": "application/json" },
        });

        const contactId = contactResponse.data.id;
        console.log("✅ Contact Created:", contactId);

        // Step 2: Add Bank Account (Fund Account)
        const fundAccountData = {
            contact_id: contactId, // REQUIRED FIELD ✅
            account_type: "bank_account",
            bank_account: {
                name: user.fullName || "Test User",
                ifsc: user.ifsc || "HDFC0000123", // Use user-provided IFSC
                account_number: user.accountNumber || "2323232323", // Use user-provided account number
            },
        };

        const fundAccountResponse = await axios.post("https://api.razorpay.com/v1/fund_accounts", fundAccountData, {
            auth: { username: RAZORPAY_KEY_ID, password: RAZORPAY_KEY_SECRET },
            headers: { "Content-Type": "application/json" },
        });

        const fundAccountId = fundAccountResponse.data.id;
        console.log("✅ Fund Account Created:", fundAccountId);

        // Step 3: Save Contact and Fund Account IDs to User Database
        await User.findByIdAndUpdate(user._id, { razorpayContactId: contactId, razorpayFundAccountId: fundAccountId }, { new: true });

        return { contactId, fundAccountId };
    } catch (error) {
        console.error("❌ Error creating or activating Razorpay contact and fund account:", error.response?.data || error.message);
        return null;
    }
};
export const linkBankAccount = async (req,res) => {
    try {
        // Step 1: Create or Get Razorpay Contact
            const user = req.user; // Assuming user is attached to the request by middleware
            const { accountNumber, ifscCode:ifsc } = req.body; // Extract bank details from request body
    
            if (!accountNumber || !ifsc) {
                return res.status(400).json({ message: "Account number and IFSC code are required." });
            }
    
        const contactData = {
            name: user.fullName ,
            email: user.email ,
            contact: user.phone || "9000090000",
            type: "vendor", // Vendor type for fund transfer
            reference_id: `contact_${user._id}`,
        };

        const contactResponse = await axios.post("https://api.razorpay.com/v1/contacts", contactData, {
            auth: { username: RAZORPAY_KEY_ID, password: RAZORPAY_KEY_SECRET },
            headers: { "Content-Type": "application/json" },
        });

        const contactId = contactResponse.data.id;
        console.log("✅ Contact Created:", contactId);

        // Step 2: Create Fund Account (Bank Account)
        const fundAccountData = {
            contact_id: contactId, // REQUIRED FIELD ✅
            account_type: "bank_account",
            bank_account: {
                name: user.fullName ,
                ifsc: ifsc , // Use user-provided IFSC
                account_number: accountNumber , // Use user-provided account number
            },
        };

        const fundAccountResponse = await axios.post("https://api.razorpay.com/v1/fund_accounts", fundAccountData, {
            auth: { username: RAZORPAY_KEY_ID, password: RAZORPAY_KEY_SECRET },
            headers: { "Content-Type": "application/json" },
        });

        const fundAccountId = fundAccountResponse.data.id;
        console.log("✅ Fund Account Created:", fundAccountId);

        // Step 3: Save Contact and Fund Account IDs to User Database
        await User.findByIdAndUpdate(
            user._id,
            {
                razorpayContactId: contactId,
                razorpayFundAccountId: fundAccountId,
                bankLinked: true, // Mark bank account as linked
            },
            { new: true }
        );
        
        return res.status(201).json({contactId, fundAccountId});
    } catch (error) {
        console.error("❌ Error linking bank account:", error.response?.data || error.message);
        return res.status(500).json({ message: "Server error", error });
    }
}

// Create a Crowdfunding Campaign

export const createCrowdfund = async (req, res) => {
    try {
      const { title, description, goalAmount } = req.body; // Access text fields from req.body
      const creator = req.user; // Access user from req.user
      const imageFile = req.file; // Access uploaded file from req.file
  
      // Validate user
      if (!creator) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Validate crowdfund content
      if (!title || !description || !goalAmount) {
        return res.status(400).json({ message: "Title, description, and goal amount are required" });
      }
  
      let imageUrl;
      if (imageFile) {
        // Upload image to Cloudinary
        const uploadedResponse = await cloudinary.uploader.upload(imageFile.path, {
          folder: "crowdfunds", // Optional: Organize images in a folder
        });
        imageUrl = uploadedResponse.secure_url; // Get the URL of the uploaded image
  
        // Delete the temporary file after upload
        fs.unlinkSync(imageFile.path);
      }
  
      // Get or create Razorpay Contact and Fund Account
      const { contactId, fundAccountId } = await createOrGetRazorpayContactAndFundAccount(creator);
      if (!contactId || !fundAccountId) {
        return res.status(500).json({ message: "Failed to create or retrieve Razorpay Contact and Fund Account" });
      }
  
      // Create and save the new crowdfund
      const newCrowdfund = new Crowdfund({
        user: creator._id,
        title,
        description,
        goalAmount,
        img: imageUrl, // Save the Cloudinary URL
        razorpayContactId: contactId,
        razorpayFundAccountId: fundAccountId,
      });
  
      await newCrowdfund.save();
      res.status(201).json(newCrowdfund);
    } catch (error) {
      console.error("Error in createCrowdfund:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }

// Donate to a crowdfunding campaign (Create Razorpay Order)
export const donateToCrowdfund = async (req, res) => {
    try {
        console.log("entered")
        const { amount,notes } = req.body;
        const crowdfund = await Crowdfund.findById(req.params.id);
        console.log(crowdfund)
        if (!crowdfund) return res.status(404).json({ message: "Campaign not found" });

        const receipt = `receipt_${req.params.id}_${Date.now()}`.slice(0, 40);
        const options = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt,
            notes: notes,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Payment initiation failed", error });
    }
};

// Verify Payment and Transfer Funds to Creator
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, crowdfundId, userId, amount } = req.body;

        const generated_signature = crypto
            .createHmac("sha256", RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            const crowdfund = await Crowdfund.findById(crowdfundId);
            if (!crowdfund) return res.status(404).json({ message: "Campaign not found" });

            // Step 1: Update Campaign Raised Amount
            crowdfund.raisedAmount += amount;
            crowdfund.backers.push({ user: userId, amount });
            await crowdfund.save();

            // Step 2: Transfer Funds to Creator's Bank Account
            const payoutData = {
                account_number: "2323232323", // Use creator's bank account number
                fund_account_id: crowdfund.razorpayFundAccountId, // Creator's fund account ID
                amount: amount * 100, // Amount in paise
                currency: "INR",
                mode: "IMPS",
                purpose: "payout",
            };

            const payoutResponse = await axios.post("https://api.razorpay.com/v1/payouts", payoutData, {
                auth: { username: RAZORPAY_KEY_ID, password: RAZORPAY_KEY_SECRET },
                headers: { "Content-Type": "application/json" },
            });

            console.log("✅ Payout Successful:", payoutResponse.data);

            res.status(200).json({ success: true, message: "Payment verified and funds transferred successfully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid payment signature" });
        }
    } catch (error) {
        res.status(500).json({ message: "Payment verification or fund transfer failed", error });
    }
};

// Get all crowdfunding campaigns
export const getCrowdfunds = async (req, res) => {
    try {
        const crowdfunds = await Crowdfund.find().populate("user", "fullName email username profileImg");
        res.status(200).json(crowdfunds);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get a single crowdfunding campaign by ID
export const getCrowdfundById = async (req, res) => {
    try {
        const crowdfund = await Crowdfund.findById(req.params.id).populate("user", "fullName email username profileImg");
        if (!crowdfund) {
            return res.status(404).json({ message: "Crowdfunding campaign not found" });
        }
        res.status(200).json(crowdfund);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
export const getCrowdfund = async (req, res) => {
    try {
      const campaigns = await Crowdfund.find({ createdBy: req.params.userId });
      res.status(200).json(campaigns);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching campaigns' });
    }
  }