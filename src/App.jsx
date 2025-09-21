import { Icon } from "@iconify/react";
import Navbar from "./layout/navbar";
import useSWR from "swr";
import ProductCard from "./ui/product-card";
import { fetcher } from "./utils/fetcher";
import { SkeletonGrid, ProductCardSkeleton } from "./components/skeleton";
import { useSearch } from "./hooks/useSearch";
import { useFilterSort } from "./hooks/useFilterSort";
import { Typography } from "./components/typography";
import FilterDisplay from "./ui/filter-display";
import SortDisplay from "./ui/sort-display";
import { useState } from "react";

export default function App() {
  const { data, isLoading, error } = useSWR("https://api.escuelajs.co/api/v1/products", fetcher);

  // State for filter and sort dropdowns
  const [openFilter, setOpenFilter] = useState(false);
  const [openSort, setOpenSort] = useState(false);

  // Search configuration for products
  const searchConfig = {
    keys: {
      title: "title",
      category: "category.name",
      price: "price",
      description: "description"
    },
    debounceDelay: 150,
    useDebounce: true,
    caseSensitive: false,
    exactMatch: false,
  };

  const {
    query,
    results,
    isSearching,
    handleSearch,
    clearSearch,
    hasQuery,
    resultCount
  } = useSearch(data || [], searchConfig);

  // Filter and sort functionality
  const {
    categories,
    filteredData,
    selectedCategories,
    priceRange,
    sortOption,
    toggleCategory,
    updatePriceRange,
    updateSortOption,
    clearAll,
    clearSort,
    hasActiveFilters,
    resultCount: filteredCount
  } = useFilterSort(data || []);

  // Handler functions for filter and sort
  const handleFilterToggle = () => setOpenFilter(prev => !prev);
  const handleSortToggle = () => setOpenSort(prev => !prev);

  // Determine which data to display (search results or filtered data)
  const displayData = hasQuery ? results : filteredData;
  const displayCount = hasQuery ? resultCount : filteredCount;

  return (
    <main className="font-open w-full flex flex-col">
      <Navbar />

      <section className="w-full max-w-xs md:max-w-7xl mx-auto my-6 flex flex-col items-start md:flex-row md:items-center px-4">
        <div className="w-full">
          <div role="searchbox" className="relative w-full h-max max-w-xs md:max-w-lg xl:mx-auto flex focus-within:border-slate-400">
            <Icon icon="oui:search" width={20} height={20} className="mt-2 ml-2 text-gray-400" />
            <input
              type="search"
              placeholder="Search the store"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="absolute inset-0 w-full pl-8 h-9 text-base font-open border border-gray-300 rounded-sm"
            />
            {hasQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-2/5 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <Icon icon="line-md:close" width={20} height={20} />
              </button>
            )}
          </div>

          {hasQuery && (
            <div className="text-center text-sm text-gray-600 mt-4">
              {isSearching ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon icon="line-md:loading-loop" width={16} height={16} className="animate-spin" />
                  Searching...
                </span>
              ) : (
                <span>
                  {displayCount} result{displayCount !== 1 ? 's' : ''} found
                  {displayCount === 0 && " - try a different search term"}
                </span>
              )}
            </div>
          )}

        </div>

        <aside className="flex md:items-center space-x-6 mx-auto mt-5 md:mt-2.5">
          {/* Filter Button with Dropdown */}
          <div>
            <Typography.p asChild responsive="true">
              <button
                type="button"
                onClick={handleFilterToggle}
                className={`flex items-center gap-2 px-4 py-2 border rounded-sm transition-colors ${hasActiveFilters
                  ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700"
                  : "border-slate-300 hover:border-slate-400"
                  }`}
              >
                <Icon icon="mynaui:filter" width={24} height={24} />
                Filter
                {hasActiveFilters && (
                  <span className="ml-1 text-xs bg-fuchsia-600 text-white rounded-full px-2 py-0.5">
                    {selectedCategories.length + (priceRange.min || priceRange.max ? 1 : 0)}
                  </span>
                )}
              </button>
            </Typography.p>

            {/* Filter Display */}
            <FilterDisplay
              open={openFilter}
              closeDisplay={handleFilterToggle}
              categories={categories}
              selectedCategories={selectedCategories}
              priceRange={priceRange}
              onToggleCategory={toggleCategory}
              onUpdatePriceRange={updatePriceRange}
              onClearAll={clearAll}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Sort Button with Dropdown */}
          <div>
            <Typography.p asChild responsive="true">
              <button
                type="button"
                onClick={handleSortToggle}
                className={`flex items-center gap-2 px-4 py-2 border rounded-sm transition-colors ${sortOption
                  ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700"
                  : "border-slate-300 hover:border-slate-400"
                  }`}
              >
                <Icon icon="basil:sort-solid" width={24} height={24} />
                Sort
              </button>
            </Typography.p>

            {/* Sort Display */}
            <SortDisplay
              open={openSort}
              closeDisplay={handleSortToggle}
              sortOption={sortOption}
              onUpdateSortOption={updateSortOption}
              onClearSort={clearSort}
            />
          </div>
        </aside>
      </section>

      {isLoading && (
        <SkeletonGrid
          count={8}
          SkeletonComponent={ProductCardSkeleton}
        />
      )}

      <section
        aria-label="Products Section"
        aria-labelledby="Products Section"
        className="relative w-full max-w-7xl mx-auto mb-12 md:px-4 2xl:px-0 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 place-content-center place-items-center md:place-items-start gap-4"
      >
        {error && (
          <div className="col-span-full text-center py-8">
            <p className="text-red-500">Error loading products: {error.message}</p>
          </div>
        )}

        {data && displayData.map((item) => (
          <ProductCard
            key={item?.id}
            data={item}
          />
        ))}
      </section>


    </main>
  )
}