import {decryptToken} from "../utilities/cryptoHelper.js";
import {onRequest} from "firebase-functions/v2/https";
import fetch from "node-fetch";

export const searchFlights = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const {encryptedToken, formData} = req.body;

  if (!encryptedToken || !formData) {
    return res.status(400).json({error: "Missing required fields"});
  }

  const token = decryptToken(encryptedToken);

  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    travelers,
    travelClass,
    currencyCode,
  } = formData;

  if (
    !originLocationCode ||
    !destinationLocationCode ||
    !departureDate ||
    !travelers
  ) {
    return res
        .status(400)
        .json({error: "Missing essential search parameters"});
  }

  const baseUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers`;

  const query = new URLSearchParams({
    originLocationCode,
    destinationLocationCode,
    departureDate,
    ...(returnDate ? {returnDate} : {}),
    adults: travelers,
    ...(travelClass ? {travelClass} : {}),
    ...(currencyCode ? {currencyCode} : {}),
    max: 25,
  });

  try {
    const response = await fetch(`${baseUrl}?${query.toString()}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    const result = await response.json();
    res.status(200).json({itineraries: result});
  } catch (err) {
    console.error("Error fetching flights:", err);
    res.status(500).json({error: "Failed to fetch flight offers"});
  }
});
