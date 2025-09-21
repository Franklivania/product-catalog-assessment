/**
 * Core search utility for filtering cached data based on multiple criteria
 * Supports flexible key matching, debouncing, and various search strategies
 */

/**
 * Performs a search on an array of data based on specified search criteria
 * @param {Array} data - The data array to search through
 * @param {string} query - The search query string
 * @param {Object} searchOptions - Configuration object for search behavior
 * @param {Object} searchOptions.keys - Object mapping search fields to data properties
 * @param {boolean} searchOptions.caseSensitive - Whether search should be case sensitive (default: false)
 * @param {boolean} searchOptions.exactMatch - Whether to use exact matching (default: false)
 * @param {boolean} searchOptions.searchInNestedObjects - Whether to search in nested object properties (default: true)
 * @param {Function} searchOptions.customMatcher - Custom matching function for advanced use cases
 * @returns {Array} Filtered array of matching items
 */
export const searchData = (data, query, searchOptions = {}) => {
  // Validate inputs
  if (!Array.isArray(data)) {
    console.warn('searchData: data must be an array');
    return [];
  }

  if (!query || typeof query !== 'string') {
    return data; // Return all data if no query
  }

  const {
    keys = {},
    caseSensitive = false,
    exactMatch = false,
    searchInNestedObjects = true,
    customMatcher = null
  } = searchOptions;

  // If no keys specified, return all data
  if (Object.keys(keys).length === 0) {
    console.warn('searchData: No search keys specified');
    return data;
  }

  const normalizedQuery = caseSensitive ? query : query.toLowerCase();

  return data.filter(item => {
    // Use custom matcher if provided
    if (customMatcher && typeof customMatcher === 'function') {
      return customMatcher(item, normalizedQuery, searchOptions);
    }

    // Check each specified key
    return Object.entries(keys).some(([searchKey, dataPath]) => {
      const value = getNestedValue(item, dataPath);
      
      if (value === null || value === undefined) {
        return false;
      }

      const stringValue = String(value);
      const normalizedValue = caseSensitive ? stringValue : stringValue.toLowerCase();

      if (exactMatch) {
        return normalizedValue === normalizedQuery;
      }

      return normalizedValue.includes(normalizedQuery);
    });
  });
};

/**
 * Gets a nested value from an object using dot notation or array notation
 * @param {Object} obj - The object to traverse
 * @param {string|Array} path - The path to the value (e.g., 'user.name' or ['user', 'name'])
 * @returns {*} The value at the specified path
 */
const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined;

  const pathArray = Array.isArray(path) ? path : path.split('.');
  
  return pathArray.reduce((current, key) => {
    if (current === null || current === undefined) {
      return undefined;
    }
    return current[key];
  }, obj);
};

/**
 * Creates a debounced version of a function
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 150) => {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Creates a throttled version of a function
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 100) => {
  let inThrottle;
  
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Advanced search with multiple strategies
 * @param {Array} data - The data array to search
 * @param {string} query - The search query
 * @param {Object} options - Advanced search options
 * @returns {Array} Filtered results
 */
export const advancedSearch = (data, query, options = {}) => {
  const {
    keys = {},
    strategy = 'contains', // 'contains', 'startsWith', 'endsWith', 'fuzzy', 'regex'
    caseSensitive = false,
    minScore = 0.3, // For fuzzy search
    regexFlags = 'gi'
  } = options;

  if (!query || !Array.isArray(data)) {
    return data;
  }

  const normalizedQuery = caseSensitive ? query : query.toLowerCase();

  return data.filter(item => {
    return Object.entries(keys).some(([searchKey, dataPath]) => {
      const value = getNestedValue(item, dataPath);
      
      if (value === null || value === undefined) {
        return false;
      }

      const stringValue = String(value);
      const normalizedValue = caseSensitive ? stringValue : stringValue.toLowerCase();

      switch (strategy) {
        case 'startsWith':
          return normalizedValue.startsWith(normalizedQuery);
        
        case 'endsWith':
          return normalizedValue.endsWith(normalizedQuery);
        
        case 'fuzzy':
          return fuzzyMatch(normalizedValue, normalizedQuery) >= minScore;
        
        case 'regex':
          try {
            const regex = new RegExp(normalizedQuery, regexFlags);
            return regex.test(normalizedValue);
          } catch (error) {
            console.warn('Invalid regex pattern:', normalizedQuery);
            return false;
          }
        
        case 'contains':
        default:
          return normalizedValue.includes(normalizedQuery);
      }
    });
  });
};

/**
 * Simple fuzzy matching algorithm
 * @param {string} text - The text to search in
 * @param {string} pattern - The pattern to match
 * @returns {number} Match score between 0 and 1
 */
const fuzzyMatch = (text, pattern) => {
  if (!text || !pattern) return 0;
  
  let score = 0;
  let patternIndex = 0;
  
  for (let i = 0; i < text.length && patternIndex < pattern.length; i++) {
    if (text[i] === pattern[patternIndex]) {
      score++;
      patternIndex++;
    }
  }
  
  return patternIndex === pattern.length ? score / pattern.length : 0;
};

/**
 * Search utility with result ranking
 * @param {Array} data - The data array to search
 * @param {string} query - The search query
 * @param {Object} options - Search options
 * @returns {Array} Ranked search results
 */
export const rankedSearch = (data, query, options = {}) => {
  const {
    keys = {},
    weights = {}, // Weight different keys differently
    caseSensitive = false
  } = options;

  if (!query || !Array.isArray(data)) {
    return data;
  }

  const normalizedQuery = caseSensitive ? query : query.toLowerCase();
  const defaultWeight = 1;

  const results = data.map(item => {
    let totalScore = 0;
    let matchCount = 0;

    Object.entries(keys).forEach(([searchKey, dataPath]) => {
      const value = getNestedValue(item, dataPath);
      
      if (value !== null && value !== undefined) {
        const stringValue = String(value);
        const normalizedValue = caseSensitive ? stringValue : stringValue.toLowerCase();
        
        if (normalizedValue.includes(normalizedQuery)) {
          const weight = weights[searchKey] || defaultWeight;
          const score = calculateMatchScore(normalizedValue, normalizedQuery);
          totalScore += score * weight;
          matchCount++;
        }
      }
    });

    return {
      item,
      score: matchCount > 0 ? totalScore / matchCount : 0,
      matchCount
    };
  }).filter(result => result.score > 0);

  // Sort by score (highest first)
  results.sort((a, b) => b.score - a.score);

  return results.map(result => result.item);
};

/**
 * Calculate match score based on position and length
 * @param {string} text - The text being searched
 * @param {string} query - The search query
 * @returns {number} Score between 0 and 1
 */
const calculateMatchScore = (text, query) => {
  const index = text.indexOf(query);
  if (index === -1) return 0;
  
  // Higher score for matches at the beginning
  const positionScore = 1 - (index / text.length);
  // Higher score for exact matches
  const lengthScore = query.length / text.length;
  
  return (positionScore + lengthScore) / 2;
};

/**
 * Search with highlighting capabilities
 * @param {Array} data - The data array to search
 * @param {string} query - The search query
 * @param {Object} options - Search options
 * @returns {Array} Results with highlighted matches
 */
export const searchWithHighlight = (data, query, options = {}) => {
  const {
    keys = {},
    highlightClass = 'search-highlight',
    caseSensitive = false
  } = options;

  const results = searchData(data, query, { keys, caseSensitive });

  return results.map(item => {
    const highlightedItem = { ...item };
    
    Object.entries(keys).forEach(([searchKey, dataPath]) => {
      const value = getNestedValue(item, dataPath);
      
      if (value !== null && value !== undefined) {
        const stringValue = String(value);
        const normalizedValue = caseSensitive ? stringValue : stringValue.toLowerCase();
        const normalizedQuery = caseSensitive ? query : query.toLowerCase();
        
        if (normalizedValue.includes(normalizedQuery)) {
          const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, caseSensitive ? 'g' : 'gi');
          const highlightedValue = stringValue.replace(regex, `<span class="${highlightClass}">$1</span>`);
          
          // Update the nested value
          setNestedValue(highlightedItem, dataPath, highlightedValue);
        }
      }
    });
    
    return highlightedItem;
  });
};

/**
 * Sets a nested value in an object using dot notation
 * @param {Object} obj - The object to modify
 * @param {string|Array} path - The path to set
 * @param {*} value - The value to set
 */
const setNestedValue = (obj, path, value) => {
  const pathArray = Array.isArray(path) ? path : path.split('.');
  const lastKey = pathArray.pop();
  
  const target = pathArray.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    return current[key];
  }, obj);
  
  target[lastKey] = value;
};

/**
 * Search utility factory for creating reusable search functions
 * @param {Object} defaultOptions - Default search options
 * @returns {Function} Configured search function
 */
export const createSearchFunction = (defaultOptions = {}) => {
  return (data, query, options = {}) => {
    const mergedOptions = { ...defaultOptions, ...options };
    return searchData(data, query, mergedOptions);
  };
};

/**
 * Utility to validate search configuration
 * @param {Object} config - Search configuration
 * @returns {Object} Validation result
 */
export const validateSearchConfig = (config) => {
  const errors = [];
  const warnings = [];

  if (!config.keys || Object.keys(config.keys).length === 0) {
    errors.push('Search keys must be specified');
  }

  if (config.debounceDelay && (typeof config.debounceDelay !== 'number' || config.debounceDelay < 0)) {
    errors.push('Debounce delay must be a positive number');
  }

  if (config.caseSensitive && typeof config.caseSensitive !== 'boolean') {
    warnings.push('caseSensitive should be a boolean');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
