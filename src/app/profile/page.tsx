export const dynamic = 'force-dynamic';

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";
import { User as UserIcon, Mail, Shield, Crown, Film } from "lucide-react";
import Link from "next/link";
import AvatarUploadClient from "./AvatarUploadClient";



export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let dbUser = null;
  try {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
  } catch (error) {
    console.error("Prisma error in Profile:", error);
  }

  if (!dbUser) {
    // Provide a safe fallback mock user so the page doesn't crash or show not found if the DB isn't seeded properly
    dbUser = {
      id: user.id,
      email: user.email,
      fullName: "Anime Fan",
      username: "user_" + user.id.slice(0, 5),
      role: "FREE",
      avatarUrl: null,
      createdAt: new Date(),
    } as any;
  }

  const isPremium = dbUser.role === "PREMIUM" || dbUser.role === "ADMIN";

  return (
    <div className="pt-24 pb-12 container mx-auto px-4 max-w-4xl min-h-screen">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-6">
            <AvatarUploadClient avatarUrl={dbUser.avatarUrl} />
            <div className="space-y-4 w-full">
              <div>
                <h2 className="text-2xl font-bold">{dbUser.fullName || "Anime Fan"}</h2>
                <p className="text-muted-foreground flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2" /> {dbUser.email}
                </p>
                {dbUser.username && (
                  <p className="text-muted-foreground text-sm mt-1">@{dbUser.username}</p>
                )}
              </div>
              
              <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Account Role</p>
                  <div className="flex items-center text-sm font-medium">
                    <Shield className="h-4 w-4 mr-2 text-blue-400" />
                    {dbUser.role}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Member Since</p>
                  <div className="text-sm font-medium">
                    {new Date(dbUser.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Card */}
        <div className={`rounded-xl p-6 border shadow-sm ${isPremium ? 'bg-primary/10 border-primary/30' : 'bg-card border-border'}`}>
          <div className="flex items-center mb-4 space-x-2">
            {isPremium ? (
              <Crown className="h-6 w-6 text-primary" />
            ) : (
              <Film className="h-6 w-6 text-muted-foreground" />
            )}
            <h3 className="text-xl font-bold">Subscription</h3>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
            <p className={`text-2xl font-extrabold ${isPremium ? 'text-primary' : 'text-foreground'}`}>
              {dbUser.role === "PREMIUM" ? "Premium" : dbUser.role === "ADMIN" ? "Admin Tier" : "Free Plan"}
            </p>
          </div>

          {!isPremium && (
            <Link 
              href="/premium"
              className="block w-full text-center bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-md transition"
            >
              Upgrade Now
            </Link>
          )}
          {isPremium && (
            <div className="text-sm text-primary font-medium bg-primary/20 p-3 rounded-md border border-primary/20">
              You have full access to all exclusive fandubs and 1080p simulcasts!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
