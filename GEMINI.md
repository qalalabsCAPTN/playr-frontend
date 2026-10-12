# StreetPlayR Project Guidelines

## Build & Cache Invariants
- **Stale Type Artifacts**: If `next build` or `npm run type-check` in `apps/playr` fails with missing `.next/types` files (e.g., `about/page.ts not found`), always purge the stale cache before retrying:
  ```powershell
  Remove-Item -Recurse -Force apps/playr/.next
  pnpm --filter playr build
  ```

## Git & Repository Hygiene
- **Scratch Files**: Scrape dumps (`scripts/*.html`, `scripts/*.txt`) must remain ignored in `.gitignore`.
- **Memory Updates**: After significant deployments or feature completions, update `.memory/topics/` with concise single-line records following the workspace memory standard.

## GCP Environment Invariants
- **Authorized Account**: The Google Cloud IAM account for `streetplayr-production` is `tech@playr.in`.
