import React, { useState, useEffect, useRef } from "react";
import "./Autocomplete.css";

function AutocompleteInput({ label, name, value, onChange, fetchSuggestions }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  const handleInputChange = async (e) => {
    const inputValue = e.target.value;
    onChange(e);

    if (inputValue.length > 1 && fetchSuggestions) {
      const results = await fetchSuggestions(inputValue);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange({ target: { name, value: suggestion } });
    setShowSuggestions(false);
  };

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="form-group autocomplete" ref={wrapperRef}>
      <label>{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        autoComplete="off"
        placeholder="Enter city here"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((item, idx) => (
            <li key={idx} onClick={() => handleSuggestionClick(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutocompleteInput;
