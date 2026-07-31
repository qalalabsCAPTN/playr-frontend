# playR Project Guidelines & Developer Memory

## UI & Styling Migrations
* **Port CSS Containment Styles**: When replacing custom text or raw markup with media assets (like brand logos, banners, or card thumbnails) from a reference template, always migrate the corresponding sizing rules (e.g., `.class img { height, width, object-fit }`) from the reference style sheets.
* **Aspect Ratios**: Maintain the documented aspect ratios (Hero 1920:720, Banner 1920:640) in component containers to prevent layout shift.
* **Keep routing slug keys**: Keep default routing directories naming slug `[slug]` instead of `[handle]`.

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
