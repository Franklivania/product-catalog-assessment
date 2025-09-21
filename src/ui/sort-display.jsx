import { Typography } from "@/components/typography";
import { Icon } from "@iconify/react";
import { useClickOutside } from "@/hooks/useClickOutside";
import useDeviceSize from "@/hooks/useDeviceSize";

const sortOptions = [
  { value: '', label: 'Default', icon: 'mdi:sort' },
  { value: 'asc', label: 'Name: A to Z', icon: 'mdi:sort-alphabetical-ascending' },
  { value: 'desc', label: 'Name: Z to A', icon: 'mdi:sort-alphabetical-descending' },
  { value: 'price-low', label: 'Price: Low to High', icon: 'mdi:sort-numeric-ascending' },
  { value: 'price-high', label: 'Price: High to Low', icon: 'mdi:sort-numeric-descending' }
];

export default function SortDisplay({ 
  open, 
  closeDisplay, 
  sortOption = '',
  onUpdateSortOption,
  onClearSort
}) {
  const sortRef = useClickOutside(closeDisplay, open);
  const { isMobile } = useDeviceSize();

  const handleSortSelect = (option) => {
    onUpdateSortOption(option);
    closeDisplay();
  };

  const handleClearSort = () => {
    onClearSort();
  };

  return (
    <section
      ref={sortRef}
      role="dialog"
      aria-label="Sort Display"
      aria-labelledby="Sort Display"
      className={`absolute w-full mt-2 z-50 h-full max-h-[25em] overflow-hidden rounded-sm bg-white border border-slate-300 shadow-lg flex flex-col
        transition-all duration-300 ease-in-out transform origin-top-right
        ${open
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 translate-y-[-10px] pointer-events-none"
        }
        ${isMobile ? "max-w-sm left-1/2 -translate-x-1/2" : "right-4 2xl:right-78 max-w-xs"}
        `}
    >
      <header className="w-full px-4 py-4 flex items-center justify-between border-b border-neutral-300">
        <Typography.h4>Sort Products</Typography.h4>
        <button onClick={closeDisplay}>
          <Icon icon="line-md:close" width={24} height={24} />
        </button>
      </header>

      <section className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortSelect(option.value)}
              className={`w-full flex items-center space-x-3 p-3 rounded-sm transition-colors text-left ${
                sortOption === option.value
                  ? "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Icon 
                icon={option.icon} 
                width={20} 
                height={20} 
                className={sortOption === option.value ? "text-fuchsia-600" : "text-gray-500"}
              />
              <Typography.small className="font-medium">
                {option.label}
              </Typography.small>
              {sortOption === option.value && (
                <Icon 
                  icon="mdi:check" 
                  width={16} 
                  height={16} 
                  className="ml-auto text-fuchsia-600"
                />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Footer with Clear Sort button */}
      {sortOption && (
        <footer className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={handleClearSort}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-sm transition-colors"
          >
            <Icon icon="line-md:close" width={16} height={16} />
            <Typography.small>Clear Sort</Typography.small>
          </button>
        </footer>
      )}
    </section>
  );
}
