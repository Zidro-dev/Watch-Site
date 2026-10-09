"use client";

import { useState, useCallback, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WordItem {
  id: string;
  word: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface Puzzle {
  id: string;
  title: string;
  gridSize: number;
  words: WordItem[];
}

interface CellCoord {
  col: number; // x
  row: number; // y
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const randomLetter = () => ALPHABET[Math.floor(Math.random() * 26)];

/** Build the stable grid once from DB word coordinates then fill blanks. */
function buildGrid(size: number, words: WordItem[]): string[][] {
  const grid: string[][] = Array.from({ length: size }, () =>
    Array(size).fill("")
  );

  for (const { word, startX, startY, endX, endY } of words) {
    const len = word.length;
    const dx = len === 1 ? 0 : (endX - startX) / (len - 1);
    const dy = len === 1 ? 0 : (endY - startY) / (len - 1);
    for (let i = 0; i < len; i++) {
      const c = Math.round(startX + i * dx);
      const r = Math.round(startY + i * dy);
      if (r >= 0 && r < size && c >= 0 && c < size) {
        grid[r][c] = word[i];
      }
    }
  }

  return grid.map((row) =>
    row.map((cell) => (cell === "" ? randomLetter() : cell))
  );
}

/** Return all cells in a straight line from start → end, or null if not straight. */
function getCellsInLine(start: CellCoord, end: CellCoord): CellCoord[] | null {
  const dc = end.col - start.col;
  const dr = end.row - start.row;

  if (dc !== 0 && dr !== 0 && Math.abs(dc) !== Math.abs(dr)) return null;

  const steps = Math.max(Math.abs(dc), Math.abs(dr));
  if (steps === 0) return [start];

  const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
  const stepR = dr === 0 ? 0 : dr / Math.abs(dr);

  return Array.from({ length: steps + 1 }, (_, i) => ({
    col: start.col + i * stepC,
    row: start.row + i * stepR,
  }));
}

const cellKey = (c: CellCoord) => `${c.col},${c.row}`;

// ─── Colour palette ───────────────────────────────────────────────────────────

const FOUND_COLORS = [
  "bg-green-600 text-white",
  "bg-blue-600 text-white",
  "bg-pink-600 text-white",
  "bg-yellow-600 text-white",
  "bg-purple-600 text-white",
  "bg-red-600 text-white",
  "bg-teal-600 text-white",
  "bg-orange-600 text-white",
];

// ─── Component ────────────────────────────────────────────────────────────────

interface FoundWord {
  word: WordItem;
  cells: Set<string>;
}

export default function PuzzleBoard({ puzzle }: { puzzle: Puzzle }) {
  const { gridSize, words, title } = puzzle;

  const [grid] = useState<string[][]>(() => buildGrid(gridSize, words));

  // Drag state — kept in refs to avoid stale closure issues inside pointer handlers
  const dragStartRef = useRef<CellCoord | null>(null);
  const [dragStart, setDragStart] = useState<CellCoord | null>(null);
  const [dragEnd, setDragEnd] = useState<CellCoord | null>(null);
  const isDragging = useRef(false);

  // The grid container ref — we attach pointer events here
  const gridRef = useRef<HTMLDivElement>(null);

  // Found words
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [lastFound, setLastFound] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);

  const allFound = foundWords.length === words.length;

  useEffect(() => {
    if (allFound && words.length > 0) {
      const t = setTimeout(() => setShowCongrats(true), 400);
      return () => clearTimeout(t);
    }
  }, [allFound, words.length]);

  // ── Read the cell coord from a DOM element using data attributes ──────────
  function cellFromElement(el: Element | null): CellCoord | null {
    if (!el) return null;
    const cell = el.closest("[data-row]") as HTMLElement | null;
    if (!cell) return null;
    const row = parseInt(cell.dataset.row ?? "");
    const col = parseInt(cell.dataset.col ?? "");
    if (isNaN(row) || isNaN(col)) return null;
    return { row, col };
  }

  // ── Pointer handlers on the container ────────────────────────────────────
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const coord = cellFromElement(e.target as Element);
    if (!coord) return;
    // Capture on the grid container so we keep receiving move/up even outside
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    isDragging.current = true;
    dragStartRef.current = coord;
    setDragStart(coord);
    setDragEnd(coord);
    setLastFound(null);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    // Use elementFromPoint so we can identify which cell is under the cursor
    // even though the container has pointer capture
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const coord = cellFromElement(el);
    if (coord) setDragEnd(coord);
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    isDragging.current = false;

    // Final position
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const endCoord = cellFromElement(el) ?? dragEnd;

    if (dragStartRef.current && endCoord) {
      checkSelection(dragStartRef.current, endCoord);
    }

    dragStartRef.current = null;
    setDragStart(null);
    setDragEnd(null);
  }

  // ── Selection check ───────────────────────────────────────────────────────
  function checkSelection(start: CellCoord, end: CellCoord) {
    const line = getCellsInLine(start, end);
    if (!line) return;

    for (const w of words) {
      if (foundWords.some((fw) => fw.word.id === w.id)) continue;

      const fwdMatch =
        start.col === w.startX &&
        start.row === w.startY &&
        end.col === w.endX &&
        end.row === w.endY;

      const revMatch =
        start.col === w.endX &&
        start.row === w.endY &&
        end.col === w.startX &&
        end.row === w.startY;

      if (fwdMatch || revMatch) {
        const cells = new Set(line.map(cellKey));
        setFoundWords((prev) => [...prev, { word: w, cells }]);
        setLastFound(w.word);
        return;
      }
    }
  }

  // ── Derived cell sets ─────────────────────────────────────────────────────
  const hoverCells = useCallback((): Set<string> => {
    if (!dragStart || !dragEnd) return new Set();
    const line = getCellsInLine(dragStart, dragEnd);
    if (!line) return new Set();
    return new Set(line.map(cellKey));
  }, [dragStart, dragEnd]);

  const currentHover = hoverCells();

  const foundCellMap = new Map<string, number>();
  foundWords.forEach((fw, idx) => {
    fw.cells.forEach((k) => foundCellMap.set(k, idx % FOUND_COLORS.length));
  });

  // ── Cell style ────────────────────────────────────────────────────────────
  function getCellStyle(row: number, col: number): string {
    const key = cellKey({ col, row });
    if (foundCellMap.has(key)) return FOUND_COLORS[foundCellMap.get(key)!];
    if (currentHover.has(key)) return "bg-red-500 text-white scale-110 z-10";
    return "bg-gray-800 text-gray-300";
  }

  return (
    <>
      {/* ── Congrats Modal ── */}
      {showCongrats && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowCongrats(false)}
        >
          <div
            className="bg-gray-900 rounded-3xl shadow-2xl px-10 py-10 max-w-sm w-full mx-4 text-center"
            style={{ animation: "fadeInUp 0.35s ease" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Congratulations!</h2>
            <p className="text-gray-500 text-sm mb-6">
              You found all {words.length} word{words.length !== 1 ? "s" : ""} in{" "}
              <span className="font-semibold text-red-500">{title}</span>!
            </p>
            <button
              onClick={() => setShowCongrats(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-1">
            Word Search
          </p>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {foundWords.length} / {words.length} words found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* ── Grid ── */}
          <div className="relative">
            {/* Last-found flash */}
            {lastFound && (
              <div
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow whitespace-nowrap"
                style={{ animation: "fadeInUp 0.25s ease" }}
              >
                ✓ {lastFound}
              </div>
            )}

            {/*
              All pointer events are on this container div.
              setPointerCapture is called here (not on individual cells),
              so elementFromPoint still works during the drag.
            */}
            <div
              ref={gridRef}
              className="grid gap-0.5 bg-gray-800 rounded-2xl p-1.5 shadow-lg select-none touch-none cursor-crosshair"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {grid.map((rowArr, row) =>
                rowArr.map((letter, col) => (
                  <div
                    key={`${row}-${col}`}
                    data-row={row}
                    data-col={col}
                    className={`
                      flex items-center justify-center
                      aspect-square rounded-lg
                      text-[clamp(0.55rem,1.4vw,0.85rem)] font-bold font-mono
                      transition-colors duration-75
                      ${getCellStyle(row, col)}
                    `}
                    style={{ width: `clamp(22px, ${88 / gridSize}vw, 38px)` }}
                  >
                    {letter}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Word list ── */}
          <aside className="lg:w-52 w-full">
            <div className="bg-gray-900 rounded-2xl shadow-md ring-1 ring-gray-800 p-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-4">
                Words to Find
              </h2>
              <ul className="space-y-2">
                {words.map((w) => {
                  const found = foundWords.some((fw) => fw.word.id === w.id);
                  return (
                    <li
                      key={w.id}
                      className={`flex items-center gap-2 text-sm font-medium transition-all ${
                        found ? "text-gray-500 line-through" : "text-gray-200"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          found ? "bg-green-400" : "bg-gray-700"
                        }`}
                      />
                      {w.word}
                    </li>
                  );
                })}
              </ul>

              {allFound && (
                <div className="mt-5 pt-4 border-t border-gray-800 text-center">
                  <p className="text-xs text-green-600 font-semibold">
                    🎉 All words found!
                  </p>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-4 bg-gray-900 rounded-xl shadow-sm ring-1 ring-gray-800 p-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Progress</span>
                <span>
                  {Math.round(
                    (foundWords.length / Math.max(words.length, 1)) * 100
                  )}
                  %
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (foundWords.length / Math.max(words.length, 1)) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}


