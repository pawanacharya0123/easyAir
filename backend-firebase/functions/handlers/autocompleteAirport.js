import {onRequest} from "firebase-functions/v2/https";
import {decryptToken} from "../utilities/cryptoHelper.js";
import fetch from "node-fetch";

export const autocompleteAirport = onRequest(
    {cors: true},
    async (req, res) => {
      if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
      }

      try {
        const {encryptedToken, query} = req.body;
        if (!query || !encryptedToken) {
          return res.status(400).json({error: "Missing query or token"});
        }
        const token = decryptToken(encryptedToken);
        const url =
        "https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT";

        const response = await fetch(`${url}&keyword=${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        res.status(200).json({suggestions: result.data || []});
      } catch (err) {
        console.error("Error fetching airport suggestions:", err);
        res.status(500).json({error: "Failed to fetch airport suggestions"});
      }
    },
);
