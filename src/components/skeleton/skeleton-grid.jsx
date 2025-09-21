import { cn } from "@/lib/utils";

/**
 * SkeletonGrid - Responsive grid container for skeleton loaders
 * Manages the layout and responsiveness of skeleton components
 * 
 * @param {Object} props - Component props
 * @param {number} props.count - Number of skeleton items to display
 * @param {React.Component} props.SkeletonComponent - The skeleton component to render
 * @param {string} props.className - Additional CSS classes for the grid container
 * @param {Object} props.gridProps - Props to pass to each skeleton component
 * @param {string} props.gridClassName - CSS classes for the grid layout
 * @param {boolean} props.centerOnMobile - Whether to center items on mobile (default: true)
 */
export const SkeletonGrid = ({
  count = 4,
  SkeletonComponent,
  className,
  gridProps = {},
  gridClassName,
  centerOnMobile = true,
  ...props
}) => {
  // Default responsive grid classes
  const defaultGridClasses = cn(
    "relative w-full max-w-7xl mx-auto mb-12 md:px-4 xl:px-0",
    "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
    "gap-4",
    centerOnMobile 
      ? "place-content-center place-items-center md:place-items-start" 
      : "place-items-start"
  );

  const gridClasses = cn(defaultGridClasses, gridClassName);

  return (
    <div className={cn("skeleton-grid", className)} {...props}>
      <div className={gridClasses}>
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonComponent key={index} {...gridProps} />
        ))}
      </div>
    </div>
  );
};

/**
 * Preset skeleton grid configurations for common use cases
 */
export const SkeletonGridPresets = {
  // Product cards grid (matches your current layout)
  productCards: {
    count: 8,
    gridClassName: "grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
    centerOnMobile: true
  },
  
  // Blog posts grid
  blogPosts: {
    count: 6,
    gridClassName: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    centerOnMobile: false
  },
  
  // User profiles grid
  userProfiles: {
    count: 12,
    gridClassName: "grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
    centerOnMobile: true
  },
  
  // Dashboard cards
  dashboardCards: {
    count: 4,
    gridClassName: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    centerOnMobile: false
  }
};

/**
 * Hook for managing skeleton loading states
 * @param {boolean} isLoading - Loading state
 * @param {number} skeletonCount - Number of skeleton items to show
 * @param {React.Component} SkeletonComponent - Component to render as skeleton
 * @param {Object} options - Additional options
 */
export const useSkeletonLoader = (
  isLoading, 
  skeletonCount = 4, 
  SkeletonComponent,
  options = {}
) => {
  const {
    gridClassName,
    centerOnMobile = true,
    gridProps = {}
  } = options;

  return {
    renderSkeleton: () => (
      <SkeletonGrid
        count={skeletonCount}
        SkeletonComponent={SkeletonComponent}
        gridClassName={gridClassName}
        centerOnMobile={centerOnMobile}
        gridProps={gridProps}
      />
    ),
    isLoading
  };
};
