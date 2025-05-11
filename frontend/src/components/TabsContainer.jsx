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
      <div className="pt-4">
        {flightItineraries.data && (
          <div className="space-y-6">
            {flightItineraries.data.map((offer, index) => (
              <div
                key={index}
                className="border rounded-2xl shadow-md p-6 bg-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-blue-700">
                    Airline:{" "}
                    {offer.validatingAirlineCodes
                      .map(
                        (code) => flightItineraries.dictionaries.carriers[code]
                      )
                      .join(", ")}
                  </h2>
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium text-green-600">
                      {offer.price.total} {offer.price.currency}
                    </p>
                    {/* <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        travelClass === "BUSINESS"
                          ? "bg-blue-100 text-blue-700"
                          : travelClass === "FIRST"
                          ? "bg-purple-100 text-purple-700"
                          : travelClass === "PREMIUM_ECONOMY"
                          ? "bg-gray-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {travelClass || "ECONOMY"}
                    </span> */}
                  </div>
                </div>

                {offer.itineraries.map((itinerary, i) => (
                  <div key={i} className="mt-2 pt-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      ✈️ Trip Duration: {formatDuration(itinerary.duration)}
                    </h3>

                    {itinerary.segments.map((segment, j) => (
                      <div
                        key={j}
                        className="bg-gray-200 p-4 rounded-xl mb-2 text-sm border border-gray-400"
                      >
                        <div className="font-semibold text-gray-900 mb-1">
                          {
                            flightItineraries.dictionaries.carriers[
                              segment.carrierCode
                            ]
                          }{" "}
                          | Flight: {segment.number}
                        </div>
                        <div className="text-gray-800">
                          {segment.departure.iataCode}{" "}
                          <span className="text-gray-700">
                            ({formatDateTime(segment.departure.at)})
                          </span>{" "}
                          → {segment.arrival.iataCode}{" "}
                          <span className="text-gray-700">
                            ({formatDateTime(segment.arrival.at)})
                          </span>
                          <br />
                          Duration: {formatDuration(segment.duration)}
                        </div>
                        <div className="text-gray-700 text-xs mt-1">
                          Aircraft: {segment.aircraft.code}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TabsContainer;
