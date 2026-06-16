import React, { useState, useEffect, useRef } from 'react';
import SearchDropdownTray from './SearchDropdownTray';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ restaurants: [], products: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    const wrapperRef = useRef(null);

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

    return (
        <div ref={wrapperRef} className="position-relative w-100" style={{ maxWidth: '500px' }}>
            <div className="input-group shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <span className="input-group-text bg-white border-0 text-muted ps-3 pe-2">
                    🔍
                </span>
                <input 
                    type="text" 
                    className="form-control border-0 py-2 wolt-search-input shadow-none" 
                    placeholder="Search in Wolt..." 
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    style={{ backgroundColor: '#f3f4f6' }}
                />
            </div>
            
            <SearchDropdownTray 
                results={results} 
                isLoading={isLoading} 
                isOpen={isOpen} 
                searchQuery={query} 
            />
        </div>
    );
};

export default SearchBar;
