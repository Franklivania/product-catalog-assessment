import { SkeletonBox, SkeletonText, SkeletonImage } from "./skeleton-box";

/**
 * ProductCardSkeleton - Mimics the exact structure and layout of ProductCard component
 * Provides a skeleton loader that matches the visual hierarchy of the actual product card
 */
export const ProductCardSkeleton = () => {
  return (
    <div
      role="contentinfo"
      aria-label="Loading product"
      className="relative w-full max-w-xs h-max flex flex-col space-y-3 p-4 border border-slate-400 rounded-xs bg-white"
    >
      {/* Image skeleton - matches ProductCard image container */}
      <div className="w-full h-full flex-1/2">
        <SkeletonImage 
          aspectRatio="square"
          className="w-full h-full"
        />
      </div>
      
      {/* Content skeleton - matches ProductCard content section */}
      <section className="w-full h-full flex-1/2">
        {/* Title skeleton */}
        <div className="mb-3">
          <SkeletonText 
            lines={2} 
            width="w-full"
            className="space-y-1"
          />
        </div>
        
        {/* Price and button skeleton */}
        <div className="w-full flex items-center justify-between">
          {/* Price skeleton */}
          <span className="flex items-center gap-1">
            <SkeletonBox 
              className="w-8 h-4" 
              size="sm"
            />
            <SkeletonBox 
              className="w-12 h-4" 
              size="sm"
            />
          </span>
          
          {/* Button skeleton */}
          <SkeletonBox 
            className="w-24 h-8 rounded"
            variant="rounded"
          />
        </div>
      </section>
    </div>
  );
};
