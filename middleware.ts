import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes should be protected.
// Any path matching these patterns will require authentication.
const isProtectedRoute = createRouteMatcher([
  '/seller(.*)',
  '/my-orders(.*)',
  '/order-placed(.*)',
  '/cart(.*)',
  '/add-address(.*)',
  '/api(.*)',
  // Add more private routes here as needed
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();  // Ensures authentication—redirects or errors if not logged in
    }
  },
  { debug: true } // Enables console logs to help you trace middleware behavior
);

export const config = {
  matcher: [
    // Apply middleware broadly, skipping Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
