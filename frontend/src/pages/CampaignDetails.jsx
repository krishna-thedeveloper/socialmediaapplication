// src/pages/CampaignDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CampaignDetails = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [amount, setAmount] = useState("");

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/crowdfunds/${id}`, {
                    withCredentials: true, // Include credentials
                });
                setCampaign(response.data);
            } catch (error) {
                console.error("Error fetching campaign:", error);
            }
        };
        fetchCampaign();
    }, [id]);

    const handleDonate = async () => {
        try {
            const response = await axios.post(
                `http://localhost:3000/api/crowdfunds/donate/${id}`,
                { amount },
                { withCredentials: true } // Include credentials
            );
            const { order } = response.data; // Extract order details from the response

            // Razorpay Checkout options
            const options = {
                key: "rzp_test_8VRxJZtuThJe8R", // Replace with your Razorpay key ID
                amount: order.amount, // Amount in paise
                currency: order.currency,
                order_id: order.id,
                name: "social media app",
                description: "Donation for Campaign",
                image: "https://your-app-logo.png", // Replace with your app logo
                handler: function (response) {
                    // Handle successful payment
                    console.log("Payment successful:", response);
                    alert("Payment successful! Thank you for your donation.");
                },
                prefill: {
                    name: "Donor Name", // Prefill donor name
                    email: "donor@example.com", // Prefill donor email
                    contact: "9000090000", // Prefill donor phone number
                },
                theme: {
                    color: "#F37254", // Customize the modal theme
                },
            };

            // Open the Razorpay payment modal
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Error initiating donation:", error);
        }
    };

    if (!campaign) return <div>Loading...</div>;

    return (
        <div style={styles.container}>
            <h1>{campaign.title}</h1>
            <img src={campaign.img} alt={campaign.title} style={styles.image} />
            <p>{campaign.description}</p>
            <p>Goal: ₹{campaign.goalAmount}</p>
            <p>Raised: ₹{campaign.raisedAmount}</p>
            <input
                type="number"
                placeholder="Amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleDonate} style={styles.button}>
                Donate Now
            </button>
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        textAlign: "center",
    },
    image: {
        width: "100%",
        maxWidth: "500px",
        height: "auto",
        borderRadius: "8px",
    },
    input: {
        padding: "10px",
        margin: "10px 0",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default CampaignDetails;