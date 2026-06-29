import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SearchDropdownTray from './SearchDropdownTray';
import { woltTheme } from '../styles/woltTheme';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { apiClient } from '../utils/apiClient';

// SearchBar handles user input for the live search feature.
// It implements a debounce mechanism to optimize API calls to the backend.
const SearchBar = () => {
    const { styles, colors } = useThemeStyles(stylesFactory);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ restaurants: [], products: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    const navigation = useNavigation();
    const debounceRef = useRef(null);

    const fetchResults = async (searchQuery) => {
        // If the search query is empty, clear results and stop loading
        if (!searchQuery.trim()) {
            setResults({ restaurants: [], products: [] });
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const { response, data } = await apiClient(`/api/search/${encodeURIComponent(searchQuery)}`);
            if (response.ok) {
                setResults(data);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (text) => {
        setQuery(text);
        setIsOpen(true);

        // Clear existing timeout
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Set new debounce timeout
        debounceRef.current = setTimeout(() => {
            fetchResults(text);
        }, 300); // 300ms delay
    };

    const handleFocus = () => {
        if (query.trim()) {
            setIsOpen(true);
        }
    };

    const handleSubmitEditing = () => {
        if (query.trim()) {
            setIsOpen(false); // Close dropdown
            navigation.navigate('Search', { query: query.trim() }); // Go to results view passing query as param
        }
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.inputContainer}>
                <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
                <TextInput 
                    style={styles.input}
                    placeholder="Search in Wolt..." 
                    placeholderTextColor={colors.textMuted}
                    value={query}
                    onChangeText={handleInputChange}
                    onFocus={handleFocus}
                    onSubmitEditing={handleSubmitEditing}
                    returnKeyType="search"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>
            
            <SearchDropdownTray 
                results={results} 
                isLoading={isLoading} 
                isOpen={isOpen} 
                searchQuery={query}
                onClose={() => setIsOpen(false)}
            />
        </View>
    );
};

const stylesFactory = (colors, theme) => StyleSheet.create({
    wrapper: {
        width: '100%',
        maxWidth: 500,
        position: 'relative',
        zIndex: 1000, // Important to ensure dropdown stays above other content
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        paddingHorizontal: woltTheme.spacing.medium,
        ...woltTheme.shadows.small,
        height: 48,
    },
    searchIcon: {
        marginRight: woltTheme.spacing.small,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        height: '100%',
    }
});

export default SearchBar;
