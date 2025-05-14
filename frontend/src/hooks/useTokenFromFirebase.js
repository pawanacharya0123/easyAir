import React, { useEffect, useState } from "react";
// import cors from "cors";

const useTokenFromFirebase = () => {
  const [token, setToken] = useState("");
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(
          "https://us-central1-easyair-ca541.cloudfunctions.net/getAmadeusToken"
        );
        const data = await response.json();
        setToken(data.token);
      } catch (err) {
        console.error("Error fetching token from Firebase:", err);
      }
    };

    fetchToken();
  }, []);

  return token;
};

export default useTokenFromFirebase;
