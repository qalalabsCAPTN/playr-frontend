'use client';

import { useState, useEffect, useMemo } from 'react';
import type { BluorngProduct } from '@/lib/bluorng-data';
import { formatPrice } from '@/lib/bluorng-data';

export interface FilterState {
  searchQuery: string;
  selectedTypes: string[];
  selectedTeams: string[];
  selectedSizes: string[];
  priceMin: number | null;
  priceMax: number | null;
  pricePreset: string | null;
  inStockOnly: boolean;
  customizableOnly: boolean;
  onSaleOnly: boolean;
  sortBy: string;
}

export const INITIAL_FILTER_STATE: FilterState = {
  searchQuery: '',
  selectedTypes: [],
  selectedTeams: [],
  selectedSizes: [],
  priceMin: null,
  priceMax: null,
  pricePreset: null,
  inStockOnly: false,
  customizableOnly: false,
  onSaleOnly: false,
  sortBy: 'default',
};

export const TEAM_OPTIONS = [
  { id: 'csk', name: 'Chennai Super Kings', aliases: ['csk', 'chennai-super-kings', 'playr-x-chennai-super-kings', 'chennai'] },
  { id: 'mi', name: 'Mumbai Indians', aliases: ['mi', 'mumbai-indians', 'playr-x-mumbai-indians', 'mumbai'] },
  { id: 'rr', name: 'Rajasthan Royals', aliases: ['rr', 'rajasthan-royals', 'playr-x-rajasthan-royals', 'rajasthan'] },
  { id: 'kkr', name: 'Kolkata Knight Riders', aliases: ['kkr', 'kolkata-knight-riders', 'playr-x-kolkata-knight-riders', 'kolkata'] },
  { id: 'rcb', name: 'Royal Challengers Bengaluru', aliases: ['rcb', 'royal-challengers', 'royal-challengers-bangalore', 'royal-challengers-bengaluru'] },
  { id: 'lsg', name: 'Lucknow Super Giants', aliases: ['lsg', 'lucknow-super-giants', 'playr-x-lucknow-super-giants', 'lucknow'] },
  { id: 'pbks', name: 'Punjab Kings', aliases: ['pbks', 'punjab-kings', 'playr-x-punjab-kings', 'punjab'] },
  { id: 'srh', name: 'Sunrisers Hyderabad', aliases: ['srh', 'sunrisers-hyderabad', 'playr-x-sunrisers-hyderabad', 'hyderabad'] },
  { id: 'dc', name: 'Delhi Capitals', aliases: ['dc', 'delhi-capitals', 'delhi'] },
  { id: 'gt', name: 'Gujarat Titans', aliases: ['gt', 'gujarat-titans', 'gujarat'] },
  { id: 'tsk', name: 'Texas Super Kings', aliases: ['tsk', 'texas-super-kings'] },
  { id: 'lakr', name: 'LA Knight Riders', aliases: ['lakr', 'los-angeles-knight-riders', 'la-knight-riders'] },
];

export const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Free Size'];

export const PRICE_PRESETS = [
  { id: 'all', label: 'All Prices', min: null, max: null },
  { id: 'under-500', label: 'Under ₹500', min: null, max: 500 },
  { id: '500-1000', label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { id: '1000-2500', label: '₹1,000 – ₹2,500', min: 1000, max: 2500 },
  { id: '2500-5000', label: '₹2,500 – ₹5,000', min: 2500, max: 5000 },
  { id: 'above-5000', label: 'Above ₹5,000', min: 5000, max: null },
];

export const SORT_OPTIONS = [
  { id: 'default', label: 'Featured' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'discount', label: 'Highest Discount' },
  { id: 'name', label: 'Title: A to Z' },
  { id: 'name-desc', label: 'Title: Z to A' },
];

export function countActiveFilters(filters: FilterState): number {
  let count = 0;
  if (filters.searchQuery.trim()) count++;
  if (filters.selectedTypes.length > 0) count += filters.selectedTypes.length;
  if (filters.selectedTeams.length > 0) count += filters.selectedTeams.length;
  if (filters.selectedSizes.length > 0) count += filters.selectedSizes.length;
  if (filters.priceMin !== null || filters.priceMax !== null || (filters.pricePreset && filters.pricePreset !== 'all')) count++;
  if (filters.inStockOnly) count++;
  if (filters.customizableOnly) count++;
  if (filters.onSaleOnly) count++;
  if (filters.sortBy !== 'default') count++;
  return count;
}

export function productMatchesTeam(product: BluorngProduct, teamAliases: string[]): boolean {
  const pCollections = (product.collections || []).map((c) => c.toLowerCase());
  const title = product.title.toLowerCase();
  const handle = product.handle.toLowerCase();

  return teamAliases.some((alias) => {
    const formatted = alias.replace(/-/g, ' ');
    return (
      pCollections.includes(alias) ||
      title.includes(alias) ||
      title.includes(formatted) ||
      handle.includes(alias)
    );
  });
}

export function filterAndSortProducts(
  products: BluorngProduct[],
  filters: FilterState
): BluorngProduct[] {
  let result = [...products];

  // 1. Search Query
  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    result = result.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchType = p.type?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchDetails = p.details?.some((d) => d.toLowerCase().includes(q));
      return matchTitle || matchType || matchDesc || matchDetails;
    });
  }

  // 2. Types / Categories
  if (filters.selectedTypes.length > 0) {
    const typeSet = new Set(filters.selectedTypes.map((t) => t.toLowerCase()));
    result = result.filter((p) => p.type && typeSet.has(p.type.toLowerCase()));
  }

  // 3. Teams
  if (filters.selectedTeams.length > 0) {
    const activeTeamDefs = TEAM_OPTIONS.filter((t) => filters.selectedTeams.includes(t.id));
    result = result.filter((p) =>
      activeTeamDefs.some((team) => productMatchesTeam(p, team.aliases))
    );
  }

  // 4. Sizes
  if (filters.selectedSizes.length > 0) {
    const sizeSet = new Set(filters.selectedSizes.map((s) => s.toLowerCase().trim()));
    result = result.filter((p) => {
      if (!p.sizes || p.sizes.length === 0) return false;
      return p.sizes.some((sz) => sizeSet.has(sz.toLowerCase().trim()));
    });
  }

  // 5. Price Min / Max
  if (filters.priceMin !== null) {
    result = result.filter((p) => p.price >= (filters.priceMin as number));
  }
  if (filters.priceMax !== null) {
    result = result.filter((p) => p.price <= (filters.priceMax as number));
  }

  // 6. In Stock Only
  if (filters.inStockOnly) {
    result = result.filter((p) => !p.soldOut);
  }

  // 7. Customizable Only
  if (filters.customizableOnly) {
    result = result.filter((p) => Boolean(p.customizable || p.handle.includes('jersey')));
  }

  // 8. On Sale Only
  if (filters.onSaleOnly) {
    result = result.filter((p) => Boolean(p.compareAt && p.compareAt > p.price));
  }

  // 9. Sort Order
  if (filters.sortBy === 'price-low') {
    result.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price-high') {
    result.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === 'name') {
    result.sort((a, b) => a.title.localeCompare(b.title));
  } else if (filters.sortBy === 'name-desc') {
    result.sort((a, b) => b.title.localeCompare(a.title));
  } else if (filters.sortBy === 'discount') {
    result.sort((a, b) => {
      const discA = a.compareAt && a.compareAt > a.price ? (a.compareAt - a.price) / a.compareAt : 0;
      const discB = b.compareAt && b.compareAt > b.price ? (b.compareAt - b.price) / b.compareAt : 0;
      return discB - discA;
    });
  }

  return result;
}

interface AdvanceFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (newFilters: FilterState) => void;
  baseProducts: BluorngProduct[];
  filteredCount: number;
}

export default function AdvanceFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  baseProducts,
  filteredCount,
}: AdvanceFilterDrawerProps) {
  const [typeSearch, setTypeSearch] = useState('');

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  // Available Product Types with count
  const availableTypesWithCount = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of baseProducts) {
      if (p.type) {
        counts[p.type] = (counts[p.type] || 0) + 1;
      }
    }
    return Object.entries(counts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [baseProducts]);

  // Available Teams with count
  const availableTeamsWithCount = useMemo(() => {
    return TEAM_OPTIONS.map((team) => {
      const count = baseProducts.filter((p) => productMatchesTeam(p, team.aliases)).length;
      return { ...team, count };
    }).filter((t) => t.count > 0);
  }, [baseProducts]);

  // Available Sizes across products
  const availableSizes = useMemo(() => {
    const foundSizes = new Set<string>();
    for (const p of baseProducts) {
      if (p.sizes) {
        for (const s of p.sizes) {
          const upper = s.toUpperCase().trim();
          if (STANDARD_SIZES.map((sz) => sz.toUpperCase()).includes(upper)) {
            foundSizes.add(upper);
          }
        }
      }
    }
    return STANDARD_SIZES.filter((s) => foundSizes.has(s.toUpperCase()));
  }, [baseProducts]);

  const activeCount = countActiveFilters(filters);

  const handleReset = () => {
    onFiltersChange(INITIAL_FILTER_STATE);
  };

  const toggleType = (type: string) => {
    const exists = filters.selectedTypes.includes(type);
    const newTypes = exists
      ? filters.selectedTypes.filter((t) => t !== type)
      : [...filters.selectedTypes, type];
    onFiltersChange({ ...filters, selectedTypes: newTypes });
  };

  const toggleTeam = (teamId: string) => {
    const exists = filters.selectedTeams.includes(teamId);
    const newTeams = exists
      ? filters.selectedTeams.filter((t) => t !== teamId)
      : [...filters.selectedTeams, teamId];
    onFiltersChange({ ...filters, selectedTeams: newTeams });
  };

  const toggleSize = (size: string) => {
    const exists = filters.selectedSizes.includes(size);
    const newSizes = exists
      ? filters.selectedSizes.filter((s) => s !== size)
      : [...filters.selectedSizes, size];
    onFiltersChange({ ...filters, selectedSizes: newSizes });
  };

  const handlePricePreset = (preset: typeof PRICE_PRESETS[number]) => {
    if (filters.pricePreset === preset.id && preset.id !== 'all') {
      onFiltersChange({
        ...filters,
        pricePreset: null,
        priceMin: null,
        priceMax: null,
      });
    } else {
      onFiltersChange({
        ...filters,
        pricePreset: preset.id,
        priceMin: preset.min,
        priceMax: preset.max,
      });
    }
  };

  const filteredTypes = availableTypesWithCount.filter((item) =>
    item.type.toLowerCase().includes(typeSearch.toLowerCase().trim())
  );

  return (
    <>
      {/* Backdrop Scrim */}
      <div
        className={`scrim ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Drawer Container */}
      <aside
        className={`drawer ${isOpen ? 'open' : ''} !w-[min(480px,calc(100vw-16px))]`}
        aria-label="Advance Filters"
        role="dialog"
      >
        {/* Drawer Header */}
        <div className="drawer__head flex items-center justify-between border-b border-[var(--line)] py-4 px-6 bg-[var(--panel)]">
          <div className="flex items-center gap-2.5">
            <svg
              className="w-4 h-4 text-[var(--fg)]"
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
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--fg)]">
              Filters {activeCount > 0 && `(${activeCount})`}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--fg)] underline transition-colors"
              >
                Reset all
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--chip)] text-lg text-[var(--fg)] transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="drawer__body flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Quick Keyword Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] block">
              Search in Collection
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
                placeholder="Search jerseys, caps, gear, players..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] text-[var(--fg)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--fg)] transition-colors"
              />
              <svg
                className="w-4 h-4 text-[var(--muted)] absolute left-3 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => onFiltersChange({ ...filters, searchQuery: '' })}
                  className="absolute right-2.5 top-2 text-xs text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Sort By Section */}
          <div className="space-y-2 border-t border-[var(--line)] pt-4">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] block">
              Sort By
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onFiltersChange({ ...filters, sortBy: opt.id })}
                  className={`px-3 py-2 text-xs font-medium rounded-[var(--radius-sm)] border text-left transition-colors flex items-center justify-between ${
                    filters.sortBy === opt.id
                      ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--panel)] font-bold'
                      : 'border-[var(--line)] bg-[var(--chip)] text-[var(--fg)] hover:border-[var(--fg)]'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {filters.sortBy === opt.id && <span className="text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Section */}
          <div className="space-y-3 border-t border-[var(--line)] pt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Price Range
              </label>
              {(filters.priceMin !== null || filters.priceMax !== null || filters.pricePreset) && (
                <button
                  type="button"
                  onClick={() =>
                    onFiltersChange({
                      ...filters,
                      priceMin: null,
                      priceMax: null,
                      pricePreset: null,
                    })
                  }
                  className="text-[11px] text-[var(--muted)] hover:text-[var(--fg)] underline"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Price Presets */}
            <div className="flex flex-wrap gap-1.5">
              {PRICE_PRESETS.map((preset) => {
                const isActive = filters.pricePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePricePreset(preset)}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                      isActive
                        ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--panel)] font-bold'
                        : 'border-[var(--line)] bg-[var(--chip)] text-[var(--fg)] hover:border-[var(--fg)]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Min / Max Inputs */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1">
                <span className="text-[10px] text-[var(--muted)] block mb-0.5 font-medium">Min (₹)</span>
                <input
                  type="number"
                  min={0}
                  value={filters.priceMin ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? null : Number(e.target.value);
                    onFiltersChange({
                      ...filters,
                      priceMin: val,
                      pricePreset: null,
                    });
                  }}
                  placeholder="Min"
                  className="w-full px-3 py-1.5 text-xs bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
                />
              </div>
              <span className="text-xs text-[var(--muted)] mt-4">—</span>
              <div className="flex-1">
                <span className="text-[10px] text-[var(--muted)] block mb-0.5 font-medium">Max (₹)</span>
                <input
                  type="number"
                  min={0}
                  value={filters.priceMax ?? ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? null : Number(e.target.value);
                    onFiltersChange({
                      ...filters,
                      priceMax: val,
                      pricePreset: null,
                    });
                  }}
                  placeholder="Max"
                  className="w-full px-3 py-1.5 text-xs bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
                />
              </div>
            </div>
          </div>

          {/* Product Types / Categories Section */}
          {availableTypesWithCount.length > 0 && (
            <div className="space-y-2 border-t border-[var(--line)] pt-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Category ({filters.selectedTypes.length || 'All'})
                </label>
                {filters.selectedTypes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, selectedTypes: [] })}
                    className="text-[11px] text-[var(--muted)] hover:text-[var(--fg)] underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              {availableTypesWithCount.length > 7 && (
                <input
                  type="text"
                  value={typeSearch}
                  onChange={(e) => setTypeSearch(e.target.value)}
                  placeholder="Filter categories..."
                  className="w-full px-3 py-1.5 text-xs bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] text-[var(--fg)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--fg)] mb-2"
                />
              )}

              <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filteredTypes.map(({ type, count }) => {
                  const isChecked = filters.selectedTypes.includes(type);
                  return (
                    <label
                      key={type}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--chip)] cursor-pointer select-none text-xs text-[var(--fg)] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleType(type)}
                          className="w-4 h-4 rounded border-[var(--line)] text-black focus:ring-0 cursor-pointer"
                        />
                        <span className={isChecked ? 'font-bold' : 'font-medium'}>{type}</span>
                      </div>
                      <span className="text-[11px] text-[var(--muted)] font-mono">({count})</span>
                    </label>
                  );
                })}
                {filteredTypes.length === 0 && (
                  <p className="text-xs text-[var(--muted)] py-2 text-center">No categories matching &quot;{typeSearch}&quot;</p>
                )}
              </div>
            </div>
          )}

          {/* Teams / Franchises Section */}
          {availableTeamsWithCount.length > 0 && (
            <div className="space-y-2 border-t border-[var(--line)] pt-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Teams & Franchises ({filters.selectedTeams.length || 'All'})
                </label>
                {filters.selectedTeams.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, selectedTeams: [] })}
                    className="text-[11px] text-[var(--muted)] hover:text-[var(--fg)] underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {availableTeamsWithCount.map((team) => {
                  const isChecked = filters.selectedTeams.includes(team.id);
                  return (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => toggleTeam(team.id)}
                      className={`px-3 py-2 rounded-[var(--radius-sm)] border text-left text-xs transition-all flex items-center justify-between ${
                        isChecked
                          ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--panel)] font-bold'
                          : 'border-[var(--line)] bg-[var(--chip)] text-[var(--fg)] hover:border-[var(--fg)]'
                      }`}
                    >
                      <span className="truncate pr-1">{team.name}</span>
                      <span className="text-[10px] opacity-70">({team.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes Section */}
          {availableSizes.length > 0 && (
            <div className="space-y-2 border-t border-[var(--line)] pt-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Size ({filters.selectedSizes.length || 'All'})
                </label>
                {filters.selectedSizes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, selectedSizes: [] })}
                    className="text-[11px] text-[var(--muted)] hover:text-[var(--fg)] underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => {
                  const isSelected = filters.selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`min-w-[42px] h-9 px-3 text-xs font-semibold rounded-[var(--radius-sm)] border transition-all flex items-center justify-center ${
                        isSelected
                          ? 'border-[var(--fg)] bg-[var(--fg)] text-[var(--panel)] shadow-sm'
                          : 'border-[var(--line)] bg-[var(--chip)] text-[var(--fg)] hover:border-[var(--fg)]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Availability & Specials Section */}
          <div className="space-y-2.5 border-t border-[var(--line)] pt-4 pb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] block">
              Preferences & Perks
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--chip)] cursor-pointer select-none">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => onFiltersChange({ ...filters, inStockOnly: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--line)] text-black focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-medium text-[var(--fg)]">In Stock Only</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                Available
              </span>
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--chip)] cursor-pointer select-none">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={filters.customizableOnly}
                  onChange={(e) => onFiltersChange({ ...filters, customizableOnly: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--line)] text-black focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-medium text-[var(--fg)]">Customizable Merchandise</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
                Name & #
              </span>
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--chip)] cursor-pointer select-none">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={filters.onSaleOnly}
                  onChange={(e) => onFiltersChange({ ...filters, onSaleOnly: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--line)] text-black focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-medium text-[var(--fg)]">Deals & Offers (On Sale)</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded">
                % Off
              </span>
            </label>
          </div>
        </div>

        {/* Drawer Sticky Footer */}
        <div className="drawer__foot border-t border-[var(--line)] p-4 bg-[var(--panel)] flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={activeCount === 0}
            className="px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-full border border-[var(--line)] text-[var(--fg)] hover:bg-[var(--chip)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-5 bg-[var(--fg)] text-[var(--panel)] font-bold text-xs uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
          >
            <span>View {filteredCount} {filteredCount === 1 ? 'Product' : 'Products'}</span>
            <span>→</span>
          </button>
        </div>
      </aside>
    </>
  );
}
