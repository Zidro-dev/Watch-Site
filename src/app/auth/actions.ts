"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";



export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password || !username || !fullName) {
    return { error: "All fields are required" };
  }

  const supabase = createClient();

  // 1. Sign up with Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Failed to create user account." };
  }

  // 2. Create corresponding record in Prisma User table
  try {
    await prisma.user.upsert({
      where: { id: authData.user.id },
      update: {
        username,
        fullName,
        email,
      },
      create: {
        id: authData.user.id,
        email: authData.user.email!,
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

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function demoLoginUser(role: "USER" | "CREATOR" | "ADMIN") {
  const email = `${role.toLowerCase()}@anizone.com`;
  const password = "demoPassword123!";
  const username = `demo_${role.toLowerCase()}`;
  const fullName = `Demo ${role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}`;
  
  const supabase = createClient();
  
  // Try to login first
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    // If login fails, they probably don't exist yet, so register them!
    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (signupError) return { error: signupError.message };
    
    if (authData.user) {
      try {
        await prisma.user.upsert({
          where: { id: authData.user.id },
          update: {},
          create: {
            id: authData.user.id,
            email: authData.user.email!,
            username,
            fullName,
            role: role === "CREATOR" ? "FANDUB_CREATOR" : role === "ADMIN" ? "ADMIN" : "FREE",
          },
        });
      } catch (e) {
        console.error("Failed to seed demo user in Prisma:", e);
      }
    }
  }

  redirect("/");
}
