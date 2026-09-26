export const dynamic = 'force-dynamic';

import { PrismaClient } from "@prisma/client";
import ContentFormsClient from "./ContentFormsClient";

const prisma = new PrismaClient();

export default async function ContentManagementPage() {
  const animes = await prisma.anime.findMany({
    select: { id: true, title: true }
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
