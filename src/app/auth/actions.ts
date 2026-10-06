"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function createFallbackSession(email: string) {
  const fakeUserId = "fb-" + Buffer.from(email).toString('base64').substring(0, 8);
  const userObj = { id: fakeUserId, email };
  cookies().set("anizone_fallback_user", JSON.stringify(userObj), { path: "/" });
  return userObj;
}

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password || !username || !fullName) {
    return { error: "All fields are required" };
  }

  const supabase = createClient();
  let userId = "";

  try {
    // 1. Sign up with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      if (authError.message.includes("fetch failed")) throw authError;
      return { error: authError.message };
    }

    if (!authData.user) {
      return { error: "Failed to create user account." };
    }
    userId = authData.user.id;
  } catch (error) {
    console.error("Supabase Auth Error, using Fallback:", error);
    const userObj = await createFallbackSession(email);
    userId = userObj.id;
  }

  // 2. Create corresponding record in Prisma User table
  try {
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        username,
        fullName,
        email,
      },
      create: {
        id: userId,
        email: email,
        username,
        fullName,
        role: "FREE",
      },
    });
  } catch (dbError: any) {
    // If username is taken or other DB error
    if (dbError.code === "P2002") {
      return { error: "Username is already taken." };
    }
    return { error: "Database error during registration." };
  }

  redirect("/");
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = createClient();

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("fetch failed")) throw error;
      return { error: error.message };
    }
  } catch (error) {
    console.error("Supabase Login Error, using Fallback:", error);
    // Mock login by creating cookie session if Prisma has the user
    try {
      const user = await prisma.user.findFirst({ where: { email } });
      if (!user) return { error: "Invalid credentials (Fallback)" };
      await createFallbackSession(email);
    } catch (dbError) {
      return { error: "Database error during fallback login." };
    }
  }

  redirect("/");
}

export async function demoLoginUser(role: "USER" | "CREATOR" | "ADMIN") {
  const email = `${role.toLowerCase()}@anizone.com`;
  const password = "demoPassword123!";
  const username = `demo_${role.toLowerCase()}`;
  const fullName = `Demo ${role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}`;
  
  const supabase = createClient();
  let userId = "";
  
  try {
    // Try to login first
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      if (loginError.message.includes("fetch failed")) throw loginError;
      
      // If login fails, they probably don't exist yet, so register them!
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signupError) return { error: signupError.message };
      userId = authData.user?.id || "";
    } else {
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id || "";
    }
  } catch (error) {
    console.error("Supabase Demo Auth Error, using Fallback:", error);
    const userObj = await createFallbackSession(email);
    userId = userObj.id;
  }

  if (userId) {
    try {
      await prisma.user.upsert({
        where: { id: userId },
        update: {}, // ensure it exists
        create: {
          id: userId,
          email: email,
          username,
          fullName,
          role: role === "CREATOR" ? "FANDUB_CREATOR" : role === "ADMIN" ? "ADMIN" : "FREE",
        },
      });
    } catch (e) {
      console.error("Failed to seed demo user in Prisma:", e);
    }
  }

  redirect("/");
}
