import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

const useAirportSuggestionsFromFireBase = (query, token) => {
  const [suggestions, setSuggestions] = useState([]);
  const [debouncedQuery] = useDebounce(query, 300);

  const fetchAirports = async () => {
    if (!debouncedQuery || !token) return;

    const url =
      "https://us-central1-easyair-ca541.cloudfunctions.net/autocompleteAirport";

    const requestBody = {
      encryptedToken: token,
      query: debouncedQuery,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      setSuggestions(result.suggestions || []);
    } catch (err) {
      console.error("Error fetching airport suggestions:", err);
    }
  };

  useEffect(() => {
    fetchAirports();
  }, [debouncedQuery, token]);

  return suggestions;
};

export default useAirportSuggestionsFromFireBase;
