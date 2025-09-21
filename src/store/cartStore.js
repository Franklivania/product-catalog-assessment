import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Cart item structure
 * @typedef {Object} CartItem
 * @property {string|number} id - Unique identifier for the item
 * @property {string} title - Item title/name
 * @property {number} price - Item price
 * @property {number} quantity - Quantity in cart
 * @property {string} image - Item image URL
 * @property {Object} metadata - Additional item data
 */

/**
 * Cart store configuration
 * @typedef {Object} CartConfig
 * @property {string} storeName - Name for the cart store (for localStorage key)
 * @property {boolean} persist - Whether to persist cart to localStorage
 * @property {Object} defaultItem - Default item structure
 */

/**
 * Cart store state and actions
 * @typedef {Object} CartStore
 * @property {CartItem[]} items - Array of cart items
 * @property {number} totalItems - Total number of items in cart
 * @property {number} totalPrice - Total price of all items
 * @property {boolean} isEmpty - Whether cart is empty
 * @property {Function} addItem - Add item to cart
 * @property {Function} removeItem - Remove item from cart
 * @property {Function} updateQuantity - Update item quantity
 * @property {Function} incrementItem - Increment item quantity
 * @property {Function} decrementItem - Decrement item quantity
 * @property {Function} clearCart - Clear all items from cart
 * @property {Function} getItemQuantity - Get quantity of specific item
 * @property {Function} isItemInCart - Check if item is in cart
 * @property {Function} getCartSummary - Get cart summary data
 */

/**
 * Creates a cart store with Zustand
 * @param {CartConfig} config - Cart configuration
 * @returns {CartStore} Cart store instance
 */
export const createCartStore = (config = {}) => {
  const {
    storeName = 'cart',
    persist: shouldPersist = false,
    defaultItem = {}
  } = config;

  const initialState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isEmpty: true
  };

  const cartStore = (set, get) => ({
    ...initialState,

    /**
     * Add item to cart or increment quantity if already exists
     * @param {CartItem} item - Item to add
     * @param {number} quantity - Quantity to add (default: 1)
     */
    addItem: (item, quantity = 1) => {
      set((state) => {
        const existingItemIndex = state.items.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingItemIndex >= 0) {
          // Item exists, increment quantity
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex].quantity += quantity;
          
          return {
            items: updatedItems,
            ...calculateTotals(updatedItems)
          };
        } else {
          // New item, add to cart
          const newItem = {
            ...defaultItem,
            ...item,
            quantity: quantity
          };
          
          const updatedItems = [...state.items, newItem];
          
          return {
            items: updatedItems,
            ...calculateTotals(updatedItems)
          };
        }
      });
    },

    /**
     * Remove item completely from cart
     * @param {string|number} itemId - ID of item to remove
     */
    removeItem: (itemId) => {
      set((state) => {
        const updatedItems = state.items.filter(item => item.id !== itemId);
        
        return {
          items: updatedItems,
          ...calculateTotals(updatedItems)
        };
      });
    },

    /**
     * Update quantity of specific item
     * @param {string|number} itemId - ID of item to update
     * @param {number} quantity - New quantity (must be > 0)
     */
    updateQuantity: (itemId, quantity) => {
      if (quantity <= 0) {
        get().removeItem(itemId);
        return;
      }

      set((state) => {
        const updatedItems = state.items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        
        return {
          items: updatedItems,
          ...calculateTotals(updatedItems)
        };
      });
    },

    /**
     * Increment quantity of specific item
     * @param {string|number} itemId - ID of item to increment
     * @param {number} amount - Amount to increment by (default: 1)
     */
    incrementItem: (itemId, amount = 1) => {
      set((state) => {
        const updatedItems = state.items.map(item =>
          item.id === itemId 
            ? { ...item, quantity: item.quantity + amount }
            : item
        );
        
        return {
          items: updatedItems,
          ...calculateTotals(updatedItems)
        };
      });
    },

    /**
     * Decrement quantity of specific item
     * @param {string|number} itemId - ID of item to decrement
     * @param {number} amount - Amount to decrement by (default: 1)
     */
    decrementItem: (itemId, amount = 1) => {
      set((state) => {
        const updatedItems = state.items.map(item => {
          if (item.id === itemId) {
            const newQuantity = item.quantity - amount;
            return newQuantity <= 0 ? null : { ...item, quantity: newQuantity };
          }
          return item;
        }).filter(Boolean); // Remove null items
        
        return {
          items: updatedItems,
          ...calculateTotals(updatedItems)
        };
      });
    },

    /**
     * Clear all items from cart
     */
    clearCart: () => {
      set(initialState);
    },

    /**
     * Get quantity of specific item in cart
     * @param {string|number} itemId - ID of item to check
     * @returns {number} Quantity of item in cart
     */
    getItemQuantity: (itemId) => {
      const item = get().items.find(cartItem => cartItem.id === itemId);
      return item ? item.quantity : 0;
    },

    /**
     * Check if item is in cart
     * @param {string|number} itemId - ID of item to check
     * @returns {boolean} Whether item is in cart
     */
    isItemInCart: (itemId) => {
      return get().items.some(cartItem => cartItem.id === itemId);
    },

    /**
     * Get cart summary data
     * @returns {Object} Cart summary
     */
    getCartSummary: () => {
      const state = get();
      return {
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
        isEmpty: state.isEmpty,
        itemCount: state.items.length,
        items: state.items
      };
    },

    /**
     * Bulk operations
     */
    
    /**
     * Add multiple items to cart
     * @param {CartItem[]} items - Array of items to add
     */
    addMultipleItems: (items) => {
      set((state) => {
        const updatedItems = [...state.items];
        
        items.forEach(item => {
          const existingItemIndex = updatedItems.findIndex(cartItem => cartItem.id === item.id);
          
          if (existingItemIndex >= 0) {
            updatedItems[existingItemIndex].quantity += item.quantity || 1;
          } else {
            updatedItems.push({
              ...defaultItem,
              ...item,
              quantity: item.quantity || 1
            });
          }
        });
        
        return {
          items: updatedItems,
          ...calculateTotals(updatedItems)
        };
      });
    },

    /**
     * Remove multiple items from cart
     * @param {string|number[]} itemIds - Array of item IDs to remove
     */
    removeMultipleItems: (itemIds) => {
      set((state) => {
        const updatedItems = state.items.filter(item => !itemIds.includes(item.id));
        
        return {
          items: updatedItems,
          ...calculateTotals(updatedItems)
        };
      });
    },

    /**
     * Update multiple item quantities
     * @param {Object} updates - Object with itemId as key and quantity as value
     */
    updateMultipleQuantities: (updates) => {
      set((state) => {
        const updatedItems = state.items.map(item => {
          if (updates.hasOwnProperty(item.id)) {
            const newQuantity = updates[item.id];
            return newQuantity <= 0 ? null : { ...item, quantity: newQuantity };
          }
          return item;
        }).filter(Boolean);
        
        return {
          items: updatedItems,
          ...calculateTotals(updatedItems)
        };
      });
    },

    /**
     * Utility methods
     */
    
    /**
     * Get cart item by ID
     * @param {string|number} itemId - ID of item to get
     * @returns {CartItem|undefined} Cart item or undefined
     */
    getCartItem: (itemId) => {
      return get().items.find(item => item.id === itemId);
    },

    /**
     * Check if cart has specific item with minimum quantity
     * @param {string|number} itemId - ID of item to check
     * @param {number} minQuantity - Minimum quantity required
     * @returns {boolean} Whether item meets minimum quantity
     */
    hasMinimumQuantity: (itemId, minQuantity = 1) => {
      const quantity = get().getItemQuantity(itemId);
      return quantity >= minQuantity;
    },

    /**
     * Get items by category or other criteria
     * @param {Function} filterFn - Filter function
     * @returns {CartItem[]} Filtered items
     */
    getFilteredItems: (filterFn) => {
      return get().items.filter(filterFn);
    },

    /**
     * Calculate subtotal for specific items
     * @param {string|number[]} itemIds - Array of item IDs
     * @returns {number} Subtotal for specified items
     */
    calculateSubtotal: (itemIds) => {
      const items = get().items.filter(item => itemIds.includes(item.id));
      return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  });

  // Apply persistence middleware if enabled
  if (shouldPersist) {
    return create(
      persist(cartStore, {
        name: storeName,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          items: state.items,
          totalItems: state.totalItems,
          totalPrice: state.totalPrice,
          isEmpty: state.isEmpty
        })
      })
    );
  }

  return create(cartStore);
};

/**
 * Calculate cart totals
 * @param {CartItem[]} items - Array of cart items
 * @returns {Object} Calculated totals
 */
const calculateTotals = (items) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const isEmpty = items.length === 0;

  return {
    totalItems,
    totalPrice,
    isEmpty
  };
};

/**
 * Default cart store instance
 * Can be used directly or create custom instances with createCartStore()
 */
export const useCartStore = createCartStore({
  storeName: 'default-cart',
  persist: true,
  defaultItem: {
    id: '',
    title: '',
    price: 0,
    quantity: 1,
    image: '',
    metadata: {}
  }
});

/**
 * Create cart store with custom configuration
 * @param {CartConfig} config - Cart configuration
 * @returns {Function} Zustand store hook
 */
export const createCustomCartStore = (config) => {
  return createCartStore(config);
};
