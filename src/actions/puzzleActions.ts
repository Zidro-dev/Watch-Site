"use server";

import { prisma } from "@/utils/prisma";
import { generatePuzzleGrid } from "@/lib/puzzleGenerator";

interface CreatePuzzleResult {
  puzzleId: string;
  grid: string[][];
}

/**
 * Server Action — generates a word-search puzzle and persists it to the
 * database together with the coordinates of every placed word.
 *
 * @param title             Human-readable title for the puzzle.
 * @param gridSize          Dimensions of the square grid (gridSize × gridSize).
 * @param allowedDirections Direction keys to pass to the generator.
 * @param words             Words to embed in the puzzle.
 * @param authorId          Optional UUID of the User who created the puzzle.
 *                          When omitted the puzzle is stored without an author
 *                          (useful for anonymous / seed puzzles).
 */
export async function createPuzzleAction(
  title: string,
  gridSize: number,
  allowedDirections: string[],
  words: string[],
  authorId?: string
): Promise<CreatePuzzleResult> {
  // 1. Generate grid and word placement data
  const { grid, placedWords } = generatePuzzleGrid(
    words,
    gridSize,
    allowedDirections
  );

  // 2. Persist the Puzzle and its WordItems in a single transaction
  const puzzle = await prisma.puzzle.create({
    data: {
      title,
      gridSize,
      allowedDirections,
      // Only link to an author if one was supplied
      ...(authorId ? { authorId } : {}),
      words: {
        create: placedWords.map(({ word, startX, startY, endX, endY }) => ({
          word,
          startX,
          startY,
          endX,
          endY,
        })),
      },
    },
    select: {
      id: true,
    },
  });

  return { puzzleId: puzzle.id, grid };
}
