import React, { useContext, useState } from "react";
import LocationInputField from "./sub-component/LocationInputField";
import useToken from "../hooks/useToken";
import useAirportSuggestions from "../hooks/useAirportSuggestions";
import useFlightSearch from "../hooks/useFlightSearch";
import { TokenContext } from "../hooks/TokenContext";

const getAirportCode = (fullString) => {
  const match = fullString.match(/\(([^)]+)\)/);
  return match ? match[1] : null;
};

const OneWayFlightSearchForm = ({ travelClass, setFlightItineraries }) => {
  // const token = useToken();
  const token = useContext(TokenContext);

  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    travelers: 1,
  });

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
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-8xl mx-auto space-y-4 md:space-y-0 md:grid md:grid-cols-4 gap-4"
      >
        <LocationInputField
          label="Leaving from"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          onSelect={handleSelect}
          suggestions={originSuggestions}
        />
        <LocationInputField
          label="Going to"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          onSelect={handleSelect}
          suggestions={destinationSuggestions}
        />

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
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
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

export default OneWayFlightSearchForm;
