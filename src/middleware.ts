import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;
  const isAPI = pathname.startsWith("/api");

  if (isProtectedRoute(req)) {
    if (!userId) {
      // Unauthenticated user hitting protected route
      if (isAPI) {
        return new NextResponse("Access denied", { status: 403 });
      }
      return NextResponse.redirect(new URL("/signup", req.url));
    }

    if (isAPI && req.headers.get("accept")?.includes("text/html")) {
      // Authenticated user trying to navigate to /api/* in a browser
      return new NextResponse("Access denied", { status: 403 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
