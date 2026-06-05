# Environment Configuration Documentation

This outlines the deployment configuration validated against the NECTAR BFF (Backend-for-Frontend) architecture and multi-brand strategy.

## 1. NECTAR Multi-Brand Strategy
| Variable | Scope | Required | Purpose |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_TENANT_ID` | Client & Server | **Yes** | Identifies the active brand context (e.g., `playr`) across the multi-brand ecosystem. Required by the BFF to fetch correct styles, catalogs, and tenant configurations. |

## 2. Client-Safe (NEXT_PUBLIC)
Variables safely exposed to the browser to initialize frontend SDKs and communicate with the BFF.

| Variable | Scope | Required | Purpose |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_NECTAR_BFF_URL` | Client | **Yes** | The Next.js BFF endpoint. Client components route requests here instead of directly hitting internal microservices. |
| `NEXT_PUBLIC_RAZORPAY_KEY` | Client | **Yes** | Required by Razorpay JS SDK to initialize client-side payment modals. |
| `NEXT_PUBLIC_CCAVENUE_KEY` | Client | **Yes** | Required by CCAvenue SDK for client-side payment forms. |
| `NEXT_PUBLIC_ANALYTICS_WRITE_KEY` | Client | **Yes** | Required by the analytics script to directly emit client-side telemetry. |
| `NEXT_PUBLIC_AUTH_DOMAIN` | Client | **Yes** | Domain for client-side SSO redirects. |
| `NEXT_PUBLIC_AUTH_CLIENT_ID` | Client | **Yes** | Public identifier for the tenant's auth integration. |

## 3. Server-Only Core Microservices
These variables must **NEVER** use the `NEXT_PUBLIC_` prefix. They dictate how the Next.js BFF communicates with the internal NECTAR microservices.

| Variable | Scope | Required | Purpose |
| :--- | :--- | :--- | :--- |
| `NECTAR_CORE_API_URL` | Server | **Yes** | Internal endpoint for the primary commerce engine (cart, checkout, catalog). |
| `WALLET_API_URL` | Server | **Yes** | Internal endpoint for Wallet queries and transactions. |
| `REWARDS_API_URL` | Server | **Yes** | Internal endpoint for Rewards points and tiers. |
| `LOGISTICS_API_URL` | Server | **Yes** | Internal endpoint for order tracking milestones. |
| `CMS_GRAPHQL_ENDPOINT` | Server | **Yes** | Internal endpoint for fetching headless CMS content. |

## 4. Server-Only Secrets
Secure keys and tokens that must be kept strictly server-side.

| Variable | Scope | Required | Purpose |
| :--- | :--- | :--- | :--- |
| `AUTH_SECRET` | Server | **Yes** | Used to sign and encrypt session cookies on the server. |
| `CCAVENUE_ACCESS_CODE` | Server | **Yes** | Server-side secure handshakes for CCAvenue transactions. |
| `CMS_PREVIEW_TOKEN` | Server | Optional | Bypasses draft status for unpublished CMS content. |
