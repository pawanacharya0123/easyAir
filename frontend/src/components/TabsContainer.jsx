import React, { useState } from "react";
import OneWayFlightSearchForm from "./OneWayFlightSearchForm";
import RoundTripFlightSearchForm from "./RoundTripFlightSearchForm";

const TabsContainer = () => {
  const [activeTab, setActiveTab] = useState("one-way");
  const [travelClass, setTravelClass] = useState("ECONOMY");
  const [flightItineraries, setFlightItineraries] = useState(null);

  const tabs = [
    { key: "one-way", label: "One Way" },
    { key: "round-trip", label: "Round Trip" },
  ];
  function formatDuration(isoDuration) {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
    const matches = isoDuration.match(regex);
    const hours = matches[1] ? parseInt(matches[1]) : 0;
    const minutes = matches[2] ? parseInt(matches[2]) : 0;

    let result = "";
    if (hours > 0) result += `${hours} hour${hours > 1 ? "s" : ""} `;
    if (minutes > 0) result += `${minutes} minute${minutes > 1 ? "s" : ""}`;
    return result.trim();
  }

  function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return (
    <>
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="flex flex-wrap items-center justify-between border-b border-gray-300 mb-4">
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
        </div>

        <div>
          {activeTab === "one-way" && (
            <OneWayFlightSearchForm
              travelClass={travelClass}
              setFlightItineraries={setFlightItineraries}
            />
          )}
          {activeTab === "round-trip" && (
            <RoundTripFlightSearchForm
              travelClass={travelClass}
              setFlightItineraries={setFlightItineraries}
            />
          )}
        </div>
      </div>
      {flightItineraries && (
        <div>
          {flightItineraries.map((offer, index) => (
            <div key={index} className="border p-4 rounded-xl mb-4 shadow">
              <h2 className="text-lg font-semibold text-blue-600">
                Airline: {offer.validatingAirlineCodes.join(", ")}
              </h2>
              <p className="text-sm text-gray-600">
                Price: {offer.price.total} {offer.price.currency}
              </p>
              {offer.itineraries.map((itinerary, i) => (
                <div key={i} className="mt-2">
                  <h3 className="text-sm font-medium">
                    Trip Duration: {formatDuration(itinerary.duration)}
                  </h3>
                  {itinerary.segments.map((segment, j) => (
                    <div key={j} className="pl-4 mt-1 text-sm">
                      ✈️ {segment.departure.iataCode} (
                      {formatDateTime(segment.departure.at)}) →{" "}
                      {segment.arrival.iataCode} (
                      {formatDateTime(segment.arrival.at)})<br />
                      Airline: {segment.carrierCode} | Flight: {segment.number}{" "}
                      | Aircraft: {segment.aircraft.code}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TabsContainer;
