import React from "react";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

const useAirportSuggestions = (query, token) => {
  const [suggestions, setSuggestions] = useState([]);
  const [debouncedQuery] = useDebounce(query, 300);

  const fetchAirports = async () => {
    if (!debouncedQuery || !token) return;
    try {
      const response = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=${debouncedQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      setSuggestions(result.data || []);
    } catch (err) {
      console.error(`Error fetching ${field} airports:`, err);
    }
  };

  useEffect(() => {
    fetchAirports();
  }, [debouncedQuery, token]);

  return suggestions;
};

export default useAirportSuggestions;
