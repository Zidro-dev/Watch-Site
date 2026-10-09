// ─── Direction Definitions ───────────────────────────────────────────────────

export const DIRECTIONS = {
  RIGHT: { dx: 1, dy: 0 },
  LEFT: { dx: -1, dy: 0 },
  DOWN: { dx: 0, dy: 1 },
  UP: { dx: 0, dy: -1 },
  DIAGONAL_DOWN_RIGHT: { dx: 1, dy: 1 },
  DIAGONAL_UP_LEFT: { dx: -1, dy: -1 },
  DIAGONAL_DOWN_LEFT: { dx: -1, dy: 1 },
  DIAGONAL_UP_RIGHT: { dx: 1, dy: -1 },
} as const;

export type DirectionKey = keyof typeof DIRECTIONS;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlacedWord {
  word: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface PuzzleResult {
  grid: string[][];
  placedWords: PlacedWord[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function randomLetter(): string {
  return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
}

function createEmptyGrid(size: number): string[][] {
  return Array.from({ length: size }, () => Array(size).fill(""));
}

/**
 * Attempts to place a single word on the grid.
 * Returns the updated grid and coordinates on success, or null on failure.
 */
function tryPlaceWord(
  grid: string[][],
  word: string,
  direction: DirectionKey,
  size: number
): { grid: string[][]; placed: PlacedWord } | null {
  const { dx, dy } = DIRECTIONS[direction];
  const len = word.length;

  // Compute valid starting positions so the word fits within bounds
  const maxStartX = dx === 1 ? size - len : dx === -1 ? len - 1 : size - 1;
  const maxStartY = dy === 1 ? size - len : dy === -1 ? len - 1 : size - 1;
  const minStartX = dx === -1 ? len - 1 : 0;
  const minStartY = dy === -1 ? len - 1 : 0;

  if (maxStartX < minStartX || maxStartY < minStartY) return null;

  const startX =
    Math.floor(Math.random() * (maxStartX - minStartX + 1)) + minStartX;
  const startY =
    Math.floor(Math.random() * (maxStartY - minStartY + 1)) + minStartY;

  // Validate placement: each cell must be empty or have the same letter
  for (let i = 0; i < len; i++) {
    const col = startX + i * dx;
    const row = startY + i * dy;
    const existing = grid[row][col];
    if (existing !== "" && existing !== word[i]) return null;
  }

  // Clone the grid and write the word
  const newGrid = grid.map((row) => [...row]);
  for (let i = 0; i < len; i++) {
    const col = startX + i * dx;
    const row = startY + i * dy;
    newGrid[row][col] = word[i];
  }

  const endX = startX + (len - 1) * dx;
  const endY = startY + (len - 1) * dy;

  return {
    grid: newGrid,
    placed: { word, startX, startY, endX, endY },
  };
}

// ─── Main Generator ───────────────────────────────────────────────────────────

const MAX_ATTEMPTS_PER_WORD = 200;

/**
 * Generates a word-search puzzle grid.
 *
 * @param words             List of words to embed in the grid.
 * @param size              Dimensions of the square grid (size × size).
 * @param allowedDirections Subset of DIRECTIONS keys the generator may use.
 * @returns                 The filled grid and metadata for every placed word.
 */
export function generatePuzzleGrid(
  words: string[],
  size: number,
  allowedDirections: string[]
): PuzzleResult {
  // Validate that every supplied direction key is recognised
  const validDirections = allowedDirections.filter(
    (d): d is DirectionKey => d in DIRECTIONS
  );

  if (validDirections.length === 0) {
    throw new Error(
      "No valid directions provided. Use one or more of: " +
        Object.keys(DIRECTIONS).join(", ")
    );
  }

  let grid = createEmptyGrid(size);
  const placedWords: PlacedWord[] = [];

  // Normalise words to uppercase
  const normalisedWords = words.map((w) => w.toUpperCase().trim());

  for (const word of normalisedWords) {
    if (word.length > size) {
      console.warn(`Word "${word}" is longer than the grid — skipping.`);
      continue;
    }

    let placed = false;

    for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_WORD; attempt++) {
      // Pick a random allowed direction for this attempt
      const direction =
        validDirections[Math.floor(Math.random() * validDirections.length)];

      const result = tryPlaceWord(grid, word, direction, size);
      if (result) {
        grid = result.grid;
        placedWords.push(result.placed);
        placed = true;
        break;
      }
    }

    if (!placed) {
      console.warn(
        `Could not place word "${word}" after ${MAX_ATTEMPTS_PER_WORD} attempts — skipping.`
      );
    }
  }

  // Fill remaining empty cells with random letters
  const filledGrid = grid.map((row) =>
    row.map((cell) => (cell === "" ? randomLetter() : cell))
  );

  return { grid: filledGrid, placedWords };
}
