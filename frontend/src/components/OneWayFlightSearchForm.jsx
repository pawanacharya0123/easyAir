import React, { useContext, useState } from "react";
import LocationInputField from "./sub-component/LocationInputField";
import useAirportSuggestions from "../hooks/useAirportSuggestions";
import useFlightSearch from "../hooks/useFlightSearch";
import useFlightSearchFromFirebase from "../hooks/useFlightSearchFromFirebase";
import { TokenContext } from "../hooks/TokenContext";
import LoadingOverlay from "./sub-component/LoadingOverlay";
import useAirportSuggestionsFromFireBase from "../hooks/useAirportSuggestionsFromFireBase";

const OneWayFlightSearchForm = ({
  travelClass,
  setFlightItineraries,
  formData,
  setFormData,
}) => {
  const token = useContext(TokenContext);

  // const originSuggestions = useAirportSuggestions(formData.origin, token);
  // const destinationSuggestions = useAirportSuggestions(
  //   formData.destination,
  //   token
  // );
  const originSuggestions = useAirportSuggestionsFromFireBase(
    formData.origin,
    token
  );
  const destinationSuggestions = useAirportSuggestionsFromFireBase(
    formData.destination,
    token
  );

  const { loading, searchFlights, fieldError } =
    useFlightSearchFromFirebase(token);

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

    const params = {
      originCode: formData.origin,
      destinationCode: formData.destination,
      departureDate: formData.departureDate,
      travelers: formData.travelers,
      travelClass,
      currencyCode: "CAD",
    };

    const result = await searchFlights(params);
    setFlightItineraries(result);
  };

  return (
    <div className="relative">
      {loading && <LoadingOverlay />}
      <form
        onSubmit={handleSearch}
        className={`bg-white p-6 rounded-2xl shadow-md w-full max-w-8xl mx-auto space-y-4 md:space-y-0 md:grid md:grid-cols-5 gap-4 ${
          loading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <div className="relative col-span-3 flex items-start space-x-2">
          <LocationInputField
            label="Leaving from"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            onSelect={handleSelect}
            suggestions={originSuggestions}
            error={fieldError.origin}
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
            error={fieldError.destination}
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
            value={formData.departureDate}
            onChange={handleChange}
            className={`w-full border ${
              fieldError.departureDate ? "border-red-300" : "border-gray-300"
            } rounded-xl px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
            required
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
            max="9"
            value={formData.travelers}
            onChange={handleChange}
            className={`w-full border ${
              fieldError.travelers ? "border-red-300" : "border-gray-300"
            } rounded-xl px-3 py-2 focus:ring-blue-500 focus:border-blue-500`}
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

export default OneWayFlightSearchForm;
