import React, { useState } from "react";
import "./Autocomplete.css";

const sampleData = [
  "Mumbai",
  "Pune",
  "Nagpur",
  "Delhi",
  "Bangalore",
  "Chennai",
];

const AutocompleteInput = ({ label, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);

  const handleInput = (e) => {
    const val = e.target.value;
    onChange(val);

    if (val.length > 0) {
      const filtered = sampleData.filter((item) =>
        item.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="autocomplete">
      <input
        value={value}
        onChange={handleInput}
        placeholder={label}
      />

      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((item, i) => (
            <li key={i} onClick={() => onChange(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;