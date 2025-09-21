import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for filtering and sorting products
 * @param {Array} data - The products data array
 * @param {Object} options - Configuration options
 * @param {boolean} options.useApiFiltering - Whether to use API filtering (default: false for client-side)
 * @returns {Object} Filter and sort state and methods
 */
export const useFilterSort = (data = [], options = {}) => {
  const { useApiFiltering = false } = options;
  // Filter state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  
  // Sort state
  const [sortOption, setSortOption] = useState('');

  // Get unique categories from data
  const categories = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    const uniqueCategories = [...new Set(
      data
        .map(item => item?.category?.name)
        .filter(Boolean)
    )];
    
    return uniqueCategories.sort();
  }, [data]);

  // Build API query parameters for filtering
  const buildApiQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    
    // Add category filters
    if (selectedCategories.length > 0) {
      // For API, we might need to map category names to IDs or slugs
      // This would require additional API calls to get category mappings
      selectedCategories.forEach(category => {
        params.append('category', category);
      });
    }
    
    // Add price range filters
    if (priceRange.min !== '') {
      params.append('price_min', priceRange.min);
    }
    if (priceRange.max !== '') {
      params.append('price_max', priceRange.max);
    }
    
    return params.toString();
  }, [selectedCategories, priceRange]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    return data.filter(item => {
      // Category filter
      if (selectedCategories.length > 0) {
        const itemCategory = item?.category?.name;
        if (!itemCategory || !selectedCategories.includes(itemCategory)) {
          return false;
        }
      }

      // Price range filter
      const price = Number(item?.price);
      if (!isNaN(price)) {
        if (priceRange.min !== '' && price < Number(priceRange.min)) {
          return false;
        }
        if (priceRange.max !== '' && price > Number(priceRange.max)) {
          return false;
        }
      }

      return true;
    });
  }, [data, selectedCategories, priceRange]);

  // Apply sorting to filtered data
  const sortedData = useMemo(() => {
    if (!Array.isArray(filteredData) || filteredData.length === 0) return filteredData;

    const sorted = [...filteredData];

    switch (sortOption) {
      case 'asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      
      case 'desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      
      case 'price-low':
        return sorted.sort((a, b) => Number(a.price) - Number(b.price));
      
      case 'price-high':
        return sorted.sort((a, b) => Number(b.price) - Number(a.price));
      
      default:
        return sorted;
    }
  }, [filteredData, sortOption]);

  // Category filter methods
  const toggleCategory = useCallback((category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

  const clearCategories = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  // Price range methods
  const updatePriceRange = useCallback((field, value) => {
    setPriceRange(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const clearPriceRange = useCallback(() => {
    setPriceRange({ min: '', max: '' });
  }, []);

  // Sort methods
  const updateSortOption = useCallback((option) => {
    setSortOption(option);
  }, []);

  const clearSort = useCallback(() => {
    setSortOption('');
  }, []);

  // Clear all filters and sorting
  const clearAll = useCallback(() => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setSortOption('');
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return selectedCategories.length > 0 || 
           priceRange.min !== '' || 
           priceRange.max !== '' || 
           sortOption !== '';
  }, [selectedCategories, priceRange, sortOption]);

  return {
    // Data
    categories,
    filteredData: sortedData,
    
    // Filter state
    selectedCategories,
    priceRange,
    
    // Sort state
    sortOption,
    
    // Filter methods
    toggleCategory,
    clearCategories,
    updatePriceRange,
    clearPriceRange,
    
    // Sort methods
    updateSortOption,
    clearSort,
    
    // Utility methods
    clearAll,
    hasActiveFilters,
    
    // API methods
    buildApiQueryParams,
    
    // Computed properties
    resultCount: sortedData.length,
    totalCount: data.length
  };
};
