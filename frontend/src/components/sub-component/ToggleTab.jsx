import React from "react";
const tabs = [
  { key: "one-way", label: "One Way" },
  { key: "round-trip", label: "Round Trip" },
];

const ToggleTab = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
            activeTab === tab.key
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ToggleTab;
