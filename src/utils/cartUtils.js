/**
 * Cart utility functions for calculations, formatting, and operations
 */

/**
 * Format price with currency symbol and locale
 * @param {number} price - Price to format
 * @param {string} currency - Currency code (default: 'NGN')
 * @param {string} locale - Locale string (default: 'en-NG')
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = 'NGN', locale = 'en-NG') => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  } catch (error) {
    console.warn('Price formatting error:', error);
    return `${currency} ${price.toFixed(2)}`;
  }
};

/**
 * Calculate total price for cart items
 * @param {Array} items - Array of cart items
 * @param {Object} options - Calculation options
 * @param {number} options.taxRate - Tax rate as decimal (e.g., 0.1 for 10%)
 * @param {number} options.discountRate - Discount rate as decimal
 * @param {number} options.shippingCost - Fixed shipping cost
 * @returns {Object} Calculated totals
 */
export const calculateCartTotals = (items, options = {}) => {
  const {
    taxRate = 0,
    discountRate = 0,
    shippingCost = 0
  } = options;

  const subtotal = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const discountAmount = subtotal * discountRate;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * taxRate;
  const total = taxableAmount + taxAmount + shippingCost;

  return {
    subtotal,
    discountAmount,
    taxAmount,
    shippingCost,
    total,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    uniqueItems: items.length
  };
};

/**
 * Validate cart item structure
 * @param {Object} item - Item to validate
 * @returns {Object} Validation result
 */
export const validateCartItem = (item) => {
  const errors = [];
  const warnings = [];

  if (!item.id) {
    errors.push('Item ID is required');
  }

  if (!item.title || typeof item.title !== 'string') {
    errors.push('Item title is required and must be a string');
  }

  if (typeof item.price !== 'number' || item.price < 0) {
    errors.push('Item price must be a non-negative number');
  }

  if (typeof item.quantity !== 'number' || item.quantity <= 0) {
    errors.push('Item quantity must be a positive number');
  }

  if (item.image && typeof item.image !== 'string') {
    warnings.push('Item image should be a string URL');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Generate unique cart item ID
 * @param {Object} item - Item data
 * @param {Object} options - ID generation options
 * @returns {string} Unique item ID
 */
export const generateCartItemId = (item, options = {}) => {
  const {
    includeVariants = true,
    separator = '_'
  } = options;

  let baseId = String(item.id || item.title || 'item');
  
  if (includeVariants && item.variants) {
    const variantKeys = Object.keys(item.variants).sort();
    const variantString = variantKeys
      .map(key => `${key}:${item.variants[key]}`)
      .join(separator);
    baseId += `${separator}${variantString}`;
  }

  return baseId;
};

/**
 * Compare two cart items for equality
 * @param {Object} item1 - First item
 * @param {Object} item2 - Second item
 * @param {Object} options - Comparison options
 * @returns {boolean} Whether items are equal
 */
export const compareCartItems = (item1, item2, options = {}) => {
  const {
    compareVariants = true,
    compareMetadata = false
  } = options;

  if (item1.id !== item2.id) return false;
  if (item1.title !== item2.title) return false;
  if (item1.price !== item2.price) return false;

  if (compareVariants && item1.variants && item2.variants) {
    const variantKeys1 = Object.keys(item1.variants).sort();
    const variantKeys2 = Object.keys(item2.variants).sort();
    
    if (variantKeys1.length !== variantKeys2.length) return false;
    
    for (const key of variantKeys1) {
      if (item1.variants[key] !== item2.variants[key]) return false;
    }
  }

  if (compareMetadata && item1.metadata && item2.metadata) {
    return JSON.stringify(item1.metadata) === JSON.stringify(item2.metadata);
  }

  return true;
};

/**
 * Merge duplicate items in cart
 * @param {Array} items - Array of cart items
 * @returns {Array} Array with merged duplicate items
 */
export const mergeDuplicateItems = (items) => {
  const itemMap = new Map();

  items.forEach(item => {
    const key = generateCartItemId(item);
    
    if (itemMap.has(key)) {
      const existingItem = itemMap.get(key);
      existingItem.quantity += item.quantity;
    } else {
      itemMap.set(key, { ...item });
    }
  });

  return Array.from(itemMap.values());
};

/**
 * Sort cart items by various criteria
 * @param {Array} items - Array of cart items
 * @param {Object} options - Sorting options
 * @returns {Array} Sorted array of items
 */
export const sortCartItems = (items, options = {}) => {
  const {
    sortBy = 'title', // 'title', 'price', 'quantity', 'addedAt'
    order = 'asc' // 'asc', 'desc'
  } = options;

  const sortedItems = [...items].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'quantity':
        comparison = a.quantity - b.quantity;
        break;
      case 'addedAt':
        comparison = (a.addedAt || 0) - (b.addedAt || 0);
        break;
      default:
        comparison = 0;
    }

    return order === 'desc' ? -comparison : comparison;
  });

  return sortedItems;
};

/**
 * Filter cart items by criteria
 * @param {Array} items - Array of cart items
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered array of items
 */
export const filterCartItems = (items, filters = {}) => {
  const {
    minPrice = 0,
    maxPrice = Infinity,
    minQuantity = 0,
    maxQuantity = Infinity,
    categories = [],
    searchTerm = ''
  } = filters;

  return items.filter(item => {
    // Price range filter
    if (item.price < minPrice || item.price > maxPrice) {
      return false;
    }

    // Quantity range filter
    if (item.quantity < minQuantity || item.quantity > maxQuantity) {
      return false;
    }

    // Category filter
    if (categories.length > 0 && item.category && !categories.includes(item.category)) {
      return false;
    }

    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(searchLower);
      const matchesDescription = item.description && 
        item.description.toLowerCase().includes(searchLower);
      
      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Calculate shipping cost based on cart
 * @param {Array} items - Array of cart items
 * @param {Object} shippingRules - Shipping calculation rules
 * @returns {number} Shipping cost
 */
export const calculateShipping = (items, shippingRules = {}) => {
  const {
    freeShippingThreshold = 100,
    baseShippingCost = 10,
    perItemShipping = 2,
    maxShippingCost = 50
  } = shippingRules;

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  if (subtotal >= freeShippingThreshold) {
    return 0;
  }

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const calculatedShipping = baseShippingCost + (itemCount * perItemShipping);
  
  return Math.min(calculatedShipping, maxShippingCost);
};

/**
 * Generate cart summary report
 * @param {Array} items - Array of cart items
 * @param {Object} options - Report options
 * @returns {Object} Cart summary report
 */
export const generateCartReport = (items, options = {}) => {
  const {
    includeBreakdown = true,
    includeRecommendations = false,
    currency = 'NGN'
  } = options;

  const totals = calculateCartTotals(items);
  const report = {
    summary: {
      totalItems: totals.itemCount,
      uniqueItems: totals.uniqueItems,
      totalValue: totals.total,
      formattedTotal: formatPrice(totals.total, currency)
    }
  };

  if (includeBreakdown) {
    report.breakdown = {
      subtotal: totals.subtotal,
      discount: totals.discountAmount,
      tax: totals.taxAmount,
      shipping: totals.shippingCost,
      total: totals.total
    };
  }

  if (includeRecommendations) {
    report.recommendations = generateRecommendations(items);
  }

  return report;
};

/**
 * Generate product recommendations based on cart
 * @param {Array} items - Array of cart items
 * @returns {Array} Array of recommendations
 */
const generateRecommendations = (items) => {
  const recommendations = [];

  // Find most expensive item
  const mostExpensive = items.reduce((max, item) => 
    item.price > max.price ? item : max, items[0] || { price: 0 }
  );

  if (mostExpensive.price > 0) {
    recommendations.push({
      type: 'upsell',
      message: `Consider adding protection for your ${mostExpensive.title}`,
      item: mostExpensive
    });
  }

  // Check for free shipping threshold
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const freeShippingThreshold = 100;
  
  if (subtotal < freeShippingThreshold) {
    const remaining = freeShippingThreshold - subtotal;
    recommendations.push({
      type: 'freeshipping',
      message: `Add ${formatPrice(remaining)} more for free shipping!`,
      amount: remaining
    });
  }

  return recommendations;
};

/**
 * Export cart data for external use
 * @param {Array} items - Array of cart items
 * @param {Object} options - Export options
 * @returns {Object} Exported cart data
 */
export const exportCartData = (items, options = {}) => {
  const {
    format = 'json', // 'json', 'csv', 'xml'
    includeMetadata = true,
    includeTotals = true
  } = options;

  const exportData = {
    items: items.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      ...(includeMetadata && { metadata: item.metadata })
    })),
    ...(includeTotals && { totals: calculateCartTotals(items) }),
    exportedAt: new Date().toISOString()
  };

  switch (format) {
    case 'csv':
      return convertToCSV(exportData);
    case 'xml':
      return convertToXML(exportData);
    case 'json':
    default:
      return exportData;
  }
};

/**
 * Convert cart data to CSV format
 * @param {Object} data - Cart data
 * @returns {string} CSV string
 */
const convertToCSV = (data) => {
  const headers = ['ID', 'Title', 'Price', 'Quantity', 'Total'];
  const rows = data.items.map(item => [
    item.id,
    item.title,
    item.price,
    item.quantity,
    item.price * item.quantity
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return csvContent;
};

/**
 * Convert cart data to XML format
 * @param {Object} data - Cart data
 * @returns {string} XML string
 */
const convertToXML = (data) => {
  const itemsXML = data.items.map(item => `
    <item>
      <id>${item.id}</id>
      <title>${item.title}</title>
      <price>${item.price}</price>
      <quantity>${item.quantity}</quantity>
      <total>${item.price * item.quantity}</total>
    </item>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<cart>
  <items>
    ${itemsXML}
  </items>
  <exportedAt>${data.exportedAt}</exportedAt>
</cart>`;
};

/**
 * Validate cart state consistency
 * @param {Object} cartState - Cart state object
 * @returns {Object} Validation result
 */
export const validateCartState = (cartState) => {
  const errors = [];
  const warnings = [];

  if (!Array.isArray(cartState.items)) {
    errors.push('Items must be an array');
    return { isValid: false, errors, warnings };
  }

  // Validate each item
  cartState.items.forEach((item, index) => {
    const itemValidation = validateCartItem(item);
    if (!itemValidation.isValid) {
      errors.push(`Item ${index}: ${itemValidation.errors.join(', ')}`);
    }
    warnings.push(...itemValidation.warnings.map(w => `Item ${index}: ${w}`));
  });

  // Validate totals
  const calculatedTotals = calculateCartTotals(cartState.items);
  
  if (cartState.totalItems !== calculatedTotals.itemCount) {
    errors.push(`Total items mismatch: expected ${calculatedTotals.itemCount}, got ${cartState.totalItems}`);
  }

  if (Math.abs(cartState.totalPrice - calculatedTotals.total) > 0.01) {
    errors.push(`Total price mismatch: expected ${calculatedTotals.total}, got ${cartState.totalPrice}`);
  }

  if (cartState.isEmpty !== (cartState.items.length === 0)) {
    warnings.push('Empty state inconsistency');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
