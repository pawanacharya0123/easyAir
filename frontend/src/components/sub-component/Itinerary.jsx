import React from "react";

function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
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

const Itinerary = ({ offer, index, flightItineraries, travelClass }) => {
  return (
    <div key={index} className="border rounded-2xl shadow-md p-6 bg-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-blue-700">
          Airline:{" "}
          {offer.validatingAirlineCodes
            .map((code) => flightItineraries.dictionaries.carriers[code])
            .join(", ")}
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-base font-medium text-green-600 pr-3">
            {offer.price.total} {offer.price.currency}
          </p>
          <span
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
            {travelClass.charAt(0) || "E"}
          </span>
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
                {flightItineraries.dictionaries.carriers[segment.carrierCode]} |
                Flight: {segment.number}
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
  );
};

export default Itinerary;
