# FlowPay Web — Security & Performance Audit

## 1. Security Audit

### 1.1 XSS & dangerous HTML
- **Status: ✅ No issues found**
- No `dangerouslySetInnerHTML`, `innerHTML`, or `eval()` in the codebase.
- User input (subscription name, addresses, amounts) is rendered as text; React escapes by default.
- **Recommendation:** If you ever render user content as HTML, sanitize (e.g. DOMPurify) or keep to text.

### 1.2 API keys & secrets
- **Status: ✅ No hardcoded secrets**
- `src/flow/fclConfig.js` only sets public Flow testnet URLs (`accessNode.api`, `discovery.wallet`). These are not secrets.
- **Recommendation:** For production, keep any API keys in env vars (`import.meta.env.VITE_*`) and never commit them.

### 1.3 localStorage / sessionStorage
- **Status: ✅ Not used**
- No `localStorage` or `sessionStorage` usage. FCL manages wallet session internally.
- **Recommendation:** If you add persistence, avoid storing tokens or private data in localStorage; prefer httpOnly cookies or in-memory + short-lived session storage for sensitive data.

### 1.4 Wallet & signature replay
- **Status: ⚠️ Design awareness**
- FCL handles auth; the app does not sign raw messages or store signatures. When you add transaction signing:
  - Use nonces or chain-specific replay protection.
  - Never sign arbitrary messages without a domain/nonce (prefer FCL’s built-in transaction building).
- **Recommendation:** Rely on FCL for transaction construction and signing; avoid custom signature flows that could be replayed.

### 1.5 CORS
- **Status: N/A (client-only)**
- No server-side CORS configuration in this repo (frontend only). Flow access nodes and discovery wallet have their own CORS policies.
- **Recommendation:** If you add a backend, configure CORS to allow only your frontend origin and required methods/headers.

### 1.6 Dependencies
- **Status: ✅ `npm audit` reports 0 vulnerabilities**
- **Recommendation:** Run `npm audit` and `npm update` regularly; consider Dependabot or Renovate.

---

## 2. Performance Audit

### 2.1 Unnecessary re-renders
| Location | Issue | Fix |
|----------|--------|-----|
| `WalletContext.jsx` | `value={{ user, login, logout }}` is a new object every render → all consumers re-render | Memoize with `useMemo` |
| `App.jsx` | `AppContent` re-renders when `user` changes; `MainLayout` and `AppRoutes` re-render | Acceptable; optional: split routes so only route content re-renders |
| `Home.jsx` | `onClose={() => setCreateModalOpen(false)}` and `onCreate={handleCreateSubscription}` recreated every render | Wrap in `useCallback` |
| `Header.jsx` | `handleDisconnect` recreated every render | Already a function; wrap in `useCallback` for stable ref if passed to memoized children |
| NavLink `className` | Inline function `({ isActive }) => ...` creates new function each render | Use a shared helper or `useCallback` if NavLink were memoized |

### 2.2 Heavy components & memo
- **CreateSubscriptionModal:** Many `useState` and list updates; already uses `useCallback` for add/remove/update. Could wrap in `React.memo` if parent re-renders often.
- **Header:** Re-renders on wallet state; no memo. Optional: `React.memo(Header)` since it only depends on `user` and navigation.
- **Footer:** Static content; good candidate for `React.memo`.
- **Logo:** Good candidate for `React.memo` (pure presentational).

### 2.3 useMemo / useCallback
- **Missing useMemo:** `WalletContext` value (see above). `CreateSubscriptionModal` has no expensive derived state that needs `useMemo`.
- **Missing useCallback:** `Home`: `handleCreateSubscription`, `setCreateModalOpen` wrapper. `Header`: `handleDisconnect` (optional).

### 2.4 Bundle size
- **Current build:** One main chunk ~**1,047 kB** (min), ~319 kB gzip. Vite warns: “Some chunks are larger than 500 kB.”
- **Likely contributors:** React, React-DOM, FCL, react-router-dom, lucide-react (many icons), axios, @tanstack/react-query.
- **React Query:** Provider is used but no `useQuery`/`useMutation` in the app → dead code in bundle until you use it.

### 2.5 Lazy loading
- **Status: ❌ Not used**
- All routes are static imports: `import Home from '@/pages/Home'` etc. Landing, Home, About load upfront.
- **Opportunity:** Use `React.lazy()` + `Suspense` for route-level code splitting so Landing loads first, then Home/About when needed.

### 2.6 State updates
- **CreateSubscriptionModal:** Batch of `useState`; validation runs on submit (no heavy work on every keystroke). Acceptable.
- **Home:** `setSubscriptions` with functional update; no batching issues.

### 2.7 React Query
- **Status: ⚠️ Unused**
- `QueryClientProvider` wraps the app but there are no `useQuery` or `useMutation` calls. This adds bundle weight without benefit.
- **Recommendation:** Either remove React Query for now, or use it for subscriptions list, balance, and activity (with stale-while-revalidate and caching).

### 2.8 Images
- No image components or asset images in `src` (only `react.svg` in assets). No optimization needed yet.
- **Recommendation:** When adding images, use responsive images, lazy loading, and consider a small image pipeline or CDN.

### 2.9 Blocking / synchronous code
- No heavy sync work on main thread (no large JSON.parse, no big loops in render). FCL and wallet are async.
- **Recommendation:** Keep any future crypto or hashing in a Web Worker if it becomes CPU-heavy.

---

## 3. Exact Code Areas (Load Time, Main Thread, Jank, Network)

| Concern | Cause | Location |
|--------|--------|----------|
| **Long initial load** | Single large JS chunk (~1 MB) loaded before first paint | `main.jsx` + router static imports; no code splitting |
| **Main thread** | Parsing/compiling large bundle | Same chunk; no blocking sync logic in app code |
| **UI jank** | Context value recreated every render → Header, AppContent, route re-render together | `WalletContext.jsx` provider value |
| **Excessive network** | No duplicate request layer yet | When you add APIs, use React Query or similar to dedupe and cache |

---

## 4. Refactoring & Fixes

### 4.1 Security fixes (preventive)
- [ ] Add CSP meta or header when you have a backend (e.g. `Content-Security-Policy`).
- [ ] Use env for any future API base URL: `import.meta.env.VITE_API_URL`.
- [ ] When adding transaction signing, use FCL’s flow and include nonce/domain to prevent replay.

### 4.2 Performance fixes (applied in codebase)
- Memoize `WalletContext` value.
- Use `useCallback` for `Home`’s modal handlers and create-subscription handler.
- Lazy-load route components and add `Suspense`.
- Vite `build.rollupOptions.output.manualChunks` to split vendor (react, fcl, router, lucide).

### 4.3 Bundle reduction
- **Remove or use React Query:** Remove `@tanstack/react-query` and `QueryClientProvider` if not used, or add 1–2 queries (e.g. balance) to justify it.
- **Lucide:** Import only used icons (e.g. `import Plus from 'lucide-react/dist/esm/icons/plus'`) or use a tree-shakeable path so unused icons are dropped.
- **Manual chunks:** Split `react`, `react-dom`, `@onflow/fcl`, `react-router-dom`, and optionally `lucide-react` into separate chunks so caching and parallel loading improve.

### 4.4 Monitoring recommendations
- **Errors:** Use Sentry (or similar) for unhandled errors and failed FCL auth/transactions.
- **Performance:** Use `web-vitals` (e.g. LCP, FID, CLS) and send to analytics or a RUM tool.
- **Bundle:** Run `vite build --mode production` and inspect `dist/` and the size warning; track main chunk size over time.

---

## 5. Applied fixes (post-audit)

| Fix | File |
|-----|------|
| Memoized context value + useCallback login/logout | `contexts/WalletContext.jsx` |
| useCallback for modal open/close and create handler | `pages/Home.jsx` |
| useCallback for handleDisconnect | `components/organisms/Header/Header.jsx` |
| Lazy routes (Home, About, Landing) + Suspense fallback | `router/index.jsx` |
| manualChunks: react-vendor, fcl, router, lucide | `vite.config.js` |
| Comment for production env usage | `flow/fclConfig.js` |

### Build result after fixes
- **Initial load (e.g. landing):** index + react-vendor + router + Landing chunk (~13 + 193 + 36 + 6 kB ≈ 248 kB JS before gzip).
- **FCL** remains a large chunk (~765 kB); it loads with main app because WalletProvider uses it at root. Optional future improvement: load FCL only after user clicks “Connect”.
