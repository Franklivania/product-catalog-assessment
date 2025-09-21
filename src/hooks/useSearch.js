import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  searchData, 
  debounce, 
  advancedSearch, 
  rankedSearch,
  validateSearchConfig 
} from '@/utils/search';

/**
 * Custom hook for search functionality with debouncing and flexible configuration
 * @param {Array} data - The data array to search through
 * @param {Object} searchConfig - Configuration object for search behavior
 * @param {Object} searchConfig.keys - Object mapping search fields to data properties
 * @param {number} searchConfig.debounceDelay - Debounce delay in milliseconds (default: 150)
 * @param {boolean} searchConfig.useDebounce - Whether to use debouncing (default: true)
 * @param {boolean} searchConfig.caseSensitive - Whether search should be case sensitive (default: false)
 * @param {boolean} searchConfig.exactMatch - Whether to use exact matching (default: false)
 * @param {string} searchConfig.strategy - Search strategy ('contains', 'startsWith', 'endsWith', 'fuzzy', 'regex')
 * @param {Object} searchConfig.weights - Weight different keys differently for ranking
 * @param {Function} searchConfig.onResultsChange - Callback when results change
 * @param {Function} searchConfig.onSearchStart - Callback when search starts
 * @param {Function} searchConfig.onSearchEnd - Callback when search ends
 * @returns {Object} Search state and methods
 */
export const useSearch = (data = [], searchConfig = {}) => {
  const {
    keys = {},
    debounceDelay = 150,
    useDebounce = true,
    caseSensitive = false,
    exactMatch = false,
    strategy = 'contains',
    weights = {},
    onResultsChange = null,
    onSearchStart = null,
    onSearchEnd = null,
    ...otherOptions
  } = searchConfig;

  // Validate configuration
  const validation = useMemo(() => validateSearchConfig(searchConfig), [searchConfig]);
  
  if (!validation.isValid) {
    console.error('useSearch: Invalid configuration', validation.errors);
  }

  // State management
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  // Memoized search function based on strategy
  const performSearch = useCallback((searchQuery, searchData) => {
    if (!searchQuery.trim() || !Array.isArray(searchData) || searchData.length === 0) {
      return searchData;
    }

    const searchOptions = {
      keys,
      caseSensitive,
      exactMatch,
      searchInNestedObjects: true,
      ...otherOptions
    };

    switch (strategy) {
      case 'advanced':
        return advancedSearch(searchData, searchQuery, searchOptions);
      
      case 'ranked':
        return rankedSearch(searchData, searchQuery, { ...searchOptions, weights });
      
      case 'contains':
      case 'startsWith':
      case 'endsWith':
      case 'fuzzy':
      case 'regex':
        return advancedSearch(searchData, searchQuery, { ...searchOptions, strategy });
      
      default:
        return searchData(searchData, searchQuery, searchOptions);
    }
  }, [keys, caseSensitive, exactMatch, strategy, weights, otherOptions]);

  // Debounced search function
  const debouncedSearch = useMemo(() => {
    if (!useDebounce) {
      return (searchQuery) => {
        setIsSearching(true);
        onSearchStart?.(searchQuery);
        
        const results = performSearch(searchQuery, data);
        
        setIsSearching(false);
        onSearchEnd?.(results);
        return results;
      };
    }

    return debounce((searchQuery) => {
      setIsSearching(true);
      onSearchStart?.(searchQuery);
      
      const results = performSearch(searchQuery, data);
      
      setIsSearching(false);
      onSearchEnd?.(results);
      return results;
    }, debounceDelay);
  }, [useDebounce, debounceDelay, performSearch, data, onSearchStart, onSearchEnd]);

  // Computed search results
  const results = useMemo(() => {
    if (!query.trim()) {
      return data;
    }

    return performSearch(query, data);
  }, [query, data, performSearch]);

  // Handle query changes
  const handleSearch = useCallback((newQuery) => {
    const trimmedQuery = newQuery.trim();
    
    setQuery(trimmedQuery);
    
    // Add to search history
    if (trimmedQuery && !searchHistory.includes(trimmedQuery)) {
      setSearchHistory(prev => [trimmedQuery, ...prev.slice(0, 9)]); // Keep last 10 searches
    }

    // Trigger debounced search if enabled
    if (useDebounce) {
      debouncedSearch(trimmedQuery);
    }
  }, [useDebounce, debouncedSearch, searchHistory]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setIsSearching(false);
  }, []);

  // Clear search history
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  // Get search suggestions based on history
  const getSuggestions = useCallback((partialQuery = '') => {
    if (!partialQuery.trim()) {
      return searchHistory.slice(0, 5);
    }
    
    return searchHistory.filter(historyItem => 
      historyItem.toLowerCase().includes(partialQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchHistory]);

  // Effect to notify when results change
  useEffect(() => {
    onResultsChange?.(results, query);
  }, [results, query, onResultsChange]);

  // Effect to handle immediate search when debounce is disabled
  useEffect(() => {
    if (!useDebounce && query) {
      setIsSearching(true);
      onSearchStart?.(query);
      
      const searchResults = performSearch(query, data);
      
      setIsSearching(false);
      onSearchEnd?.(searchResults);
    }
  }, [query, useDebounce, performSearch, data, onSearchStart, onSearchEnd]);

  return {
    // State
    query,
    results,
    isSearching,
    searchHistory,
    
    // Methods
    handleSearch,
    clearSearch,
    clearHistory,
    getSuggestions,
    
    // Computed properties
    hasResults: results.length > 0,
    hasQuery: query.length > 0,
    resultCount: results.length,
    totalCount: data.length,
    
    // Configuration
    config: searchConfig,
    validation
  };
};

/**
 * Hook for simple search without advanced features
 * @param {Array} data - The data array to search through
 * @param {Object} keys - Object mapping search fields to data properties
 * @param {number} debounceDelay - Debounce delay in milliseconds (default: 150)
 * @returns {Object} Simple search state and methods
 */
export const useSimpleSearch = (data = [], keys = {}, debounceDelay = 150) => {
  return useSearch(data, {
    keys,
    debounceDelay,
    useDebounce: true,
    caseSensitive: false,
    exactMatch: false
  });
};

/**
 * Hook for instant search without debouncing
 * @param {Array} data - The data array to search through
 * @param {Object} keys - Object mapping search fields to data properties
 * @returns {Object} Instant search state and methods
 */
export const useInstantSearch = (data = [], keys = {}) => {
  return useSearch(data, {
    keys,
    useDebounce: false,
    caseSensitive: false,
    exactMatch: false
  });
};

/**
 * Hook for advanced search with ranking and weights
 * @param {Array} data - The data array to search through
 * @param {Object} searchConfig - Advanced search configuration
 * @returns {Object} Advanced search state and methods
 */
export const useAdvancedSearch = (data = [], searchConfig = {}) => {
  return useSearch(data, {
    strategy: 'ranked',
    useDebounce: true,
    debounceDelay: 200,
    ...searchConfig
  });
};

/**
 * Hook for search with autocomplete/suggestions
 * @param {Array} data - The data array to search through
 * @param {Object} keys - Object mapping search fields to data properties
 * @param {Array} suggestions - Array of predefined suggestions
 * @returns {Object} Search with suggestions state and methods
 */
export const useSearchWithSuggestions = (data = [], keys = {}, suggestions = []) => {
  const searchHook = useSearch(data, {
    keys,
    debounceDelay: 100,
    useDebounce: true
  });

  const getSuggestions = useCallback((partialQuery = '') => {
    if (!partialQuery.trim()) {
      return suggestions.slice(0, 5);
    }
    
    const filteredSuggestions = suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(partialQuery.toLowerCase())
    );
    
    return filteredSuggestions.slice(0, 5);
  }, [suggestions]);

  return {
    ...searchHook,
    getSuggestions: getSuggestions,
    predefinedSuggestions: suggestions
  };
};
