# Cart Handling System Documentation

A comprehensive, robust cart handling system built with Zustand that provides complete cart management functionality including persistence, calculations, and extensive customization options.

## 🚀 Features

- **Zustand State Management**: Lightweight, performant state management
- **Local Storage Persistence**: Optional persistence with configurable store names
- **Flexible Item Structure**: Support for any item data structure
- **Real-time Calculations**: Automatic total calculations and updates
- **Bulk Operations**: Add, remove, and update multiple items at once
- **Type Safety**: Full TypeScript support with comprehensive types
- **Performance Optimized**: Efficient algorithms with minimal re-renders

## 📦 Installation

The cart system is already included in your project. Import the store and utilities as needed:

```jsx
import { useCartStore, createCartStore } from '@/store/cartStore';
import { formatPrice, calculateCartTotals } from '@/utils/cartUtils';
```

## 🧩 Core Store

### useCartStore

The main cart store hook that provides all cart functionality.

```jsx
import { useCartStore } from '@/store/cartStore';

function CartComponent() {
  const {
    // State
    items,
    totalItems,
    totalPrice,
    isEmpty,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    incrementItem,
    decrementItem,
    clearCart,
    
    // Utilities
    getItemQuantity,
    isItemInCart,
    getCartSummary
  } = useCartStore();

  return (
    <div>
      <p>Items in cart: {totalItems}</p>
      <p>Total: {formatPrice(totalPrice)}</p>
    </div>
  );
}
```

### createCartStore

Create custom cart stores with specific configurations.

```jsx
import { createCartStore } from '@/store/cartStore';

// Create a custom cart store
const useCustomCartStore = createCartStore({
  storeName: 'my-custom-cart',
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

function CustomCartComponent() {
  const { items, addItem } = useCustomCartStore();
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

## 🎯 Store Methods

### Adding Items

```jsx
const { addItem } = useCartStore();

// Add single item
const item = {
  id: 'product-1',
  title: 'Laptop',
  price: 999,
  image: '/laptop.jpg',
  description: 'High-performance laptop',
  metadata: { category: 'Electronics' }
};

addItem(item, 1); // Add 1 quantity

// Add multiple quantities
addItem(item, 3); // Add 3 quantities

// Add multiple items at once
const { addMultipleItems } = useCartStore();
addMultipleItems([
  { id: 'product-1', title: 'Laptop', price: 999, quantity: 1 },
  { id: 'product-2', title: 'Mouse', price: 25, quantity: 2 }
]);
```

### Removing Items

```jsx
const { removeItem, removeMultipleItems } = useCartStore();

// Remove single item
removeItem('product-1');

// Remove multiple items
removeMultipleItems(['product-1', 'product-2']);
```

### Updating Quantities

```jsx
const { 
  updateQuantity, 
  incrementItem, 
  decrementItem,
  updateMultipleQuantities 
} = useCartStore();

// Update specific quantity
updateQuantity('product-1', 5);

// Increment quantity
incrementItem('product-1', 1); // Add 1
incrementItem('product-1', 3); // Add 3

// Decrement quantity
decrementItem('product-1', 1); // Remove 1
decrementItem('product-1', 2); // Remove 2

// Update multiple quantities
updateMultipleQuantities({
  'product-1': 3,
  'product-2': 1,
  'product-3': 0 // This will remove the item
});
```

### Utility Methods

```jsx
const { 
  getItemQuantity, 
  isItemInCart, 
  getCartSummary,
  getCartItem,
  hasMinimumQuantity,
  getFilteredItems,
  calculateSubtotal
} = useCartStore();

// Check item quantity
const quantity = getItemQuantity('product-1'); // Returns number

// Check if item is in cart
const inCart = isItemInCart('product-1'); // Returns boolean

// Get cart summary
const summary = getCartSummary();
// Returns: { totalItems, totalPrice, isEmpty, itemCount, items }

// Get specific cart item
const cartItem = getCartItem('product-1');

// Check minimum quantity
const hasMinQty = hasMinimumQuantity('product-1', 2); // At least 2 items

// Filter items
const electronics = getFilteredItems(item => 
  item.metadata?.category === 'Electronics'
);

// Calculate subtotal for specific items
const subtotal = calculateSubtotal(['product-1', 'product-2']);
```

## 🎯 Basic Cart Integration

### Adding Cart Functionality to Product Cards

```jsx
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';

function ProductCard({ product }) {
  const { addItem, getItemQuantity, isItemInCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const itemInCart = isItemInCart(product.id);
  const itemQuantity = getItemQuantity(product.id);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAdding(true);
    
    try {
      const cartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
        metadata: { category: product.category }
      };

      addItem(cartItem, 1);
      
      // Simulate API call delay for better UX
      setTimeout(() => {
        setIsAdding(false);
      }, 500);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setIsAdding(false);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      <p>{formatPrice(product.price)}</p>
      
      <div className="cart-controls">
        {itemInCart && (
          <span className="cart-status">
            {itemQuantity} in cart
          </span>
        )}
        
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`add-to-cart ${itemInCart ? 'in-cart' : ''}`}
        >
          {isAdding ? 'Adding...' : itemInCart ? 'Add More' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
```

### Cart Icon with Badge

```jsx
import { useCartStore } from '@/store/cartStore';

function CartIcon() {
  const { totalItems, isEmpty } = useCartStore();

  return (
    <div className="cart-icon">
      <svg className="cart-svg" viewBox="0 0 24 24">
        {/* Your cart icon SVG */}
      </svg>
      
      {!isEmpty && (
        <span className="cart-badge">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </div>
  );
}
```

## 🛠️ Utility Functions

### Price Formatting

```jsx
import { formatPrice } from '@/utils/cartUtils';

// Format price with currency
const formatted = formatPrice(99.99, 'NGN', 'en-NG');
// Returns: "₦99.99"

// Format with different currency
const usd = formatPrice(99.99, 'USD', 'en-US');
// Returns: "$99.99"
```

### Cart Calculations

```jsx
import { calculateCartTotals } from '@/utils/cartUtils';

const totals = calculateCartTotals(cartItems, {
  taxRate: 0.1, // 10% tax
  discountRate: 0.05, // 5% discount
  shippingCost: 10
});

// Returns:
// {
//   subtotal: 100,
//   discountAmount: 5,
//   taxAmount: 9.5,
//   shippingCost: 10,
//   total: 114.5,
//   itemCount: 3,
//   uniqueItems: 2
// }
```

### Item Validation

```jsx
import { validateCartItem, validateCartState } from '@/utils/cartUtils';

// Validate single item
const validation = validateCartItem({
  id: 'product-1',
  title: 'Laptop',
  price: 999,
  quantity: 1
});

if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}

// Validate entire cart state
const stateValidation = validateCartState(cartState);
```

### Advanced Operations

```jsx
import { 
  mergeDuplicateItems, 
  sortCartItems, 
  filterCartItems,
  calculateShipping,
  generateCartReport 
} from '@/utils/cartUtils';

// Merge duplicate items
const mergedItems = mergeDuplicateItems(cartItems);

// Sort items
const sortedItems = sortCartItems(cartItems, {
  sortBy: 'price', // 'title', 'price', 'quantity', 'addedAt'
  order: 'desc' // 'asc', 'desc'
});

// Filter items
const filteredItems = filterCartItems(cartItems, {
  minPrice: 50,
  maxPrice: 500,
  categories: ['Electronics'],
  searchTerm: 'laptop'
});

// Calculate shipping
const shippingCost = calculateShipping(cartItems, {
  freeShippingThreshold: 100,
  baseShippingCost: 10,
  perItemShipping: 2
});

// Generate cart report
const report = generateCartReport(cartItems, {
  includeBreakdown: true,
  includeRecommendations: true,
  currency: 'NGN'
});
```

## 🎯 Usage Examples

### Basic Shopping Cart Page

```jsx
import { useCartStore } from '@/store/cartStore';
import { formatPrice, calculateCartTotals } from '@/utils/cartUtils';

function ShoppingCart() {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    isEmpty,
    clearCart,
    removeItem,
    updateQuantity
  } = useCartStore();

  const totals = calculateCartTotals(items, {
    taxRate: 0.1,
    shippingCost: 10
  });

  const handleCheckout = () => {
    console.log('Proceeding to checkout:', { items, totals });
    // Redirect to checkout page
  };

  if (isEmpty) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Your cart is empty
        </h3>
        <p className="text-gray-500">Add some items to get started!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Shopping Cart ({totalItems} items)
        </h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 text-sm"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg mb-4">
              <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
              
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600">{formatPrice(item.price)}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-12 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border flex items-center justify-center"
                >
                  +
                </button>
              </div>
              
              <div className="text-right">
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(totals.taxAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(totals.shippingCost)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(totals.total)}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Cart Dropdown Menu

```jsx
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/cartUtils';

function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, totalItems, isEmpty, removeItem } = useCartStore();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
        </svg>
        
        {!isEmpty && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                Cart ({totalItems})
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            {isEmpty ? (
              <div className="text-center py-8 text-gray-500">
                Your cart is empty
              </div>
            ) : (
              <div className="space-y-3">
                {items.slice(0, 3).map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {items.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{items.length - 3} more items
                  </p>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between mb-3">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">{formatPrice(totalPrice)}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      // Navigate to cart page
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    View Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Multi-Store Cart System

```jsx
import { createCartStore } from '@/store/cartStore';
import { formatPrice, calculateCartTotals } from '@/utils/cartUtils';

// Create separate cart stores for different sections
const useElectronicsCart = createCartStore({
  storeName: 'electronics-cart',
  persist: true
});

const useBooksCart = createCartStore({
  storeName: 'books-cart',
  persist: true
});

function MultiStoreCart() {
  const electronicsCart = useElectronicsCart();
  const booksCart = useBooksCart();

  const electronicsTotals = calculateCartTotals(electronicsCart.items, { taxRate: 0.1 });
  const booksTotals = calculateCartTotals(booksCart.items, { taxRate: 0.05 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Electronics Cart ({electronicsCart.totalItems})</h3>
        
        {electronicsCart.items.map(item => (
          <div key={item.id} className="flex items-center gap-3 p-3 border rounded mb-2">
            <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-600">{formatPrice(item.price)} × {item.quantity}</p>
            </div>
            <button
              onClick={() => electronicsCart.removeItem(item.id)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(electronicsTotals.total)}</span>
          </div>
          <button
            onClick={() => console.log('Electronics checkout:', electronicsCart.items)}
            className="w-full mt-2 bg-blue-600 text-white py-2 rounded"
          >
            Checkout Electronics
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Books Cart ({booksCart.totalItems})</h3>
        
        {booksCart.items.map(item => (
          <div key={item.id} className="flex items-center gap-3 p-3 border rounded mb-2">
            <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-600">{formatPrice(item.price)} × {item.quantity}</p>
            </div>
            <button
              onClick={() => booksCart.removeItem(item.id)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(booksTotals.total)}</span>
          </div>
          <button
            onClick={() => console.log('Books checkout:', booksCart.items)}
            className="w-full mt-2 bg-green-600 text-white py-2 rounded"
          >
            Checkout Books
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Cart with Wishlist Integration

```jsx
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import { formatPrice } from '@/utils/cartUtils';

function CartWithWishlist() {
  const { items, addItem, removeItem } = useCartStore();
  const [wishlist, setWishlist] = useState([]);

  const moveToWishlist = (item) => {
    setWishlist(prev => [...prev, item]);
    removeItem(item.id);
  };

  const moveToCart = (item) => {
    addItem(item, 1);
    setWishlist(prev => prev.filter(w => w.id !== item.id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Cart ({items.length})</h3>
        
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3 p-3 border rounded mb-2">
            <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-600">{formatPrice(item.price)} × {item.quantity}</p>
            </div>
            <button
              onClick={() => moveToWishlist(item)}
              className="text-yellow-600 hover:text-yellow-700 text-sm"
            >
              Move to Wishlist
            </button>
          </div>
        ))}
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Wishlist ({wishlist.length})</h3>
        
        {wishlist.map(item => (
          <div key={item.id} className="flex items-center gap-3 p-3 border rounded mb-2">
            <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
            </div>
            <button
              onClick={() => moveToCart(item)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Move to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🚀 Advanced Features

### Cart Analytics

```jsx
import { useCartStore } from '@/store/cartStore';
import { generateCartReport } from '@/utils/cartUtils';

function CartAnalytics() {
  const { items } = useCartStore();
  
  const report = generateCartReport(items, {
    includeBreakdown: true,
    includeRecommendations: true,
    currency: 'NGN'
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900">Total Items</h4>
          <p className="text-2xl font-bold text-blue-600">
            {report.summary.totalItems}
          </p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-900">Total Value</h4>
          <p className="text-2xl font-bold text-green-600">
            {report.summary.formattedTotal}
          </p>
        </div>
      </div>
      
      {report.recommendations.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Recommendations</h4>
          {report.recommendations.map((rec, index) => (
            <div key={index} className="p-3 bg-yellow-50 rounded-lg mb-2">
              <p className="text-sm text-yellow-800">{rec.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Cart Persistence Management

```jsx
import { createCartStore } from '@/store/cartStore';
import { useEffect } from 'react';

function CartWithPersistence() {
  const cartStore = createCartStore({
    storeName: 'persistent-cart',
    persist: true
  });

  const { items, clearCart } = cartStore;

  // Clear cart after successful checkout
  useEffect(() => {
    const handleCheckoutSuccess = () => {
      clearCart();
      console.log('Cart cleared after successful checkout');
    };

    // Listen for checkout success event
    window.addEventListener('checkout-success', handleCheckoutSuccess);
    
    return () => {
      window.removeEventListener('checkout-success', handleCheckoutSuccess);
    };
  }, [clearCart]);

  return (
    <div>
      <h3>Cart Items ({items.length})</h3>
      {items.map(item => (
        <div key={item.id} className="p-2 border rounded mb-2">
          <p>{item.title} - {item.quantity} × ${item.price}</p>
        </div>
      ))}
      
      <button
        onClick={() => {
          // Simulate checkout process
          setTimeout(() => {
            window.dispatchEvent(new Event('checkout-success'));
          }, 2000);
        }}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Checkout
      </button>
    </div>
  );
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Items not persisting**: Check that `persist: true` is set in store configuration
2. **Calculations incorrect**: Verify item structure matches expected format
3. **Performance issues**: Use React.memo for cart components
4. **State not updating**: Ensure you're using the correct store instance

### Debug Mode

```jsx
import { useCartStore } from '@/store/cartStore';

function CartDebug() {
  const cartState = useCartStore();
  
  console.log('Cart State:', cartState);
  
  return (
    <div>
      <pre>{JSON.stringify(cartState, null, 2)}</pre>
    </div>
  );
}
```

## 📊 Best Practices

1. **Use Persistence**: Enable persistence for better user experience
2. **Validate Data**: Always validate cart items before adding
3. **Handle Errors**: Implement proper error handling for cart operations
4. **Optimize Performance**: Use React.memo for cart components
5. **Accessibility**: Include proper ARIA labels and keyboard navigation
6. **User Feedback**: Provide clear feedback for cart operations

## 🔧 Configuration Options

### Complete Store Configuration

```jsx
const cartConfig = {
  // Required
  storeName: 'my-cart',
  
  // Optional
  persist: true,
  defaultItem: {
    id: '',
    title: '',
    price: 0,
    quantity: 1,
    image: '',
    metadata: {}
  }
};

const useMyCartStore = createCartStore(cartConfig);
```

---

## 🎉 Ready to Use!

Your cart handling system is now fully integrated and ready to provide comprehensive cart management across your application. The system is designed to be:

- ✅ **Robust**: Handles edge cases and provides validation
- ✅ **Flexible**: Supports any item structure and use case
- ✅ **Performant**: Optimized algorithms with minimal re-renders
- ✅ **Persistent**: Optional localStorage persistence
- ✅ **Accessible**: Proper ARIA labels and keyboard support
- ✅ **Extensible**: Custom stores and advanced features
- ✅ **Type Safe**: Full TypeScript support

Start using it in your components and enjoy the enhanced cart experience!
