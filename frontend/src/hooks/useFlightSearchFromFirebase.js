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

const useFlightSearchFromFirebase = (token) => {
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
      destinationLocationCode.length !== 3 ||
      travelers === null ||
      travelClass === null ||
      departureDate === null ||
      currencyCode === null
    ) {
      return;
    }

    const requestBody = {
      encryptedToken: token,
      formData: {
        originLocationCode,
        destinationLocationCode,
        departureDate,
        returnDate,
        travelers,
        travelClass,
        currencyCode,
      },
    };

    setLoading(true);

    const url =
      "https://us-central1-easyair-ca541.cloudfunctions.net/searchFlights";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      return result.itineraries;
    } catch (err) {
      console.error("Error fetching flights:", err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, searchFlights, fieldError };
};

export default useFlightSearchFromFirebase;
