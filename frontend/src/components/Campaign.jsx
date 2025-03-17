import React from 'react';

const Campaign = ({ campaign }) => {
  return (
    <div className="w-full max-w-2xl bg-black shadow-lg rounded-lg p-6 mb-4">
      <h2 className="text-xl font-bold mb-2 text-white">{campaign.title}</h2>
      {/* Handle missing image */}
      {campaign.img && (
        <img
          src={campaign.img}
          alt={campaign.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <p className="text-white mb-4">{campaign.description}</p>
      <div className="flex justify-between items-center">
        <p className="text-gray-200">Goal: ₹{campaign.goalAmount}</p>
        <p className="text-gray-200">Raised: ₹{campaign.raisedAmount}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${(campaign.raisedAmount / campaign.goalAmount) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Campaign;