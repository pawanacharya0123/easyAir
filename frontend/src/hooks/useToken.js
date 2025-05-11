import React from "react";
import { useEffect, useState } from "react";

const clientId = import.meta.env.VITE_AMADEUS_CLIENT_ID;
const clientSecret = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;

const useToken = () => {
  const [token, setToken] = useState("");
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
      //   console.log("Access Token:", data.access_token);
      setToken(data.access_token);
    };

    getAccessToken();
  }, []);
  return token;
};

export default useToken;
