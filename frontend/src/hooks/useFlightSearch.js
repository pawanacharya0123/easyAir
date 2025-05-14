import React, { useState } from "react";

const getAirportCode = (fullString) => {
  const match = fullString.match(/\(([^)]+)\)/);
  return match ? match[1] : null;
};

const initialErrorState = {
  origin: "",
  destination: "",
  departureDate: "",
  returnDate: "",
  travelers: "",
};

const useFlightSearch = (token) => {
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState(initialErrorState);

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

    const originLocationCode = getAirportCode(originCode);
    const destinationLocationCode = getAirportCode(destinationCode);

    setFieldError(initialErrorState);

    if (originLocationCode === null || originLocationCode.length !== 3) {
      setFieldError((prevError) => ({
        ...prevError,
        ["origin"]: "Invalid origin code",
      }));
    }
    if (
      destinationLocationCode === null ||
      destinationLocationCode.length !== 3
    ) {
      setFieldError((prevError) => ({
        ...prevError,
        ["destination"]: "Invalid destination code",
      }));
    }
    if (travelers === null || travelers <= 0 || travelers > 9) {
      setFieldError((prevError) => ({
        ...prevError,
        ["travelers"]: "Invalid travellers number",
      }));
    }
    if (departureDate === null) {
      setFieldError((prevError) => ({
        ...prevError,
        ["departureDate"]: "Invalid depature date",
      }));
    }

    if (
      originLocationCode === null ||
      destinationLocationCode === null ||
      originLocationCode.length !== 3 ||
      destinationLocationCode !== 3 ||
      travelers === null ||
      travelClass === null ||
      departureDate === null ||
      currencyCode === null
    ) {
      return;
    }

    const baseUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers`;
    const query = new URLSearchParams({
      originLocationCode: originLocationCode,
      destinationLocationCode: destinationLocationCode,
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

  return { loading, searchFlights, fieldError };
};

export default useFlightSearch;
