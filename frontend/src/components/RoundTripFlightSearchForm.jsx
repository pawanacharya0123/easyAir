import React, { useEffect, useState, useContext } from "react";
import LocationInputField from "./sub-component/LocationInputField";
import useToken from "../hooks/useToken";
import useAirportSuggestions from "../hooks/useAirportSuggestions";
import useFlightSearch from "../hooks/useFlightSearch";
import { TokenContext } from "../hooks/TokenContext";

const clientId = import.meta.env.VITE_AMADEUS_CLIENT_ID;
const clientSecret = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;

const getAirportCode = (fullString) => {
  const match = fullString.match(/\(([^)]+)\)/);
  return match ? match[1] : null;
};

const RoundTripFlightSearchForm = ({
  travelClass,
  setFlightItineraries,
  formData,
  setFormData,
}) => {
  // const token = useToken();
  const token = useContext(TokenContext);

  const originSuggestions = useAirportSuggestions(formData.origin, token);
  const destinationSuggestions = useAirportSuggestions(
    formData.destination,
    token
  );

  const { loading, searchFlights } = useFlightSearch(token);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (field, airport) => {
    setFormData({
      ...formData,
      [field]: `${airport.name} (${airport.iataCode})`,
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log({ ...formData, travelClass: travelClass });

    const originLocationCode = getAirportCode(formData.origin);
    const destinationLocationCode = getAirportCode(formData.destination);

    const params = {
      originCode: originLocationCode,
      destinationCode: destinationLocationCode,
      departureDate: formData.departureDate,
      returnDate: formData.returnDate,
      travelers: formData.travelers,
      travelClass,
      currencyCode: "CAD",
    };

    const result = await searchFlights(params);
    setFlightItineraries(result);
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[4px] flex items-center justify-center z-50 rounded-2xl pointer-events-none">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-gray-300"></div>
        </div>
      )}
      <form
        onSubmit={handleSearch}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-6xl mx-auto space-y-4 md:space-y-0 md:grid md:grid-cols-5 gap-4"
      >
        <div className="relative col-span-2 flex items-start space-x-2">
          <LocationInputField
            label="Leaving from"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            onSelect={handleSelect}
            suggestions={originSuggestions}
          />

          <div className="w-fit flex items-end justify-center pb-1 mt-6">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  origin: prev.destination,
                  destination: prev.origin,
                }))
              }
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              title="Swap Locations"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v6h6M20 20v-6h-6M4 10l6 6M20 14l-6-6"
                />
              </svg>
            </button>
          </div>

          <LocationInputField
            label="Going to"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            onSelect={handleSelect}
            suggestions={destinationSuggestions}
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departure
          </label>
          <input
            type="date"
            name="departureDate"
            min={new Date().toISOString().split("T")[0]}
            max={
              formData.returnDate
                ? new Date(formData.returnDate).toISOString().split("T")[0]
                : null
            }
            value={formData.departureDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Return
          </label>
          <input
            type="date"
            name="returnDate"
            min={
              formData.departureDate
                ? new Date(formData.departureDate).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0]
            }
            value={formData.returnDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="col-span-1 flex flex-col justify-end">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Travelers
          </label>
          <input
            type="number"
            name="travelers"
            min="1"
            value={formData.travelers}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="md:col-span-5 flex justify-center md:justify-end">
          <button
            type="submit"
            className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition w-full md:w-auto"
          >
            Find Flights
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoundTripFlightSearchForm;
