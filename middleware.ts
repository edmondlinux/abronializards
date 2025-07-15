import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware((auth, req) => {
  // Define public routes that should not require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/contact',
    '/blog',
    '/all-products',
    '/product',
    '/feed',
    '/testimonials',
    '/sitemap.xml',
    '/robots.txt',
  ];

  // Check if the current path is a public route
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.some(route => 
    path === route || path.startsWith(route + '/')
  );

  // Skip authentication for public routes
  if (isPublicRoute) {
    return;
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};