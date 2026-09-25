import { redirect } from 'next/navigation';

// The reference implementation's /dashboard is a full content-management panel (products,
// lookbook, banners, collections) backed by its own /api/admin route -- out of scope here
// since it would duplicate the site's real admin at /admin. This alias just keeps the route
// from 404ing and sends visitors to the actual admin panel.
export default function DashboardRedirect() {
  redirect('/admin');
}
