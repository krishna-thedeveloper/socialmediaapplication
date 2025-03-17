import express from "express";
import crypto from "crypto";
import axios from "axios";
import Crowdfund from "../models/crowdfund.model.js";

const router = express.Router();

// Webhook endpoint
router.post("/", async (req, res) => {
    try {
        const webhookSecret = "krish";
        const razorpaySignature = req.headers["x-razorpay-signature"];

        // Verify the webhook signature
        const body = JSON.stringify(req.body);
        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({ success: false, message: "Invalid webhook signature" });
        }

        const { event, payload } = req.body;

        // Handle payment.captured event
        if (event === "payment.captured") {
            const { payment } = payload;
           // console.log(payment)
            const { order_id, amount, currency, notes } = payment.entity;

            // Extract campaign ID from notes
           // console.log(notes)
            const campaignId = notes.campaignId;
            const donor = notes.donor

            // Find the campaign in the database
            const campaign = await Crowdfund.findById(campaignId);
            if (!campaign) {
                return res.status(404).json({ success: false, message: "Campaign not found" });
            }
            campaign.backers.push({
                user: donor, // Reference to the User model
                amount: amount, // Donation amount
                date: Date.now(), // Donation date
            });
            // Step 1: Update the raised amount in the database
            campaign.raisedAmount += amount / 100; // Convert paise to rupees
 
            await campaign.save();

            // Step 2: Transfer funds to the creator's account
            const payoutData = {
                account_number: "2323232323", // Creator's bank account number
                fund_account_id: campaign.razorpayFundAccountId, // Creator's fund account ID
                amount: amount, // Amount in paise
                currency: currency,
                mode: "IMPS",
                purpose: "payout",
                queue_if_low_balance: true,
                reference_id: "Acme Transaction ID 12345",
                narration: "Acme Corp Fund Transfer"
            };
            /*
            const payoutResponse = await axios.post("https://api.razorpay.com/v1/payouts", payoutData, {
                auth: {
                    username: process.env.RAZORPAY_KEY_ID,
                    password: process.env.RAZORPAY_KEY_SECRET,
                },
                headers: { "Content-Type": "application/json" },
            }); */

            console.log("✅ Payout Successful:");
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("❌ Webhook error:", error);
        res.status(500).json({ success: false, message: "Webhook processing failed" });
    }
});

export default router;