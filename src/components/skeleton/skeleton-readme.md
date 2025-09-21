# Skeleton Loader Components

A comprehensive, reusable skeleton loader system that provides smooth loading states for your React applications. The skeleton components are designed to mimic the exact structure and layout of your actual components, providing a seamless user experience.

## 🚀 Features

- **Composable Architecture**: Build complex skeletons from simple, reusable parts
- **Responsive Design**: Automatic responsive behavior with customizable grid layouts
- **Type Safety**: Full TypeScript support with comprehensive prop types
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Customizable**: Extensive styling options and variants
- **Performance Optimized**: Lightweight with minimal bundle impact

## 📦 Installation

The skeleton components are already included in your project. Import them as needed:

```jsx
import { 
  SkeletonBox, 
  SkeletonText, 
  SkeletonImage, 
  ProductCardSkeleton,
  SkeletonGrid,
  SkeletonGridPresets,
  useSkeletonLoader 
} from "@/components/skeleton";
```

## 🧩 Core Components

### SkeletonBox

The foundational skeleton component that provides the animated shimmer effect.

```jsx
import { SkeletonBox } from "@/components/skeleton";

// Basic usage
<SkeletonBox className="w-32 h-8" />

// With variants
<SkeletonBox variant="rounded" size="lg" className="w-24 h-24" />

// Circle variant
<SkeletonBox variant="circle" className="w-16 h-16" />
```

**Props:**
- `variant`: `"default" | "rounded" | "circle"` - Visual style variant
- `size`: `"sm" | "md" | "lg" | "xl"` - Predefined size variants
- `className`: Additional CSS classes
- `style`: Inline styles object

### SkeletonText

Mimics text content with configurable lines and widths.

```jsx
import { SkeletonText } from "@/components/skeleton";

// Single line
<SkeletonText />

// Multiple lines with custom width
<SkeletonText lines={3} width="w-3/4" />

// Custom styling
<SkeletonText 
  lines={2} 
  width="w-full" 
  className="space-y-3" 
/>
```

**Props:**
- `lines`: `number` - Number of text lines (default: 1)
- `width`: `string` - Width class (default: "w-full")
- `className`: Additional CSS classes

### SkeletonImage

Mimics image content with various aspect ratios.

```jsx
import { SkeletonImage } from "@/components/skeleton";

// Square image
<SkeletonImage aspectRatio="square" />

// Video aspect ratio
<SkeletonImage aspectRatio="video" />

// Wide aspect ratio
<SkeletonImage aspectRatio="wide" />
```

**Props:**
- `aspectRatio`: `"square" | "video" | "wide"` - Image aspect ratio
- `className`: Additional CSS classes

## 🎯 Specialized Components

### ProductCardSkeleton

Pre-built skeleton that exactly mimics the ProductCard component structure.

```jsx
import { ProductCardSkeleton } from "@/components/skeleton";

// Single skeleton card
<ProductCardSkeleton />

// Use in a grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {Array.from({ length: 6 }).map((_, i) => (
    <ProductCardSkeleton key={i} />
  ))}
</div>
```

## 🌐 Grid Management

### SkeletonGrid

Responsive grid container that manages skeleton layout and responsiveness.

```jsx
import { SkeletonGrid, ProductCardSkeleton } from "@/components/skeleton";

// Basic usage
<SkeletonGrid
  count={8}
  SkeletonComponent={ProductCardSkeleton}
/>

// Custom grid configuration
<SkeletonGrid
  count={6}
  SkeletonComponent={ProductCardSkeleton}
  gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  centerOnMobile={false}
/>
```

**Props:**
- `count`: `number` - Number of skeleton items to display
- `SkeletonComponent`: `React.Component` - The skeleton component to render
- `className`: Additional CSS classes for the container
- `gridClassName`: CSS classes for the grid layout
- `centerOnMobile`: `boolean` - Center items on mobile (default: true)
- `gridProps`: `Object` - Props to pass to each skeleton component

### SkeletonGridPresets

Pre-configured grid layouts for common use cases.

```jsx
import { SkeletonGrid, SkeletonGridPresets, ProductCardSkeleton } from "@/components/skeleton";

// Using presets
<SkeletonGrid
  {...SkeletonGridPresets.productCards}
  SkeletonComponent={ProductCardSkeleton}
/>

<SkeletonGrid
  {...SkeletonGridPresets.blogPosts}
  SkeletonComponent={BlogPostSkeleton}
/>
```

**Available Presets:**
- `productCards`: 8 items, responsive product grid
- `blogPosts`: 6 items, blog post layout
- `userProfiles`: 12 items, user profile grid
- `dashboardCards`: 4 items, dashboard layout

## 🎣 Custom Hook

### useSkeletonLoader

Hook for managing skeleton loading states with clean separation of concerns.

```jsx
import { useSkeletonLoader, ProductCardSkeleton } from "@/components/skeleton";

function ProductList() {
  const { data, isLoading, error } = useSWR("/api/products", fetcher);
  
  const { renderSkeleton } = useSkeletonLoader(
    isLoading,
    8, // skeleton count
    ProductCardSkeleton,
    {
      gridClassName: "grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
      centerOnMobile: true
    }
  );

  if (isLoading) return renderSkeleton();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data?.map(item => (
        <ProductCard key={item.id} data={item} />
      ))}
    </div>
  );
}
```

## 🎨 Advanced Usage Examples

### Custom Skeleton Component

Create your own skeleton component by composing the base components:

```jsx
import { SkeletonBox, SkeletonText, SkeletonImage } from "@/components/skeleton";

const BlogPostSkeleton = () => (
  <article className="bg-white rounded-lg shadow-md p-6">
    {/* Header */}
    <div className="flex items-center space-x-3 mb-4">
      <SkeletonBox variant="circle" className="w-10 h-10" />
      <div className="flex-1">
        <SkeletonText lines={1} width="w-1/3" />
        <SkeletonText lines={1} width="w-1/4" />
      </div>
    </div>
    
    {/* Image */}
    <SkeletonImage aspectRatio="video" className="mb-4" />
    
    {/* Content */}
    <SkeletonText lines={3} />
    <SkeletonText lines={2} width="w-2/3" />
    
    {/* Actions */}
    <div className="flex justify-between items-center mt-6">
      <SkeletonBox className="w-20 h-8" />
      <SkeletonBox className="w-16 h-8" />
    </div>
  </article>
);
```

### Dynamic Skeleton Count

```jsx
function ProductGrid({ isLoading, expectedCount = 8 }) {
  return (
    <SkeletonGrid
      count={isLoading ? expectedCount : 0}
      SkeletonComponent={ProductCardSkeleton}
      gridClassName="grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
    />
  );
}
```

### Conditional Skeleton Rendering

```jsx
function DataTable({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <SkeletonBox className="w-12 h-12" variant="circle" />
            <div className="flex-1 space-y-2">
              <SkeletonText lines={1} width="w-1/2" />
              <SkeletonText lines={1} width="w-1/3" />
            </div>
            <SkeletonBox className="w-20 h-8" />
          </div>
        ))}
      </div>
    );
  }
  
  return <ActualDataTable data={data} />;
}
```

## 🎯 Integration with SWR

Perfect integration with SWR for seamless loading states:

```jsx
import useSWR from "swr";
import { SkeletonGrid, ProductCardSkeleton } from "@/components/skeleton";

function ProductCatalog() {
  const { data, isLoading, error } = useSWR("/api/products", fetcher);
  
  return (
    <section className="products-section">
      {isLoading && (
        <SkeletonGrid
          count={8}
          SkeletonComponent={ProductCardSkeleton}
          className="col-span-full"
        />
      )}
      
      {error && (
        <div className="error-state">
          <p>Error loading products: {error.message}</p>
        </div>
      )}
      
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map(item => (
            <ProductCard key={item.id} data={item} />
          ))}
        </div>
      )}
    </section>
  );
}
```

## 🎨 Styling Customization

### CSS Custom Properties

Override the default skeleton colors using CSS custom properties:

```css
:root {
  --skeleton-bg: #f3f4f6;
  --skeleton-bg-dark: #374151;
}

/* Custom animation */
@keyframes custom-shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
}

.skeleton-custom {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: custom-shimmer 1.5s infinite;
}
```

### Tailwind Configuration

Add custom skeleton utilities to your Tailwind config:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },
      keyframes: {
        skeleton: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.4' },
          '100%': { opacity: '1' },
        }
      }
    }
  }
}
```

## 🚀 Performance Tips

1. **Lazy Loading**: Only render skeletons when needed
2. **Count Optimization**: Use appropriate skeleton counts for your viewport
3. **Component Memoization**: Memoize skeleton components if they're expensive to render
4. **Bundle Size**: Import only the components you need

```jsx
// Good: Import only what you need
import { SkeletonBox } from "@/components/skeleton/SkeletonBox";

// Avoid: Importing everything
import * as Skeleton from "@/components/skeleton";
```

## 🐛 Troubleshooting

### Common Issues

1. **Skeleton not showing**: Ensure `isLoading` state is properly managed
2. **Layout shifts**: Make sure skeleton dimensions match actual content
3. **Responsive issues**: Check grid classes and breakpoints
4. **Animation not working**: Verify CSS animations are enabled

### Debug Mode

Enable debug mode to see skeleton boundaries:

```jsx
<SkeletonBox 
  className="border-2 border-red-500" 
  debug={true} 
/>
```

## 📱 Responsive Behavior

The skeleton system automatically handles responsive behavior:

- **Mobile**: Items are centered using `place-content-center place-items-center`
- **Desktop**: Items align to start using `md:place-items-start`
- **Grid**: Responsive grid columns (1 → 3 → 4 columns)

## 🔧 Extending the System

### Creating Custom Skeletons

```jsx
// Custom skeleton for your specific component
const CustomSkeleton = () => (
  <div className="custom-component-layout">
    <SkeletonImage aspectRatio="square" />
    <div className="content">
      <SkeletonText lines={2} />
      <div className="actions">
        <SkeletonBox className="w-24 h-8" />
        <SkeletonBox className="w-16 h-8" />
      </div>
    </div>
  </div>
);

// Register with the grid system
<SkeletonGrid
  count={6}
  SkeletonComponent={CustomSkeleton}
/>
```

## 📊 Best Practices

1. **Match Dimensions**: Ensure skeleton dimensions match actual content
2. **Consistent Spacing**: Use the same spacing as your actual components
3. **Appropriate Count**: Show enough skeletons to fill the viewport
4. **Accessibility**: Always include proper ARIA labels
5. **Performance**: Use appropriate skeleton counts for your use case

---

## 🎉 Ready to Use!

Your skeleton loader system is now fully integrated and ready to provide smooth loading experiences across your application. The system is designed to be:

- ✅ **Reusable**: Use across different components and pages
- ✅ **Scalable**: Handle any number of skeleton items
- ✅ **Responsive**: Automatic mobile and desktop optimization
- ✅ **Accessible**: Proper ARIA labels and semantic HTML
- ✅ **Performant**: Lightweight with minimal bundle impact

Start using it in your components and enjoy the improved user experience!
