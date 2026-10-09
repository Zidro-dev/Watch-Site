"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPuzzleAction } from "@/actions/puzzleActions";
import { generateWordsAction } from "@/actions/aiActions";
import { DIRECTIONS, DirectionKey } from "@/lib/puzzleGenerator";

// All available directions with human-readable labels
const ALL_DIRECTIONS: { key: DirectionKey; label: string }[] = [
  { key: "RIGHT", label: "→ Right" },
  { key: "LEFT", label: "← Left" },
  { key: "DOWN", label: "↓ Down" },
  { key: "UP", label: "↑ Up" },
  { key: "DIAGONAL_DOWN_RIGHT", label: "↘ Diagonal Down-Right" },
  { key: "DIAGONAL_UP_LEFT", label: "↖ Diagonal Up-Left" },
  { key: "DIAGONAL_DOWN_LEFT", label: "↙ Diagonal Down-Left" },
  { key: "DIAGONAL_UP_RIGHT", label: "↗ Diagonal Up-Right" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form state
  const [title, setTitle] = useState("");
  const [gridSize, setGridSize] = useState(15);
  const [selectedDirections, setSelectedDirections] = useState<Set<DirectionKey>>(
    new Set(["RIGHT", "DOWN", "DIAGONAL_DOWN_RIGHT"])
  );
  const [words, setWords] = useState<string[]>(["", ""]);
  const [error, setError] = useState<string | null>(null);

  // AI Word Generator state
  const [aiTopic, setAiTopic] = useState("");
  const [aiCount, setAiCount] = useState(10);
  const [isAiPending, startAiTransition] = useTransition();
  const [aiError, setAiError] = useState<string | null>(null);

  // ── Direction helpers ──────────────────────────────────────────────────────
  function toggleDirection(key: DirectionKey) {
    setSelectedDirections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  // ── Word list helpers ──────────────────────────────────────────────────────
  function addWord() {
    setWords((prev) => [...prev, ""]);
  }

  function removeWord(index: number) {
    setWords((prev) => prev.filter((_, i) => i !== index));
  }

  function updateWord(index: number, value: string) {
    setWords((prev) => prev.map((w, i) => (i === index ? value : w)));
  }

  // ── AI word generation ─────────────────────────────────────────────────────
  function handleAiGenerate() {
    setAiError(null);
    if (!aiTopic.trim()) {
      setAiError("Please enter a topic first.");
      return;
    }
    startAiTransition(async () => {
      try {
        const generated = await generateWordsAction(aiTopic.trim(), aiCount);
        // Append new words; remove any trailing blank slots first so the list stays tidy
        setWords((prev) => {
          const existing = prev.filter((w) => w.trim() !== "");
          return [...existing, ...generated];
        });
      } catch (err) {
        setAiError(
          err instanceof Error ? err.message : "Failed to generate words."
        );
      }
    });
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanWords = words.map((w) => w.trim()).filter(Boolean);
    const dirs = Array.from(selectedDirections);

    if (!title.trim()) {
      setError("Please enter a puzzle title.");
      return;
    }
    if (dirs.length === 0) {
      setError("Select at least one direction.");
      return;
    }
    if (cleanWords.length === 0) {
      setError("Add at least one word.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createPuzzleAction(
          title.trim(),
          gridSize,
          dirs,
          cleanWords
        );
        router.push(`/games/word-search/${result.puzzleId}`);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate puzzle."
        );
      }
    });
  }

  return (
    <main className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600 shadow-lg mb-4">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 10h16M4 14h10M4 18h6"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Word Search Generator
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Configure your puzzle, add your words, and generate instantly.
          </p>
        </div>

        {/* ── Card ── */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 rounded-3xl shadow-xl ring-1 ring-gray-800 divide-y divide-gray-800 overflow-hidden"
        >
          {/* ── Section: Basic info ── */}
          <section className="px-8 py-7 space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-red-500">
              Puzzle Settings
            </h2>

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Puzzle Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Ocean Animals"
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
            </div>

            {/* Grid size */}
            <div>
              <label
                htmlFor="gridSize"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Grid Size{" "}
                <span className="text-gray-500 font-normal">
                  ({gridSize} × {gridSize})
                </span>
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="gridSize"
                  type="range"
                  min={10}
                  max={25}
                  value={gridSize}
                  onChange={(e) => setGridSize(Number(e.target.value))}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <span className="w-10 text-center text-sm font-semibold text-red-500 bg-red-500/10 rounded-lg py-1">
                  {gridSize}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Min 10 · Max 25</p>
            </div>
          </section>

          {/* ── Section: Directions ── */}
          <section className="px-8 py-7">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-4">
              Allowed Directions
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {ALL_DIRECTIONS.map(({ key, label }) => {
                const checked = selectedDirections.has(key);
                return (
                  <label
                    key={key}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition-all select-none ${
                      checked
                        ? "border-red-500 bg-red-500/10 text-red-400"
                        : "border-gray-700 bg-gray-900 text-gray-400 hover:border-red-500"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDirection(key)}
                      className="sr-only"
                    />
                    <span
                      className={`w-4 h-4 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                        checked
                          ? "bg-red-600 border-red-600"
                          : "bg-gray-900 border-gray-700"
                      }`}
                    >
                      {checked && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          viewBox="0 0 10 10"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M1.5 5l2.5 2.5 4.5-4.5"
                          />
                        </svg>
                      )}
                    </span>
                    {label}
                  </label>
                );
              })}
            </div>
          </section>

          {/* ── Section: AI Word Generator ── */}
          <section className="px-8 py-7 bg-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">✨</span>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-red-500">
                AI Word Generator
              </h2>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Enter a topic and let AI suggest words to add to your puzzle automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              {/* Topic input */}
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAiGenerate())}
                placeholder="e.g. Ocean Animals"
                disabled={isAiPending}
                className="flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition disabled:opacity-60"
              />

              {/* Word count */}
              <div className="flex items-center gap-2 shrink-0">
                <label htmlFor="aiCount" className="text-xs text-gray-500 whitespace-nowrap">
                  Count:
                </label>
                <input
                  id="aiCount"
                  type="number"
                  min={1}
                  max={20}
                  value={aiCount}
                  onChange={(e) =>
                    setAiCount(Math.min(20, Math.max(1, Number(e.target.value))))
                  }
                  disabled={isAiPending}
                  className="w-16 rounded-xl border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-center text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition disabled:opacity-60"
                />
              </div>

              {/* Auto-Generate button */}
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={isAiPending}
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-red-900/50 transition shrink-0"
              >
                {isAiPending ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Generating…
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Auto-Generate
                  </>
                )}
              </button>
            </div>

            {/* AI Error */}
            {aiError && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mt-2">
                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-500">{aiError}</p>
              </div>
            )}
          </section>

          {/* ── Section: Words ── */}
          <section className="px-8 py-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-red-500">
                Words{" "}
                <span className="text-gray-500 font-normal normal-case tracking-normal">
                  ({words.filter(Boolean).length} added)
                </span>
              </h2>
              <button
                type="button"
                onClick={addWord}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-gray-800 px-3 py-1.5 rounded-lg transition"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Word
              </button>
            </div>

            <div className="space-y-2.5">
              {words.map((word, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs text-gray-500 font-mono flex-shrink-0">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => updateWord(index, e.target.value)}
                    placeholder={`Word ${index + 1}`}
                    className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-400 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  />
                  {words.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWord(index)}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition"
                      aria-label={`Remove word ${index + 1}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Footer: Error + Submit ── */}
          <div className="px-8 py-6 bg-gray-800 flex flex-col gap-3">
            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <svg
                  className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold text-sm py-3.5 rounded-2xl shadow-md shadow-red-900/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {isPending ? (
                <>
                  {/* Spinner */}
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Generating Puzzle…
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate Puzzle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}



