# playR Project Guidelines & Developer Memory

## UI & Styling Migrations
* **Port CSS Containment Styles**: When replacing custom text or raw markup with media assets (like brand logos, banners, or card thumbnails) from a reference template, always migrate the corresponding sizing rules (e.g., `.class img { height, width, object-fit }`) from the reference style sheets.
* **Keep routing slug keys**: Keep default routing directories naming slug `[slug]` instead of `[handle]`.
* **Brand Nomenclature**: Brand name must be strictly written as `playR` (lowercase 'p', uppercase 'R') across all headings, titles, banners, and metadata. Category naming standard is `Topwear` and `Bottomwear` (avoid generic 'Tops'/'Pants').

## Strict Media & Aspect Ratio Standards
| Media Element | Aspect Ratio | Dimensions & Styling | Notes |
| :--- | :--- | :--- | :--- |
| **Hero Main Banner** | **1920 : 720** (~2.67:1) | Responsive, `min-height: 320px` | Full-bleed slider with pagination dots and cross-fade. |
| **Mid-Page Campaign Banner** | **1920 : 640** (3:1) | Full container width, `border-radius: 22px` (`--radius-lg`) | Auto-advancing slider with title & CTA button. |
| **Collection Header Banner** | **1920 : 400** (~4.8:1) | Full width, `border-radius: 22px` | Displays collection title, breadcrumbs, and filter chips. |
| **PDP Image Gallery** | **1 : 1** (Square) | Desktop sticky left/right & mobile carousel | Strict 1:1 square ratio, `object-fit: cover`, `border-radius: 20px`. |
| **Product Grid Card Images** | **1 : 1** or **4 : 5** | Shopify CDN optimized (`?width=640`) | `object-fit: cover` with `scale(1.04)` hover zoom. |
| **Lookbook Story Avatars** | **1 : 1** (Circular) | `34px × 34px` circle | Animated conic gradient ring (`#ff5a1f` to `#1f6bff`). |
| **Story Viewer Modal** | **9 : 16** (Vertical) | `width: min(420px, 90vw)` | Fullscreen vertical modal overlay. |

## Design System Tokens & Dark Mode Invariants (`globals.css`)
Always use the centralized design system custom properties instead of hardcoded hex values:
* **Light Mode (Default)**:
  * `--page-bg`: `#EAE3D6` (Warm sand background)
  * `--panel`: `#F8F4EC` (Light cream container surface)
  * `--fg`: `#1c1a16` (Deep charcoal primary text)
  * `--muted`: `#8a8272` (Muted warm gray text)
  * `--line`: `#E0D8C8` (Soft border line separator)
  * `--chip`: `#EFE9DC` (Interactive chip & badge background)
* **Dark Mode (`body.theme-dark`)**:
  * `--page-bg: #0c0e12`, `--panel: #16181d`, `--fg: #f3f3f3`, `--muted: #959da5`, `--line: #262930`, `--chip: #1e2128`
  * Logo inverts to pure white via `filter: brightness(0) invert(1)` with 3D `logoFlip` animation.
* **Negative Corner Vector System**:
  * Corner SVG paths (`.header__corners path`, `.mega__corners path`, `.search__corners path`) must always use `fill: var(--panel)`.

## Next.js Build Troubleshooting

### Stale Build Artifacts
When `pnpm dev` or `pnpm build` fails with any of these errors:
- `Cannot find module './vendor-chunks/...'`
- `ENOENT: no such file or directory, open '.next/prerender-manifest.json'`
- `ENOENT: no such file or directory, open '.next/routes-manifest.json'`
- Webpack cache pack rename errors (`ENOENT rename '*.pack.gz_' -> '*.pack.gz'`)

**Always clean `.next` first before any other debugging (PowerShell):**
```powershell
Remove-Item -Recurse -Force apps/playr/.next
pnpm --filter playr build   # or pnpm --filter playr dev
```

These errors indicate a partially-written `.next` directory from a previously interrupted build. They are NOT genuine module resolution bugs — cleaning and rebuilding always resolves them.
