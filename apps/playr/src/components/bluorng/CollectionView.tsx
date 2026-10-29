'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import Reveal from './Reveal';
import { collections, getCollectionProducts, formatCollectionTitle } from '@/lib/bluorng-data';
import AdvanceFilterDrawer, {
  FilterState,
  INITIAL_FILTER_STATE,
  filterAndSortProducts,
  countActiveFilters,
  TEAM_OPTIONS,
  PRICE_PRESETS,
} from './AdvanceFilterDrawer';

interface CollectionViewProps {
  handle: string;
}

export default function CollectionView({ handle }: CollectionViewProps) {
  const collectionTitle = formatCollectionTitle(handle);
  const col = collections[handle] || {
    title: collectionTitle,
    description: `Explore playR ${collectionTitle} products`,
  };

  const all = useMemo(() => getCollectionProducts(handle), [handle]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);

  // Dynamically compute available product types in this collection for quick chips
  const availableTypes = useMemo(() => {
    return Array.from(new Set(all.map((p) => p.type).filter(Boolean))).sort();
  }, [all]);

  const dynamicChips = useMemo(() => {
    return ['View all', ...availableTypes.slice(0, 8)];
  }, [availableTypes]);

  // Compute filtered items
  const items = useMemo(() => {
    return filterAndSortProducts(all, filters);
  }, [all, filters]);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  // Handler for quick category chips
  const handleChipClick = (c: string) => {
    if (c === 'View all') {
      setFilters((prev) => ({ ...prev, selectedTypes: [] }));
    } else {
      setFilters((prev) => ({ ...prev, selectedTypes: [c] }));
    }
  };

  // Check if a chip is currently active
  const isChipActive = (c: string) => {
    if (c === 'View all') {
      return filters.selectedTypes.length === 0;
    }
    return filters.selectedTypes.length === 1 && filters.selectedTypes[0] === c;
  };

  const coverImage = all[0]?.images[0];

  return (
    <div className="listing w-full max-w-[1720px] mx-auto px-2 sm:px-6 md:px-10 py-4 md:py-8">
      {/* Collection Header Banner */}
      <div className="cat-banner relative w-full aspect-auto sm:aspect-[21/9] md:aspect-[1920/400] min-h-[140px] sm:min-h-[170px] md:min-h-[220px] rounded-[var(--radius-lg)] overflow-hidden mb-6 flex flex-col justify-end p-4 sm:p-6 md:p-10 bg-gradient-to-r from-black/85 via-black/50 to-transparent">
        {coverImage && (
          <img
            src={coverImage}
            alt={collectionTitle}
            className="absolute inset-0 w-full h-full object-cover -z-10 brightness-[0.55]"
          />
        )}
        <nav className="flex items-center gap-2 text-xs text-white/70 mb-1.5">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link href="/collections" className="hover:underline">
            Collections
          </Link>
          <span>/</span>
          <span className="text-white font-medium">{collectionTitle}</span>
        </nav>
        <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white">
          {collectionTitle}
        </h1>
        <p className="text-xs md:text-sm text-white/80 mt-1 max-w-xl line-clamp-2 sm:line-clamp-none">
          {col.description}
        </p>
      </div>

      {/* Listing Toolbar */}
      <div className="listing__head flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
            {items.length} {items.length === 1 ? 'Product' : 'Products'} Available
            {activeFilterCount > 0 && ` (Filtered from ${all.length})`}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
            className="px-3 py-1.5 bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] text-xs font-medium text-[var(--fg)] focus:outline-none cursor-pointer"
            aria-label="Sort products"
          >
            <option value="default">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Highest Discount</option>
            <option value="name">Title: A - Z</option>
            <option value="name-desc">Title: Z - A</option>
          </select>

          {/* Grid Layout Density Toggles */}
          <div className="hidden sm:flex items-center bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] p-1 gap-1">
            <button
              onClick={() => setGridCols(2)}
              className={`px-2 py-1 text-xs font-bold rounded ${
                gridCols === 2 ? 'bg-[var(--fg)] text-[var(--panel)]' : 'text-[var(--muted)]'
              }`}
              aria-label="2 Columns Grid"
            >
              2 Col
            </button>
            <button
              onClick={() => setGridCols(3)}
              className={`px-2 py-1 text-xs font-bold rounded ${
                gridCols === 3 ? 'bg-[var(--fg)] text-[var(--panel)]' : 'text-[var(--muted)]'
              }`}
              aria-label="3 Columns Grid"
            >
              3 Col
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`px-2 py-1 text-xs font-bold rounded ${
                gridCols === 4 ? 'bg-[var(--fg)] text-[var(--panel)]' : 'text-[var(--muted)]'
              }`}
              aria-label="4 Columns Grid"
            >
              4 Col
            </button>
          </div>

          {/* Advance Filters Button */}
          <button
            type="button"
            className={`listing__adv flex items-center gap-2 cursor-pointer transition-all ${
              activeFilterCount > 0
                ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--panel)] font-bold shadow-sm'
                : 'hover:border-[var(--fg)]'
            }`}
            onClick={() => setIsFilterOpen(true)}
            aria-label="Open advance filters"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Advance Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] rounded-full bg-[var(--panel)] text-[var(--fg)] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Category Chips */}
      {dynamicChips.length > 1 && (
        <div className="chips mb-3">
          {dynamicChips.map((c) => (
            <button
              key={c}
              className={`chip ${isChipActive(c) ? 'active' : ''}`}
              onClick={() => handleChipClick(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Active Filters Pill Bar */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-[var(--radius-sm)] bg-[var(--chip)]/60 border border-[var(--line)]">
          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mr-1">
            Active:
          </span>

          {/* Search Query Pill */}
          {filters.searchQuery.trim() && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[var(--panel)] border border-[var(--line)] text-[var(--fg)] shadow-xs">
              <span>&ldquo;{filters.searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="text-[var(--muted)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </span>
          )}

          {/* Selected Types Pills */}
          {filters.selectedTypes.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[var(--panel)] border border-[var(--line)] text-[var(--fg)] shadow-xs"
            >
              <span>{t}</span>
              <button
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    selectedTypes: prev.selectedTypes.filter((item) => item !== t),
                  }))
                }
                className="text-[var(--muted)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </span>
          ))}

          {/* Selected Teams Pills */}
          {filters.selectedTeams.map((teamId) => {
            const team = TEAM_OPTIONS.find((t) => t.id === teamId);
            return (
              <span
                key={teamId}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[var(--panel)] border border-[var(--line)] text-[var(--fg)] shadow-xs"
              >
                <span>{team?.name || teamId}</span>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      selectedTeams: prev.selectedTeams.filter((id) => id !== teamId),
                    }))
                  }
                  className="text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  ✕
                </button>
              </span>
            );
          })}

          {/* Selected Sizes Pills */}
          {filters.selectedSizes.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[var(--panel)] border border-[var(--line)] text-[var(--fg)] shadow-xs"
            >
              <span>Size: {s}</span>
              <button
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    selectedSizes: prev.selectedSizes.filter((item) => item !== s),
                  }))
                }
                className="text-[var(--muted)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </span>
          ))}

          {/* Price Range Pill */}
          {(filters.priceMin !== null || filters.priceMax !== null || filters.pricePreset) && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[var(--panel)] border border-[var(--line)] text-[var(--fg)] shadow-xs">
              <span>
                {filters.pricePreset
                  ? PRICE_PRESETS.find((p) => p.id === filters.pricePreset)?.label
                  : `₹${filters.priceMin ?? 0} – ₹${filters.priceMax ?? '∞'}`}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    priceMin: null,
                    priceMax: null,
                    pricePreset: null,
                  }))
                }
                className="text-[var(--muted)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </span>
          )}

          {/* In Stock Pill */}
          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[var(--panel)] border border-[var(--line)] text-[var(--fg)] shadow-xs">
              <span>In Stock Only</span>
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, inStockOnly: false }))}
                className="text-[var(--muted)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </span>
          )}

          {/* Customizable Pill */}
          {filters.customizableOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[var(--panel)] border border-[var(--line)] text-[var(--fg)] shadow-xs">
              <span>Customizable</span>
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, customizableOnly: false }))}
                className="text-[var(--muted)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </span>
          )}

          {/* On Sale Pill */}
          {filters.onSaleOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-[var(--panel)] border border-[var(--line)] text-[var(--fg)] shadow-xs">
              <span>Deals & Offers</span>
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, onSaleOnly: false }))}
                className="text-[var(--muted)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </span>
          )}

          {/* Clear All Button */}
          <button
            type="button"
            onClick={() => setFilters(INITIAL_FILTER_STATE)}
            className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--fg)] underline ml-auto transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Product Grid */}
      <Reveal
        stagger
        className={`pgrid ${
          gridCols === 2 ? 'pgrid--2col' : gridCols === 3 ? 'pgrid--3col' : 'pgrid--4col'
        }`}
        as="div"
      >
        {items.map((p) => (
          <ProductCard key={p.handle} product={p} gallery={true} />
        ))}
      </Reveal>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="py-16 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-[var(--chip)] flex items-center justify-center text-[var(--muted)]">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[var(--fg)]">No matching products found</h3>
          <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
            Try adjusting your price range, clearing selected filters, or searching for a different keyword.
          </p>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => setFilters(INITIAL_FILTER_STATE)}
              className="mt-2 inline-flex items-center px-4 py-2 text-xs font-bold rounded-full bg-[var(--fg)] text-[var(--panel)] hover:opacity-90 transition-opacity"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}

      {/* Advance Filter Drawer Component */}
      <AdvanceFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        baseProducts={all}
        filteredCount={items.length}
      />
    </div>
  );
}
