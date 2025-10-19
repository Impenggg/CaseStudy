// Lightweight route prefetcher for lazy-loaded routes
// Triggers dynamic import of route chunks ahead of navigation

type PrefetchKey =
  | '/'
  | '/marketplace'
  | '/stories'
  | '/campaigns'
  | '/media'
  | '/login'
  | '/register'
  | '/account';

const routeImporters: Record<PrefetchKey, () => Promise<unknown>> = {
  '/': () => import('../pages/HomePage'),
  '/marketplace': () => import('../pages/MarketplacePage'),
  '/stories': () => import('../pages/StoriesPage'),
  '/campaigns': () => import('../pages/CampaignsPage'),
  '/media': () => import('../pages/MediaFeedPage'),
  '/login': () => import('../pages/LoginPage').then(m => ({ default: m.LoginPage })),
  '/register': () => import('../pages/RegisterPage').then(m => ({ default: m.RegisterPage })),
  '/account': () => import('../pages/AccountPage'),
};

const inFlight = new Map<string, Promise<unknown>>();

export function prefetchRoute(pathname: string): void {
  const key = (pathname.split('?')[0] || '/') as PrefetchKey;
  if (!(key in routeImporters)) return;
  if (inFlight.has(key)) return;
  try {
    const p = routeImporters[key]();
    inFlight.set(key, p);
    p.catch(() => {
      inFlight.delete(key);
    });
  } catch {
    // ignore
  }
}
