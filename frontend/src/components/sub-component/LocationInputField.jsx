import React, { useState } from "react";

const LocationInputField = ({
  label,
  name,
  value,
  onChange,
  onSelect,
  suggestions,
  error,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full col-span-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)} // allow click to register
        onClick={(e) => e.target.select()}
        placeholder="City or airport"
        autoComplete="off"
        className={`w-full border ${
          error ? "border-red-300" : "border-gray-300"
        } rounded-xl px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
      />
      {focused && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white w-full max-h-60 overflow-y-auto border border-gray-200 rounded-xl mt-1 shadow-lg text-xs ">
          {suggestions.map((airport) => (
            <li
              key={airport.id}
              onClick={() => onSelect(name, airport)}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {airport.name} ({airport.iataCode}) - {airport.address?.cityName},{" "}
              {airport.address?.countryCode}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInputField;
