# playR Storefront

A Next.js storefront that recreates the reference site's layout and interactions (per the screen recording), populated with playR products from your Shopify store.

## Run it

```bash
npm install   # already done if node_modules exists
npm run dev   # http://localhost:3000
```

Production: `npm run build && npm start`

## Sections (matching the video)

- **Hero** — full-viewport image with slow zoom, transparent header over it, centered "Shop now" at the bottom. Header turns solid white on scroll.
- **Header** — "New in" / "Collections" left, logo center; right icon row: stories circle (gradient ring, opens the story viewer with progress bars, pause, prev/next), location pin, search, account, wishlist, bag (with count), dark pill menu button. Mega menu on Collections.
- **Product sections** — white rounded panels on the grey page, small bold title left + black "Discover more" pill right, 4-up rows. **Homepage cards cycle through all product images with hover prev/next arrows and dots** (homepage only — listing pages show a single image), plus bookmark save icon and "+" quick-add.
- **Banner slider** — full-width rounded banner carousel mid-page (auto-rotating, arrows + dots, centered title with underlined "Shop now"), placed after the Caps section like the reference.
- **Listing page** — `/collections/[handle]`: title + "Advance Filters" button, filter chips row (View all / Caps / Headwear / Goggles / Swim Caps), product grid.
- **PDP** — masonry gallery left (first image large, rest 2-up, click to zoom), sticky right side with two white rounded panels: title + bookmark + price + "Size Guide" pill, rounded size pills (unavailable ones greyed/struck), "Add to Bag" (outline) + "Buy Now" (black), and a tabbed panel (Details & Description / Washcare / Shipping). "You may like" + "Recently visited" rows below.
- **Recently visited** — tracked in localStorage, shown on home and PDPs.
- **Popular searches strip + footer** — rounded strip with the searches tabs, then the footer card: Connect with us / Order Support / We are playR columns and the shopping-bag graphic, copyright bottom-right.
- **Cart drawer** — floating rounded drawer: empty state ("Your bag is empty!" + suggested products) or line items with qty steppers, estimated total, checkout.

## Notes

- Product data lives in `lib/data.js` with full image galleries pulled from your Shopify CDN.
- The reference site's photos and copy were **not** copied (they're copyrighted); layout, animations, and interactions were rebuilt with playR assets and original copy.
- `StoriesBar/DiscoverCollections/StoresSection/SeoBlock/ProductCarousel` in `components/` are unused leftovers from the first iteration — safe to delete.
