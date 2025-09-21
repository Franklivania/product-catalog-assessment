import { cn } from "@/lib/utils";

/**
 * Base skeleton component that provides the animated shimmer effect
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Skeleton variant (default, rounded, circle)
 * @param {string} props.size - Size variant (sm, md, lg, xl)
 * @param {React.ReactNode} props.children - Child elements
 * @param {Object} props.style - Inline styles
 */
export const SkeletonBox = ({ 
  className, 
  variant = "default", 
  size = "md", 
  children, 
  style,
  ...props 
}) => {
  const baseClasses = "animate-pulse bg-gray-200";
  
  const variantClasses = {
    default: "rounded",
    rounded: "rounded-lg",
    circle: "rounded-full"
  };
  
  const sizeClasses = {
    sm: "h-4",
    md: "h-6", 
    lg: "h-8",
    xl: "h-12"
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Skeleton text component for mimicking text content
 * @param {Object} props - Component props
 * @param {number} props.lines - Number of text lines to render
 * @param {string} props.width - Width of text lines (e.g., "w-3/4", "w-full")
 * @param {string} props.className - Additional CSS classes
 */
export const SkeletonText = ({ 
  lines = 1, 
  width = "w-full", 
  className,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonBox
          key={index}
          className={cn(
            width,
            index === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )}
          size="sm"
        />
      ))}
    </div>
  );
};

/**
 * Skeleton image component for mimicking image content
 * @param {Object} props - Component props
 * @param {string} props.aspectRatio - Aspect ratio (square, video, wide)
 * @param {string} props.className - Additional CSS classes
 */
export const SkeletonImage = ({ 
  aspectRatio = "square", 
  className,
  ...props 
}) => {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video", 
    wide: "aspect-[16/9]"
  };

  return (
    <SkeletonBox
      className={cn(
        "w-full",
        aspectClasses[aspectRatio],
        className
      )}
      variant="rounded"
      {...props}
    />
  );
};
