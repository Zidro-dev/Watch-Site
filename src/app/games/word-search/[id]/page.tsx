import { notFound } from "next/navigation";
import { prisma } from "@/utils/prisma";
import PuzzleBoard from "@/components/puzzle/PuzzleBoard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PuzzlePage({ params }: PageProps) {
  const { id } = await params;

  const puzzle = await prisma.puzzle.findUnique({
    where: { id },
    include: { words: true },
  });

  if (!puzzle) notFound();

  return (
    <main className="min-h-screen bg-black py-10 px-4">
      <PuzzleBoard puzzle={puzzle} />
    </main>
  );
}

