import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CurrencyRupeeIcon } from "@heroicons/react/24/outline";
import { useUser } from "../context/UserContext";

const CrowdfundPost = ({ post }) => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");
    const {user}=useUser()

    const handleDonate = async () => {
        if (!amount || amount <= 0) {
            return alert("Please enter a valid amount.");
        }

        try {
            const response = await axios.post(`http://localhost:3000/api/crowdfunds/donate/${post._id}`, 
                { amount,
                    notes: {
                    campaignId: post._id, // Add campaign ID as a note
                    donor:user._id , 
                }, },{withCredentials:true});
            const { order } = response.data;

            const options = {
                key: "rzp_test_8VRxJZtuThJe8R", // Replace with your Razorpay key
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,
                name: "Crowd Funding",
                description: "Donation for Campaign",
               // image: "https://your-app-logo.png",
                handler: function (response) {
                    console.log("Payment successful:", response);
                    alert("Payment successful! Thank you for your donation.");
                },
                prefill: {
                    name: user.fullName,
                    email: user.email,
                    contact: "",
                },
                theme: {
                    color: "#F37254",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Error initiating donation:", error);
            alert("Failed to process donation. Please try again.");
        }
    };

    return (
        <div className="border m-2 p-4 rounded-xl w-10/12 bg-gray-900 text-white relative">
            <div className="flex justify-between">
                <div>
                    <span className="text-lg font-semibold">{post.user.fullName}</span>
                    <span className="text-slate-400 text-xl">@{post.user.username} • {post.createdAt?.split("T")[0]}</span>
                </div>
            </div>

            <h2 className="mt-2 text-xl font-bold">{post.title}</h2>
            {post.img && <img src={post.img} alt={post.title} className="w-full h-60 object-cover mt-2 rounded-lg" />}
            <p className="mt-2 text-gray-300">{post.description}</p>

            <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-semibold">Goal: ₹{post.goalAmount}</p>
                <p className="text-green-400 font-semibold">Raised: ₹{post.raisedAmount}</p>
            </div>

            <div className="flex mt-3">
                <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="p-2 border rounded-l-md bg-gray-800 text-white w-full"
                />
                <button onClick={handleDonate} className="bg-blue-600 px-4 py-2 rounded-r-md text-white flex items-center">
                    <CurrencyRupeeIcon className="w-5 h-5 mr-1" />
                    Donate
                </button>
            </div>

            {/*<button
                onClick={() => navigate(`/campaign/${post._id}`)}
                className="mt-3 text-blue-400 underline"
            >
                View Campaign
            </button>*/}
        </div>
    );
};

export default CrowdfundPost;
