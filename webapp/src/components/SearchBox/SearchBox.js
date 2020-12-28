import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import './SearchBox.css'


export const SearchBox = ({requestSearch}) => {
  const [query, setQuery] = React.useState("");

  const searchClick = () => {
    if (query) {
      requestSearch(query)
    }
  };

  return (
    <div className="search-container">
      <input 
        className="search-input"
        type="text"
        name="search"
        placeholder="Search"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button className="search-button" onClick={searchClick} data-testid="search-button">
        <div className="search-button-icon">
          <FontAwesomeIcon icon={faSearch} />
        </div>
      </button>
    </div>
  )
};
/*
<i className="fas fa-search icon"/>
*/