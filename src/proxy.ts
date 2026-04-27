import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Not logged in → login
  if (!user && (pathname.startsWith("/dashboard") || pathname === "/onboarding")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged in on auth pages → dashboard
  if (user && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // New user hitting dashboard without onboarding cookie → onboarding
  // Only applies to accounts created in the last 30 minutes (fresh signups)
  if (user && pathname.startsWith("/dashboard")) {
    const onboardingDone = request.cookies.get("onboarding_done")?.value;
    if (!onboardingDone) {
      const createdAt = new Date(user.created_at).getTime();
      const thirtyMinutes = 30 * 60 * 1000;
      const isNewUser = Date.now() - createdAt < thirtyMinutes;
      if (isNewUser) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
      // Existing user — set cookie so we never check again
      const res = NextResponse.next({ request });
      res.cookies.set("onboarding_done", "true", { path: "/", maxAge: 31536000 });
      return res;
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding", "/login", "/signup"],
};
