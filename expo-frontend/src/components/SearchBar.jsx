import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchDropdownTray from './SearchDropdownTray';

// SearchBar handles user input for the live search feature.
// It implements a debounce mechanism to optimize API calls to the backend.
const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ restaurants: [], products: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    // Debounce timer reference
    const debounceRef = useRef(null);

    useEffect(() => {
        // Handle outside click to close the dropdown
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchResults = async (searchQuery) => {
        // If the search query is empty, clear results and stop loading
        if (!searchQuery.trim()) {
            setResults({ restaurants: [], products: [] });
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/api/search/${encodeURIComponent(searchQuery)}`);
            if (response.ok) {
                const data = await response.json();
                setResults(data);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setIsOpen(true);

        // Clear existing timeout
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Set new debounce timeout
        debounceRef.current = setTimeout(() => {
            fetchResults(value);
        }, 300); // 300ms delay
    };

    const handleFocus = () => {
        if (query.trim()) {
            setIsOpen(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && query.trim()) {
            setIsOpen(false); // Close dropdown
            navigate(`/search/${encodeURIComponent(query.trim())}`); // Go to results view
        }
    };

    return (
        <div ref={wrapperRef} className="position-relative w-100" style={{ maxWidth: '500px' }}>
            <div className="input-group shadow-sm wolt-search-wrapper" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <span className="input-group-text border-0 text-muted ps-3 pe-2 wolt-search-icon">
                    🔍
                </span>
                <input 
                    type="text" 
                    className="form-control border-0 py-2 wolt-search-input shadow-none" 
                    placeholder="Search in Wolt..." 
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                />
            </div>
            
            <SearchDropdownTray 
                results={results} 
                isLoading={isLoading} 
                isOpen={isOpen} 
                searchQuery={query}
                onClose={() => setIsOpen(false)}
            />
        </div>
    );
};

export default SearchBar;
