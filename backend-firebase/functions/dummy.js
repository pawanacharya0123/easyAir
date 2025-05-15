// import * as functions from "firebase-functions";
import functions from "firebase-functions";
import fetch from "node-fetch";
import cors from "cors";
// import dotenv from "dotenv";

const corsHandler = cors({origin: true});
// dotenv.config();

// const clientId = process.env.AMADEUS_CLIENT_ID;
// const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

const clientId = functions.config().amadeus.client_id;
const clientSecret = functions.config().amadeus.client_secret;

if (!clientId || !clientSecret) {
  throw new Error(
      "CLIENT_ID and CLIENT_SECRET must be defined in the .env file",
  );
}

export const getAmadeusToken = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const params = new URLSearchParams();
      params.append("grant_type", "client_credentials");
      params.append("client_id", clientId);
      params.append("client_secret", clientSecret);

      const response = await fetch(
          "https://test.api.amadeus.com/v1/security/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params,
          },
      );

      const data = await response.json();
      res.status(200).json({token: data.access_token});
    } catch (err) {
      console.error("Failed to get token:", err.message);
      res.status(500).json({error: "Failed to get token"});
    }
  });
});
