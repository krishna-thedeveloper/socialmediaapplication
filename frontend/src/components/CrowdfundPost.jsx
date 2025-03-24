import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CurrencyRupeeIcon, EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useUser } from "../context/UserContext";

const CrowdfundPost = ({ post, onDelete }) => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");
    const { user } = useUser();
    const [showMenu, setShowMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");

    const handleDonate = async () => {
        if (!amount || amount <= 0) {
            return alert("Please enter a valid amount.");
        }

        try {
            const response = await axios.post(
                `http://localhost:3000/api/crowdfunds/donate/${post._id}`,
                {
                    amount,
                    notes: {
                        campaignId: post._id, // Add campaign ID as a note
                        donor: user._id,
                    },
                },
                { withCredentials: true }
            );
            const { order } = response.data;

            const options = {
                key: "rzp_test_8VRxJZtuThJe8R", // Replace with your Razorpay key
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,
                name: "Crowd Funding",
                description: "Donation for Campaign",
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

    const handleReport = async () => {
        if (!reportReason) return alert("Please select a reason");

        try {
            await axios.post(
                "http://localhost:3000/api/reports/",
                {
                    reportedBy: user._id,
                    reportedCampaign: post._id,
                    reason: reportReason,
                },
                { withCredentials: true }
            );

            alert("Report submitted successfully");
            setShowReportModal(false);
            setReportReason("");
        } catch (error) {
            console.error("Error reporting campaign", error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:3000/api/crowdfunds/${post._id}`,
                {
                    withCredentials: true, // Include cookies if using session-based auth
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token if using token-based auth
                    },
                }
            );
    
            // Check if the response status is 200 (OK)
            if (response.status === 200) {
                alert("Campaign deleted successfully");
                onDelete(post._id); // Call the callback to update the parent component
            } else {
                throw new Error("Failed to delete campaign");
            }
        } catch (error) {
            console.error("Error deleting campaign:", error);
    
            // Display a user-friendly error message
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                alert(`Error: ${error.response.data.message || "Failed to delete campaign"}`);
            } else if (error.request) {
                // The request was made but no response was received
                alert("Network error: Please check your internet connection");
            } else {
                // Something happened in setting up the request
                alert("Error: Unable to send request");
            }
        }
    };

    return (
        <div className="border m-2 p-4 rounded-xl w-10/12 bg-gray-900 text-white relative">
            <div className="flex justify-between">
                <div>
                    <span className="text-lg font-semibold">{post.user.fullName}</span>
                    <span className="text-slate-400 text-xl">@{post.user.username} • {post.createdAt?.split("T")[0]}</span>
                </div>
                {/* Three-dots menu */}
                <button onClick={() => setShowMenu(!showMenu)} className="p-1">
                    <EllipsisVerticalIcon className="h-6 w-6 text-gray-400" />
                </button>
            </div>

            {/* Menu Options */}
            {showMenu && (
                <div className="absolute right-2 top-10 bg-gray-800 text-white p-2 rounded-md shadow-md">
                    {/* Report Option (Visible to Everyone) */}
                    <button
                        onClick={() => {
                            setShowReportModal(true);
                            setShowMenu(false);
                        }}
                        className="block px-4 py-2 text-sm"
                    >
                        Report Campaign
                    </button>
                    {/* Delete Option (Visible Only to the Author) */}
                    {user && user._id === post.user._id && (
                        <button
                            onClick={() => {
                                handleDelete();
                                setShowMenu(false);
                            }}
                            className="block px-4 py-2 text-sm text-red-500"
                        >
                            Delete Campaign
                        </button>
                    )}
                </div>
            )}

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

            {/* Report Modal */}
            {showReportModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={() => setShowReportModal(false)}
                >
                    <div
                        className="p-5 rounded-lg w-96 bg-black relative"
                        onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
                    >
                        <div className="flex justify-between">
                            <h3 className="text-lg font-semibold">Report Campaign</h3>
                            <button onClick={() => setShowReportModal(false)}>
                                <XMarkIcon className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                        <select
                            className="w-full p-2 mt-3 border rounded-md bg-inherit"
                            onChange={(e) => setReportReason(e.target.value)}
                        >
                            <option className="bg-inherit" value="">Select a reason</option>
                            <option className="bg-inherit" value="spam">Spam</option>
                            <option className="bg-inherit" value="harassment">Harassment</option>
                            <option className="bg-inherit" value="misinformation">Misinformation</option>
                        </select>
                        <div className="flex justify-end mt-4">
                            <button onClick={handleReport} className="bg-red-500 text-white px-4 py-2 rounded-md">
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrowdfundPost;