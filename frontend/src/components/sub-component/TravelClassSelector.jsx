import React from "react";

const TravelClassSelector = ({ travelClass, setTravelClass }) => {
  return (
    <div className="mt-2 md:mt-0">
      <label className="mr-2 text-sm text-gray-700 font-medium">
        Travel Class:
      </label>
      <select
        value={travelClass}
        onChange={(e) => setTravelClass(e.target.value)}
        className="border border-gray-300 rounded-xl px-3 py-2 text-sm"
      >
        <option value="ECONOMY">Economy</option>
        <option value="PREMIUM_ECONOMY">Premium Economy</option>
        <option value="BUSINESS">Business</option>
        <option value="FIRST">First</option>
      </select>
    </div>
  );
};

export default TravelClassSelector;
