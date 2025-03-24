import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  CurrencyRupeeIcon, 
  EllipsisVerticalIcon, 
  XMarkIcon,
  FlagIcon
} from "@heroicons/react/24/outline";
import { useUser } from "../context/UserContext";
import { formatDistanceToNow } from 'date-fns';

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
            campaignId: post._id,
            donor: user._id,
          },
        },
        { withCredentials: true }
      );
      const { order } = response.data;

      const options = {
        key: "rzp_test_8VRxJZtuThJe8R",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Crowd Funding",
        description: "Donation for Campaign",
        handler: function (response) {
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
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Campaign deleted successfully");
        onDelete(post._id);
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
      alert(error.response?.data?.message || "Failed to delete campaign");
    }
  };

  // Calculate progress percentage
  const progressPercentage = Math.min(
    Math.round((post.raisedAmount / post.goalAmount) * 100),
    100
  );

  return (
    <div className="border m-2 p-4 rounded-xl w-10/12 bg-gray-900 text-white relative">
      {/* Campaign Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src={post.user?.profileImg || "/default-profile.png"} 
              alt={post.user?.fullName || "User"}
              className="w-10 h-10 rounded-full object-cover border border-gray-600"
              onError={(e) => {
                e.target.src = "/default-profile.png";
              }}
            />
          </div>
          <div>
            <div className="text-lg font-semibold">{post.user?.fullName || "Unknown User"}</div>
            <div className="text-slate-400 text-sm">
              @{post.user?.username || "unknown"} • {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : "just now"}
            </div>
          </div>
        </div>

        {/* Campaign Menu Button */}
        <button 
          onClick={() => setShowMenu(!showMenu)} 
          className="p-1 rounded-full hover:bg-gray-800 transition-colors"
        >
          <EllipsisVerticalIcon className="h-6 w-6 text-gray-400" />
        </button>

        {/* Campaign Menu Dropdown */}
        {showMenu && (
          <div className="absolute right-2 top-10 bg-gray-800 text-white p-2 rounded-md shadow-md z-10">
            <button 
              onClick={() => {
                setShowReportModal(true);
                setShowMenu(false);
              }}
              className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 w-full text-left"
            >
              <FlagIcon className="h-4 w-4 mr-2 text-red-400" />
              <span>Report Campaign</span>
            </button>
            {user && user._id === post.user?._id && (
              <button
                onClick={() => {
                  handleDelete();
                  setShowMenu(false);
                }}
                className="flex items-center px-4 py-2 text-sm hover:bg-gray-700 w-full text-left text-red-500"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                <span>Delete Campaign</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Campaign Content */}
      <div className="mt-3">
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        {post.img && (
          <img 
            src={post.img} 
            alt={post.title} 
            className="w-full h-60 object-cover mt-2 rounded-lg"
            onError={(e) => {
              e.target.src = "/image-placeholder.png";
            }}
          />
        )}
        <p className="mt-3 text-gray-300">{post.description}</p>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Raised: ₹{post.raisedAmount || 0}</span>
            <span className="text-gray-400">Goal: ₹{post.goalAmount}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-right text-xs text-gray-400 mt-1">
            {progressPercentage}% funded
          </div>
        </div>

        {/* Donation Input */}
        <div className="flex mt-4">
          <input
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 p-2 border rounded-l-md bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            min="1"
          />
          <button 
            onClick={handleDonate}
            className="bg-blue-600 px-4 py-2 rounded-r-md text-white hover:bg-blue-700 transition-colors flex items-center"
          >
            <CurrencyRupeeIcon className="w-5 h-5 mr-1" />
            Donate
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setShowReportModal(false)}
        >
          <div
            className="p-5 rounded-lg w-96 bg-gray-900 border border-gray-700 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Report Campaign</h3>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <select
              className="w-full p-2 mt-2 border rounded-md bg-gray-800 text-white"
              onChange={(e) => setReportReason(e.target.value)}
            >
              <option value="">Select a reason</option>
              <option value="spam">Spam</option>
              <option value="harassment">Harassment</option>
              <option value="misinformation">Misinformation</option>
              <option value="scam">Potential Scam</option>
              <option value="other">Other</option>
            </select>
            {reportReason === "other" && (
              <textarea
                className="w-full p-2 mt-2 border rounded-md bg-gray-800 text-white"
                placeholder="Please specify..."
                rows={3}
                onChange={(e) => setReportReason(e.target.value)}
              />
            )}
            <div className="flex justify-end mt-4 space-x-2">
              <button 
                onClick={() => setShowReportModal(false)}
                className="px-3 py-1 border border-gray-600 rounded-md hover:bg-gray-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleReport}
                disabled={!reportReason}
                className="px-3 py-1 bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
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