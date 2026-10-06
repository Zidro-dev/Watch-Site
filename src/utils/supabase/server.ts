import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  const isFallback = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fallback.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "fallback-key";

  if (isFallback) {
    // Return a mocked Supabase client for Hybrid / Fallback Auth
    return {
      auth: {
        async getUser() {
          const fallbackUser = cookieStore.get("anizone_fallback_user");
          if (fallbackUser) {
            try {
              return { data: { user: JSON.parse(fallbackUser.value) }, error: null };
            } catch (e) {
              return { data: { user: null }, error: { message: "Invalid session" } };
            }
          }
          return { data: { user: null }, error: { message: "No session" } };
        },
        async signUp({ email, password }: any) {
          const fakeUserId = "fb-" + Math.random().toString(36).substring(2, 10);
          const userObj = { id: fakeUserId, email };
          cookieStore.set("anizone_fallback_user", JSON.stringify(userObj), { path: "/" });
          return { data: { user: userObj }, error: null };
        },
        async signInWithPassword({ email, password }: any) {
          // Mock login: Just hash the email as a fake ID (or rely on Prisma if needed)
          // For a true fallback, we'll just allow it and set the cookie
          const fakeUserId = "fb-" + Buffer.from(email).toString('base64').substring(0, 8);
          const userObj = { id: fakeUserId, email };
          cookieStore.set("anizone_fallback_user", JSON.stringify(userObj), { path: "/" });
          return { data: { user: userObj }, error: null };
        },
        async signOut() {
          cookieStore.delete("anizone_fallback_user");
          return { error: null };
        }
      }
    } as any;
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored
          }
        },
      },
    }
  );
}
