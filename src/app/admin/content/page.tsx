export const dynamic = 'force-dynamic';

import { prisma } from "@/utils/prisma";
import ContentFormsClient from "./ContentFormsClient";



export default async function ContentManagementPage() {
  // Optimization: Fetch top 150 most recently updated animes to prevent UI lag with 10k+ records
  const animes = await prisma.anime.findMany({
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
    take: 150
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <p className="text-sm text-muted-foreground">Add new Anime and Episodes to the platform.</p>
      </div>
      
      <ContentFormsClient availableAnimes={animes} />
    </div>
  );
}
