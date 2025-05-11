import React, { useState } from "react";

const useFlightSearch = (token) => {
  const [loading, setLoading] = useState(false);

  const searchFlights = async (params) => {
    const {
      originCode,
      destinationCode,
      departureDate,
      returnDate,
      travelers,
      travelClass,
      currencyCode = "CAD",
    } = params;

    const baseUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers`;
    const query = new URLSearchParams({
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate,
      ...(returnDate && { returnDate }),
      adults: travelers,
      travelClass,
      currencyCode,
      max: 25,
    });

    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      return result;
    } catch (err) {
      console.error("Error fetching flights:", err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, searchFlights };
};

export default useFlightSearch;
