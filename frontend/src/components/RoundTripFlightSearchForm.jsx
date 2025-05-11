import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import LocationInputField from "./sub-component/LocationInputField";

const clientId = import.meta.env.VITE_AMADEUS_CLIENT_ID;
const clientSecret = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;

const RoundTripFlightSearchForm = ({ travelClass }) => {
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    travelers: 1,
    travelClass: travelClass,
  });
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const [debouncedOrigin] = useDebounce(formData.origin, 300);
  const [debouncedDestination] = useDebounce(formData.destination, 300);

  useEffect(() => {
    const getAccessToken = async () => {
      const response = await fetch(
        "https://test.api.amadeus.com/v1/security/oauth2/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: clientSecret,
          }),
        }
      );

      const data = await response.json();
      console.log("Access Token:", data.access_token);
      setToken(data.access_token);
    };

    getAccessToken();
  }, []);

  const fetchAirports = async (field, keyword) => {
    if (!keyword || !field) return;
    try {
      const response = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (field === "origin") {
        setOriginSuggestions(result.data || []);
      } else {
        setDestinationSuggestions(result.data || []);
      }
      console.log(result);
    } catch (err) {
      console.error(`Error fetching ${field} airports:`, err);
    }
  };

  useEffect(() => {
    if (debouncedOrigin) {
      fetchAirports("origin", debouncedOrigin);
    }
  }, [debouncedOrigin]);

  useEffect(() => {
    if (debouncedDestination) {
      fetchAirports("destination", debouncedDestination);
    }
  }, [debouncedDestination]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (field, airport) => {
    setFormData({
      ...formData,
      [field]: `${airport.name} (${airport.iataCode})`,
    });
    field === "origin"
      ? setOriginSuggestions([])
      : setDestinationSuggestions([]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form className="bg-white p-6 rounded-2xl shadow-md w-full max-w-6xl mx-auto space-y-4 md:space-y-0 md:grid md:grid-cols-5 gap-4">
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
  );
};

export default RoundTripFlightSearchForm;
