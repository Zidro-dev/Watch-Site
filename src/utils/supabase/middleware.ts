import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Missing Supabase Environment Variables in Middleware.");
    return supabaseResponse; // Pass through if env vars are missing so the UI can display the Error Boundary instead of breaking middleware entirely.
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected Routes Logic
  const isCreatorRoute = request.nextUrl.pathname.startsWith('/creator');
  const isPremiumRoute = request.nextUrl.pathname.startsWith('/premium');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login');

  if (!user && (isCreatorRoute || isPremiumRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect away from login if already logged in
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // For Creator Route, we'd ideally check user role from DB here or via custom claims
  // Skipping DB check in middleware for performance, handle specific role blocks in layout/page

  return supabaseResponse;
}
