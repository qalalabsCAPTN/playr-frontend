# Storefront Navigation & Collection Formatting Rules

1. **Collection Route Formatting**:
   - Never render hardcoded or generic "Collection" fallbacks in breadcrumbs or headings.
   - Use `formatCollectionTitle(slug)` to format URL handles into clean Title Case with uppercase acronyms (`IPL`, `CSK`, `LSG`, `SRH`, `MLC`, `PKL`) and proper joiners (`&`).
   - Breadcrumb hierarchy must strictly follow `Home / Collections / [Formatted Title]`.

2. **Header Navigation Indicators & Popovers**:
   - All top navigation links must include indicator chevrons that rotate 180° when active (`⌄`/`⌃`).
   - Standard category tabs open full-width `.mega` panels; specialized tabs (e.g., `CLUB`) open relative popover dropdowns with hover flyout submenus.

3. **Floating Storefront Badges**:
   - Maintain the fixed `0 Points` pill badge at bottom-left and support badge at bottom-right across promotional and account pages.

4. **Wishlist & Commerce State Persistence**:
   - Never use isolated local component state (`useState(false)`) for product bookmark or saved status.
   - Always consume `isInWishlist(product.handle)` and `toggleWishlist(product)` from `useCart()` / `useCommerce()`.
   - Ensure all wishlist mutations automatically sync to `localStorage.setItem('playr_wishlist', ...)` and reflect real-time count badges in `Header`.
