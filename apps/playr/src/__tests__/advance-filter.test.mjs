import test from 'node:test';
import assert from 'node:assert/strict';

// Helper mock functions matching AdvanceFilterDrawer implementation
function productMatchesTeam(product, teamAliases) {
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

function countActiveFilters(filters) {
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

const TEAM_OPTIONS = [
  { id: 'csk', name: 'Chennai Super Kings', aliases: ['csk', 'chennai-super-kings', 'playr-x-chennai-super-kings', 'chennai'] },
  { id: 'mi', name: 'Mumbai Indians', aliases: ['mi', 'mumbai-indians', 'playr-x-mumbai-indians', 'mumbai'] },
  { id: 'rr', name: 'Rajasthan Royals', aliases: ['rr', 'rajasthan-royals', 'playr-x-rajasthan-royals', 'rajasthan'] },
];

function filterAndSortProducts(products, filters) {
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
    result = result.filter((p) => p.price >= filters.priceMin);
  }
  if (filters.priceMax !== null) {
    result = result.filter((p) => p.price <= filters.priceMax);
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

const mockCatalog = [
  {
    handle: 'csk-fan-jersey-yellow',
    title: 'Chennai Super Kings Official Fan Jersey',
    price: 1999,
    compareAt: 2499,
    type: 'Jersey',
    collections: ['csk', 'jerseys'],
    description: 'Authentic CSK match replica jersey in bright yellow.',
    details: ['Breathable poly fabric', 'Official lion crest'],
    sizes: ['M', 'L', 'XL'],
    customizable: true,
    soldOut: false,
  },
  {
    handle: 'mi-mesh-cap-blue',
    title: 'Mumbai Indians Mesh Training Cap',
    price: 499,
    compareAt: 799,
    type: 'Cap',
    collections: ['mumbai-indians', 'caps'],
    description: 'Lightweight MI cap with sweatband.',
    details: ['Adjustable snapback'],
    sizes: ['Free Size'],
    customizable: false,
    soldOut: false,
  },
  {
    handle: 'rr-training-shorts-pink',
    title: 'Rajasthan Royals Training Shorts',
    price: 899,
    compareAt: null,
    type: 'Shorts',
    collections: ['rajasthan-royals', 'bottomwear'],
    description: 'Dry-fit performance shorts in royal pink and blue.',
    details: ['Zippered pockets'],
    sizes: ['S', 'M', 'L'],
    customizable: false,
    soldOut: true,
  },
  {
    handle: 'playr-cricket-bat-english-willow',
    title: 'playR Pro English Willow Cricket Bat',
    price: 14999,
    compareAt: 18999,
    type: 'Equipment',
    collections: ['equipment', 'bats'],
    description: 'Handcrafted grade 1 English Willow cricket bat.',
    details: ['Huge sweet spot', 'Toe guard fitted'],
    sizes: ['SH'],
    customizable: false,
    soldOut: false,
  },
];

test('Advance Filters - filter by type', () => {
  const filters = {
    searchQuery: '',
    selectedTypes: ['Jersey'],
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

  const results = filterAndSortProducts(mockCatalog, filters);
  assert.equal(results.length, 1);
  assert.equal(results[0].handle, 'csk-fan-jersey-yellow');
});

test('Advance Filters - filter by team', () => {
  const filters = {
    searchQuery: '',
    selectedTypes: [],
    selectedTeams: ['mi'],
    selectedSizes: [],
    priceMin: null,
    priceMax: null,
    pricePreset: null,
    inStockOnly: false,
    customizableOnly: false,
    onSaleOnly: false,
    sortBy: 'default',
  };

  const results = filterAndSortProducts(mockCatalog, filters);
  assert.equal(results.length, 1);
  assert.equal(results[0].handle, 'mi-mesh-cap-blue');
});

test('Advance Filters - filter by price range', () => {
  const filters = {
    searchQuery: '',
    selectedTypes: [],
    selectedTeams: [],
    selectedSizes: [],
    priceMin: 500,
    priceMax: 2000,
    pricePreset: null,
    inStockOnly: false,
    customizableOnly: false,
    onSaleOnly: false,
    sortBy: 'default',
  };

  const results = filterAndSortProducts(mockCatalog, filters);
  assert.equal(results.length, 2); // 1999 and 899
  assert.ok(results.some((p) => p.handle === 'csk-fan-jersey-yellow'));
  assert.ok(results.some((p) => p.handle === 'rr-training-shorts-pink'));
});

test('Advance Filters - in stock only', () => {
  const filters = {
    searchQuery: '',
    selectedTypes: [],
    selectedTeams: [],
    selectedSizes: [],
    priceMin: null,
    priceMax: null,
    pricePreset: null,
    inStockOnly: true,
    customizableOnly: false,
    onSaleOnly: false,
    sortBy: 'default',
  };

  const results = filterAndSortProducts(mockCatalog, filters);
  assert.equal(results.length, 3);
  assert.ok(!results.some((p) => p.soldOut));
});

test('Advance Filters - on sale only', () => {
  const filters = {
    searchQuery: '',
    selectedTypes: [],
    selectedTeams: [],
    selectedSizes: [],
    priceMin: null,
    priceMax: null,
    pricePreset: null,
    inStockOnly: false,
    customizableOnly: false,
    onSaleOnly: true,
    sortBy: 'default',
  };

  const results = filterAndSortProducts(mockCatalog, filters);
  assert.equal(results.length, 3); // csk jersey, mi cap, bat have compareAt > price
});

test('Advance Filters - customizable only', () => {
  const filters = {
    searchQuery: '',
    selectedTypes: [],
    selectedTeams: [],
    selectedSizes: [],
    priceMin: null,
    priceMax: null,
    pricePreset: null,
    inStockOnly: false,
    customizableOnly: true,
    onSaleOnly: false,
    sortBy: 'default',
  };

  const results = filterAndSortProducts(mockCatalog, filters);
  assert.equal(results.length, 1);
  assert.equal(results[0].handle, 'csk-fan-jersey-yellow');
});

test('Advance Filters - sort price low to high', () => {
  const filters = {
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
    sortBy: 'price-low',
  };

  const results = filterAndSortProducts(mockCatalog, filters);
  assert.equal(results[0].price, 499);
  assert.equal(results[results.length - 1].price, 14999);
});

test('Advance Filters - countActiveFilters calculates accurately', () => {
  const filters = {
    searchQuery: 'yellow',
    selectedTypes: ['Jersey'],
    selectedTeams: ['csk'],
    selectedSizes: ['M', 'L'],
    priceMin: 500,
    priceMax: 3000,
    pricePreset: null,
    inStockOnly: true,
    customizableOnly: true,
    onSaleOnly: false,
    sortBy: 'price-low',
  };

  const count = countActiveFilters(filters);
  // 1 (search) + 1 (type) + 1 (team) + 2 (sizes) + 1 (price) + 1 (inStock) + 1 (customizable) + 0 (onSale) + 1 (sortBy) = 9
  assert.equal(count, 9);
});
