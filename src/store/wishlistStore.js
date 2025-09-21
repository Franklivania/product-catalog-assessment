import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Wishlist item structure
 * @typedef {Object} WishlistItem
 * @property {string|number} id - Unique identifier for the item
 * @property {string} title - Item title/name
 * @property {number} price - Item price
 * @property {string} image - Item image URL
 * @property {Object} metadata - Additional item data
 */

/**
 * Wishlist store configuration
 * @typedef {Object} WishlistConfig
 * @property {string} storeName - Name for the wishlist store (for localStorage key)
 * @property {boolean} persist - Whether to persist wishlist to localStorage
 * @property {Object} defaultItem - Default item structure
 */

/**
 * Wishlist store state and actions
 * @typedef {Object} WishlistStore
 * @property {WishlistItem[]} items - Array of wishlist items
 * @property {number} totalItems - Total number of items in wishlist
 * @property {boolean} isEmpty - Whether wishlist is empty
 * @property {Function} addItem - Add item to wishlist
 * @property {Function} removeItem - Remove item from wishlist
 * @property {Function} toggleItem - Toggle item in wishlist (add if not present, remove if present)
 * @property {Function} clearWishlist - Clear all items from wishlist
 * @property {Function} isItemInWishlist - Check if item is in wishlist
 * @property {Function} getWishlistSummary - Get wishlist summary data
 * @property {Function} moveToCart - Move item from wishlist to cart
 */

/**
 * Creates a wishlist store with Zustand
 * @param {WishlistConfig} config - Wishlist configuration
 * @returns {WishlistStore} Wishlist store instance
 */
export const createWishlistStore = (config = {}) => {
  const {
    storeName = 'wishlist',
    persist: shouldPersist = false,
    defaultItem = {}
  } = config;

  const initialState = {
    items: [],
    totalItems: 0,
    isEmpty: true
  };

  const wishlistStore = (set, get) => ({
    ...initialState,

    /**
     * Add item to wishlist
     * @param {WishlistItem} item - Item to add
     */
    addItem: (item) => {
      set((state) => {
        // Check if item already exists
        const existingItem = state.items.find(wishlistItem => wishlistItem.id === item.id);
        
        if (existingItem) {
          // Item already exists, don't add duplicate
          return state;
        }

        // Add new item
        const newItem = {
          ...defaultItem,
          ...item
        };
        
        const updatedItems = [...state.items, newItem];
        
        return {
          items: updatedItems,
          ...calculateTotals(updatedItems)
        };
      });
    },

    /**
     * Remove item from wishlist
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
     * Toggle item in wishlist (add if not present, remove if present)
     * @param {WishlistItem} item - Item to toggle
     * @returns {boolean} Whether item was added (true) or removed (false)
     */
    toggleItem: (item) => {
      const state = get();
      const isInWishlist = state.isItemInWishlist(item.id);
      
      if (isInWishlist) {
        state.removeItem(item.id);
        return false; // Item was removed
      } else {
        state.addItem(item);
        return true; // Item was added
      }
    },

    /**
     * Clear all items from wishlist
     */
    clearWishlist: () => {
      set(initialState);
    },

    /**
     * Check if item is in wishlist
     * @param {string|number} itemId - ID of item to check
     * @returns {boolean} Whether item is in wishlist
     */
    isItemInWishlist: (itemId) => {
      return get().items.some(wishlistItem => wishlistItem.id === itemId);
    },

    /**
     * Get wishlist summary data
     * @returns {Object} Wishlist summary
     */
    getWishlistSummary: () => {
      const state = get();
      return {
        totalItems: state.totalItems,
        isEmpty: state.isEmpty,
        itemCount: state.items.length,
        items: state.items
      };
    },

    /**
     * Move item from wishlist to cart and remove from wishlist
     * @param {string|number} itemId - ID of item to move
     * @param {Function} addToCartCallback - Callback function to add item to cart
     * @returns {WishlistItem|undefined} The item that was moved, or undefined if not found
     */
    moveToCart: (itemId, addToCartCallback) => {
      const state = get();
      const item = state.items.find(wishlistItem => wishlistItem.id === itemId);
      
      if (item && addToCartCallback) {
        // Add to cart with quantity 1
        addToCartCallback(item, 1);
        
        // Remove from wishlist
        state.removeItem(itemId);
        
        return item;
      }
      
      return undefined;
    },

    /**
     * Utility methods
     */
    
    /**
     * Get wishlist item by ID
     * @param {string|number} itemId - ID of item to get
     * @returns {WishlistItem|undefined} Wishlist item or undefined
     */
    getWishlistItem: (itemId) => {
      return get().items.find(item => item.id === itemId);
    },

    /**
     * Get items by category or other criteria
     * @param {Function} filterFn - Filter function
     * @returns {WishlistItem[]} Filtered items
     */
    getFilteredItems: (filterFn) => {
      return get().items.filter(filterFn);
    }
  });

  // Apply persistence middleware if enabled
  if (shouldPersist) {
    return create(
      persist(wishlistStore, {
        name: storeName,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          items: state.items,
          totalItems: state.totalItems,
          isEmpty: state.isEmpty
        })
      })
    );
  }

  return create(wishlistStore);
};

/**
 * Calculate wishlist totals
 * @param {WishlistItem[]} items - Array of wishlist items
 * @returns {Object} Calculated totals
 */
const calculateTotals = (items) => {
  const totalItems = items.length;
  const isEmpty = items.length === 0;

  return {
    totalItems,
    isEmpty
  };
};

/**
 * Default wishlist store instance
 * Can be used directly or create custom instances with createWishlistStore()
 */
export const useWishlistStore = createWishlistStore({
  storeName: 'default-wishlist',
  persist: true,
  defaultItem: {
    id: '',
    title: '',
    price: 0,
    image: '',
    metadata: {}
  }
});

/**
 * Create wishlist store with custom configuration
 * @param {WishlistConfig} config - Wishlist configuration
 * @returns {Function} Zustand store hook
 */
export const createCustomWishlistStore = (config) => {
  return createWishlistStore(config);
};
