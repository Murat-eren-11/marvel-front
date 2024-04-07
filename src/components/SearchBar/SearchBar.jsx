import { useState } from "react";
import axios from "axios";
import "./SearchBar.css";

const SearchBar = ({ onSearch, context, searchParameter }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (searchTerm) => {
    try {
      let apiUrl;
      let responseFiled;

      if (context === "characters") {
        apiUrl = `${import.meta.env.VITE_API_URL}/characters`;
        responseFiled = "name";
      } else if (context === "comics") {
        apiUrl = `${import.meta.env.VITE_API_URL}/comics`;
        responseFiled = "title";
      }

      const response = await axios.get(apiUrl, {
        params: { [searchParameter]: searchTerm },
      });
      if (responseFiled === "name") {
        const results = response.data.results.filter((suggestion) =>
          suggestion[responseFiled]
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
        setSuggestions(results);
      } else {
        setSuggestions(response.data.results);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    fetchSuggestions(value);
    onSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(
      context === "characters" ? suggestion.name : suggestion.title
    );
    setSuggestions([]);
    onSearch(context === "characters" ? suggestion.name : suggestion.title);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search..."
        className="search-input"
      />
      {suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="suggestion"
            >
              {context === "characters" ? suggestion.name : suggestion.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
