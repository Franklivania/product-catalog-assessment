import { Typography } from "@/components/typography";
import { Icon } from "@iconify/react";
import { useClickOutside } from "@/hooks/useClickOutside";
import useDeviceSize from "@/hooks/useDeviceSize";

export default function FilterDisplay({ 
  open, 
  closeDisplay, 
  categories = [], 
  selectedCategories = [], 
  priceRange = { min: '', max: '' },
  onToggleCategory,
  onUpdatePriceRange,
  onClearAll,
  hasActiveFilters = false
}) {
  const filterRef = useClickOutside(closeDisplay, open);
  const { isMobile } = useDeviceSize();

  const handleCategoryToggle = (category) => {
    onToggleCategory(category);
  };

  const handlePriceChange = (field, value) => {
    onUpdatePriceRange(field, value);
  };

  const handleClearAll = () => {
    onClearAll();
  };

  return (
    <section
      ref={filterRef}
      role="dialog"
      aria-label="Filter Display"
      aria-labelledby="Filter Display"
      className={`absolute w-full z-50 h-full mt-2 max-h-[35em] overflow-hidden rounded-sm bg-white border border-slate-300 shadow-lg flex flex-col
        transition-all duration-300 ease-in-out transform origin-top-right
        ${open
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 translate-y-[-10px] pointer-events-none"
        }
        ${isMobile ? "max-w-sm left-1/2 -translate-x-1/2" : "right-30 2xl:right-[26em] max-w-md"}
        `}
    >
      <header className="w-full px-4 py-4 flex items-center justify-between border-b border-neutral-300">
        <Typography.h4>Filter Products</Typography.h4>
        <button onClick={closeDisplay}>
          <Icon icon="line-md:close" width={24} height={24} />
        </button>
      </header>

      <section className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Categories Section */}
        <div className="space-y-3">
          <Typography.h5 className="text-gray-700">Categories</Typography.h5>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {categories.length === 0 ? (
              <Typography.small className="text-gray-500 italic">
                No categories available
              </Typography.small>
            ) : (
              categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="w-4 h-4 text-fuchsia-600 border-gray-300 rounded focus:ring-fuchsia-500 focus:ring-2"
                  />
                  <Typography.small className="text-gray-700">
                    {category}
                  </Typography.small>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Price Range Section */}
        <div className="space-y-3">
          <Typography.h5 className="text-gray-700">Price Range</Typography.h5>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Typography.small className="text-gray-600 min-w-[60px]">
                Min Price:
              </Typography.small>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Typography.small className="text-gray-600 min-w-[60px]">
                Max Price:
              </Typography.small>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                placeholder="No limit"
                min="0"
                step="0.01"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Clear All button */}
      <footer className="border-t border-gray-200 p-4 bg-gray-50">
        <button
          onClick={handleClearAll}
          disabled={!hasActiveFilters}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-sm transition-colors ${
            hasActiveFilters
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Icon icon="line-md:close" width={16} height={16} />
          <Typography.small>Clear All Filters</Typography.small>
        </button>
      </footer>
    </section>
  );
}
