# Search Utility Documentation

A comprehensive, flexible search utility system that provides powerful client-side search capabilities for cached data. The system supports multiple search strategies, debouncing, ranking, and extensive customization options.

## 🚀 Features

- **Flexible Key Matching**: Search across any object properties using dot notation
- **Multiple Search Strategies**: Contains, starts with, ends with, fuzzy matching, regex
- **Debouncing Support**: Configurable debounce timing with option to disable
- **Ranked Results**: Weight different search fields for better relevance
- **Search History**: Automatic tracking of search queries
- **Performance Optimized**: Efficient algorithms with minimal re-renders
- **TypeScript Ready**: Full type safety and IntelliSense support
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 📦 Installation

The search utilities are already included in your project. Import them as needed:

```jsx
import { 
  searchData, 
  debounce, 
  advancedSearch, 
  rankedSearch,
  useSearch,
  useSimpleSearch,
  useInstantSearch 
} from '@/utils/search';
```

## 🧩 Core Functions

### searchData

The primary search function that filters data based on specified criteria.

```jsx
import { searchData } from '@/utils/search';

const products = [
  { id: 1, title: "Laptop", category: { name: "Electronics" }, price: 999 },
  { id: 2, title: "Phone", category: { name: "Electronics" }, price: 599 },
  { id: 3, title: "Book", category: { name: "Books" }, price: 19 }
];

const results = searchData(products, "laptop", {
  keys: {
    title: "title",
    category: "category.name",
    price: "price"
  },
  caseSensitive: false,
  exactMatch: false
});

console.log(results); // [{ id: 1, title: "Laptop", ... }]
```

**Parameters:**
- `data` (Array): The data array to search through
- `query` (string): The search query string
- `searchOptions` (Object): Configuration object

**Search Options:**
- `keys` (Object): Mapping of search fields to data properties
- `caseSensitive` (boolean): Whether search should be case sensitive (default: false)
- `exactMatch` (boolean): Whether to use exact matching (default: false)
- `searchInNestedObjects` (boolean): Whether to search in nested objects (default: true)
- `customMatcher` (Function): Custom matching function for advanced use cases

### debounce

Creates a debounced version of a function to limit execution frequency.

```jsx
import { debounce } from '@/utils/search';

const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 150);

// Multiple rapid calls will only execute the last one after 150ms
debouncedSearch('a');
debouncedSearch('ab');
debouncedSearch('abc'); // Only this will execute
```

**Parameters:**
- `func` (Function): The function to debounce
- `delay` (number): The delay in milliseconds (default: 150)

### advancedSearch

Advanced search with multiple strategies and ranking capabilities.

```jsx
import { advancedSearch } from '@/utils/search';

const results = advancedSearch(products, "electronics", {
  keys: {
    title: "title",
    category: "category.name"
  },
  strategy: "contains", // 'contains', 'startsWith', 'endsWith', 'fuzzy', 'regex'
  caseSensitive: false,
  minScore: 0.3, // For fuzzy search
  regexFlags: 'gi' // For regex search
});
```

**Strategies:**
- `contains`: Default substring matching
- `startsWith`: Match from the beginning
- `endsWith`: Match from the end
- `fuzzy`: Fuzzy matching with scoring
- `regex`: Regular expression matching

### rankedSearch

Search with result ranking based on field weights and match quality.

```jsx
import { rankedSearch } from '@/utils/search';

const results = rankedSearch(products, "laptop", {
  keys: {
    title: "title",
    category: "category.name",
    description: "description"
  },
  weights: {
    title: 3, // Title matches are 3x more important
    category: 2, // Category matches are 2x more important
    description: 1 // Description matches have normal weight
  },
  caseSensitive: false
});
```

## 🎣 React Hooks

### useSearch

The main hook for search functionality with full feature set.

```jsx
import { useSearch } from '@/hooks/useSearch';

function ProductSearch() {
  const searchConfig = {
    keys: {
      title: "title",
      category: "category.name",
      price: "price",
      description: "description"
    },
    debounceDelay: 150,
    useDebounce: true,
    caseSensitive: false,
    exactMatch: false,
    onResultsChange: (results, query) => {
      console.log(`Found ${results.length} results for "${query}"`);
    },
    onSearchStart: (query) => {
      console.log('Search started:', query);
    },
    onSearchEnd: (results) => {
      console.log('Search completed:', results.length, 'results');
    }
  };

  const {
    query,
    results,
    isSearching,
    handleSearch,
    clearSearch,
    hasResults,
    hasQuery,
    resultCount,
    searchHistory,
    getSuggestions
  } = useSearch(products, searchConfig);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search products..."
      />
      
      {isSearching && <div>Searching...</div>}
      
      <div>
        {resultCount} results found
      </div>
      
      {results.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

**Returned Properties:**
- `query`: Current search query
- `results`: Filtered search results
- `isSearching`: Whether a search is in progress
- `handleSearch`: Function to update search query
- `clearSearch`: Function to clear search
- `hasResults`: Boolean indicating if results exist
- `hasQuery`: Boolean indicating if query exists
- `resultCount`: Number of results
- `searchHistory`: Array of previous searches
- `getSuggestions`: Function to get search suggestions

### useSimpleSearch

Simplified hook for basic search functionality.

```jsx
import { useSimpleSearch } from '@/hooks/useSearch';

function SimpleSearch() {
  const { query, results, handleSearch } = useSimpleSearch(
    products,
    {
      title: "title",
      category: "category.name"
    },
    150 // debounce delay
  );

  return (
    <input
      value={query}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### useInstantSearch

Hook for immediate search without debouncing.

```jsx
import { useInstantSearch } from '@/hooks/useSearch';

function InstantSearch() {
  const { query, results, handleSearch } = useInstantSearch(
    products,
    {
      title: "title",
      category: "category.name"
    }
  );

  return (
    <input
      value={query}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Instant search..."
    />
  );
}
```

### useAdvancedSearch

Hook for advanced search with ranking and weights.

```jsx
import { useAdvancedSearch } from '@/hooks/useSearch';

function AdvancedSearch() {
  const { query, results, handleSearch } = useAdvancedSearch(products, {
    keys: {
      title: "title",
      category: "category.name",
      description: "description"
    },
    weights: {
      title: 3,
      category: 2,
      description: 1
    },
    debounceDelay: 200
  });

  return (
    <input
      value={query}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Advanced search..."
    />
  );
}
```

## 🎯 Usage Examples

### Basic Product Search

```jsx
function ProductCatalog() {
  const { data } = useSWR('/api/products', fetcher);
  
  const searchConfig = {
    keys: {
      title: "title",
      category: "category.name",
      price: "price",
      description: "description"
    },
    debounceDelay: 150,
    useDebounce: true
  };

  const { query, results, handleSearch, clearSearch, resultCount } = useSearch(data || [], searchConfig);

  return (
    <div>
      <div className="search-container">
        <input
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products..."
          className="search-input"
        />
        {query && (
          <button onClick={clearSearch} className="clear-button">
            Clear
          </button>
        )}
      </div>
      
      <div className="results-info">
        {resultCount} products found
      </div>
      
      <div className="product-grid">
        {results.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### Multi-Field Search with Weights

```jsx
function BlogSearch() {
  const searchConfig = {
    keys: {
      title: "title",
      content: "content",
      author: "author.name",
      tags: "tags"
    },
    weights: {
      title: 4, // Title matches are most important
      author: 3, // Author matches are important
      content: 2, // Content matches are less important
      tags: 1 // Tag matches are least important
    },
    strategy: "ranked",
    debounceDelay: 200
  };

  const { query, results, handleSearch } = useSearch(blogPosts, searchConfig);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search blog posts..."
      />
      
      {results.map(post => (
        <BlogPost key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### Search with Autocomplete

```jsx
function SearchWithSuggestions() {
  const suggestions = [
    "electronics",
    "books",
    "clothing",
    "home & garden",
    "sports"
  ];

  const { query, results, handleSearch, getSuggestions } = useSearchWithSuggestions(
    products,
    { title: "title", category: "category.name" },
    suggestions
  );

  const [showSuggestions, setShowSuggestions] = useState(false);
  const currentSuggestions = getSuggestions(query);

  return (
    <div className="search-with-suggestions">
      <input
        value={query}
        onChange={(e) => {
          handleSearch(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder="Search with suggestions..."
      />
      
      {showSuggestions && currentSuggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {currentSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => {
                handleSearch(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Custom Search Matcher

```jsx
function CustomSearch() {
  const customMatcher = (item, query, options) => {
    // Custom logic for complex matching
    const title = item.title?.toLowerCase() || '';
    const description = item.description?.toLowerCase() || '';
    
    // Boost score for exact title matches
    if (title === query) return true;
    
    // Check for partial matches
    if (title.includes(query) || description.includes(query)) {
      return true;
    }
    
    // Check for word boundaries
    const words = query.split(' ');
    return words.every(word => 
      title.includes(word) || description.includes(word)
    );
  };

  const searchConfig = {
    keys: {
      title: "title",
      description: "description"
    },
    customMatcher,
    debounceDelay: 100
  };

  const { query, results, handleSearch } = useSearch(products, searchConfig);

  return (
    <input
      value={query}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Custom search..."
    />
  );
}
```

### Search with Filters

```jsx
function SearchWithFilters() {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 1000]
  });

  const searchConfig = {
    keys: {
      title: "title",
      category: "category.name",
      price: "price"
    },
    debounceDelay: 150
  };

  const { query, results, handleSearch } = useSearch(products, searchConfig);

  // Apply additional filters
  const filteredResults = useMemo(() => {
    return results.filter(product => {
      if (filters.category && product.category.name !== filters.category) {
        return false;
      }
      
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      
      return true;
    });
  }, [results, filters]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search products..."
      />
      
      <div className="filters">
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
        </select>
        
        <input
          type="range"
          min="0"
          max="1000"
          value={filters.priceRange[1]}
          onChange={(e) => setFilters(prev => ({ 
            ...prev, 
            priceRange: [prev.priceRange[0], parseInt(e.target.value)] 
          }))}
        />
      </div>
      
      <div className="results">
        {filteredResults.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

## 🎨 Advanced Features

### Search Highlighting

```jsx
import { searchWithHighlight } from '@/utils/search';

function HighlightedSearch() {
  const [query, setQuery] = useState('');
  
  const highlightedResults = useMemo(() => {
    return searchWithHighlight(products, query, {
      keys: {
        title: "title",
        description: "description"
      },
      highlightClass: "search-highlight"
    });
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search with highlighting..."
      />
      
      {highlightedResults.map(product => (
        <div key={product.id}>
          <h3 dangerouslySetInnerHTML={{ __html: product.title }} />
          <p dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      ))}
    </div>
  );
}
```

### Search Analytics

```jsx
function SearchWithAnalytics() {
  const [searchStats, setSearchStats] = useState({
    totalSearches: 0,
    popularQueries: [],
    averageResults: 0
  });

  const searchConfig = {
    keys: {
      title: "title",
      category: "category.name"
    },
    onResultsChange: (results, query) => {
      setSearchStats(prev => ({
        totalSearches: prev.totalSearches + 1,
        popularQueries: [...prev.popularQueries, query].slice(-10),
        averageResults: (prev.averageResults + results.length) / 2
      }));
    }
  };

  const { query, results, handleSearch } = useSearch(products, searchConfig);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search with analytics..."
      />
      
      <div className="analytics">
        <p>Total searches: {searchStats.totalSearches}</p>
        <p>Average results: {searchStats.averageResults.toFixed(1)}</p>
        <p>Recent queries: {searchStats.popularQueries.join(', ')}</p>
      </div>
    </div>
  );
}
```

## 🚀 Performance Optimization

### Memoization

```jsx
function OptimizedSearch() {
  const searchConfig = useMemo(() => ({
    keys: {
      title: "title",
      category: "category.name"
    },
    debounceDelay: 150
  }), []);

  const { query, results, handleSearch } = useSearch(products, searchConfig);

  const memoizedResults = useMemo(() => {
    return results.map(product => ({
      ...product,
      displayTitle: product.title.toUpperCase()
    }));
  }, [results]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Optimized search..."
      />
      
      {memoizedResults.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Virtual Scrolling

```jsx
import { FixedSizeList as List } from 'react-window';

function VirtualizedSearch() {
  const { query, results, handleSearch } = useSearch(products, {
    keys: { title: "title", category: "category.name" }
  });

  const Row = ({ index, style }) => (
    <div style={style}>
      <ProductCard product={results[index]} />
    </div>
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Virtualized search..."
      />
      
      <List
        height={600}
        itemCount={results.length}
        itemSize={200}
      >
        {Row}
      </List>
    </div>
  );
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Search not working**: Check that `keys` object is properly configured
2. **Performance issues**: Use debouncing and memoization
3. **Nested object search**: Ensure dot notation is correct
4. **Case sensitivity**: Verify `caseSensitive` setting

### Debug Mode

```jsx
const searchConfig = {
  keys: {
    title: "title",
    category: "category.name"
  },
  onResultsChange: (results, query) => {
    console.log('Search Debug:', {
      query,
      resultCount: results.length,
      results: results.slice(0, 3) // First 3 results
    });
  }
};
```

## 📊 Best Practices

1. **Use Debouncing**: Always use debouncing for better performance
2. **Optimize Keys**: Only search fields that users actually need
3. **Handle Empty States**: Provide feedback when no results are found
4. **Accessibility**: Include proper ARIA labels and keyboard navigation
5. **Performance**: Use memoization for expensive operations
6. **User Experience**: Provide clear search status and result counts

## 🔧 Configuration Options

### Complete Configuration Object

```jsx
const fullSearchConfig = {
  // Required
  keys: {
    title: "title",
    category: "category.name",
    price: "price"
  },
  
  // Optional
  debounceDelay: 150,
  useDebounce: true,
  caseSensitive: false,
  exactMatch: false,
  strategy: "contains", // 'contains', 'startsWith', 'endsWith', 'fuzzy', 'regex', 'ranked'
  weights: {
    title: 3,
    category: 2,
    price: 1
  },
  
  // Callbacks
  onResultsChange: (results, query) => {},
  onSearchStart: (query) => {},
  onSearchEnd: (results) => {},
  
  // Advanced
  customMatcher: (item, query, options) => boolean,
  minScore: 0.3, // For fuzzy search
  regexFlags: 'gi' // For regex search
};
```

---

## 🎉 Ready to Use!

Your search utility system is now fully integrated and ready to provide powerful search capabilities across your application. The system is designed to be:

- ✅ **Flexible**: Search any object properties with dot notation
- ✅ **Performant**: Debounced with configurable timing
- ✅ **Robust**: Handles edge cases and provides validation
- ✅ **Accessible**: Proper ARIA labels and keyboard support
- ✅ **Extensible**: Custom matchers and advanced strategies
- ✅ **Type Safe**: Full TypeScript support

Start using it in your components and enjoy the enhanced search experience!
