import {onRequest} from "firebase-functions/v2/https";
import {defineString} from "firebase-functions/params";
import {encryptToken} from "../utilities/cryptoHelper.js";
import fetch from "node-fetch";

const clientId = defineString("AMADEUS_CLIENT_ID");
const clientSecret = defineString("AMADEUS_CLIENT_SECRET");

export const getAmadeusToken = onRequest({cors: true}, async (req, res) => {
  try {
    if (!clientId.value() || !clientSecret.value()) {
      throw new Error(
          "AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET must be configured",
      );
    }

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", clientId.value());
    params.append("client_secret", clientSecret.value());

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
    const token = data.access_token;
    const encryptedToken = encryptToken(token);
    res.status(200).json({token: encryptedToken});
  } catch (err) {
    console.error("Failed to get token:", err.message);
    res.status(500).json({error: "Failed to get token"});
  }
});
