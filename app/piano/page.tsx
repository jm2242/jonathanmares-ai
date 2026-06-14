"use client";

import { useState } from "react";

interface Recording {
  title: string;
  composer: string;
  recordingDate: string;
  url: string;
  blogPostSlug?: string;
}

const classicalRecordings: Recording[] = [
  {
    title: "Scherzo No 1 in B minor",
    composer: "Chopin",
    recordingDate: "11/25",
    url: "https://www.youtube.com/watch?v=so5QgKIyFMg",
  },
  {
    title: "Impromptu Op 90 No 2 E flat major",
    composer: "Schubert",
    recordingDate: "07/25",
    url: "https://www.youtube.com/watch?v=EMTg8d6Xvcw",
  },
  {
    title: "Ballade in G Minor Op. 23",
    composer: "Chopin",
    recordingDate: "10/2010",
    url: "https://www.youtube.com/watch?v=Dl8PmHgD2qM",
  },
];

const jazzRecordings: Recording[] = [];

const coversRecordings: Recording[] = [
  {
    title: "After the Love Has Gone",
    composer: "Earth Wind & Fire",
    recordingDate: "08/22",
    url: "https://www.youtube.com/watch?v=f6aWSKseYss",
  },
];

type SortOrder = "asc" | "desc" | null;
type SortColumn = "name" | "composer" | "date" | null;
type Tab = "all" | "classical" | "covers";

interface SortState {
  column: SortColumn;
  order: SortOrder;
}

export default function Piano() {
  const [sortState, setSortState] = useState<Record<string, SortState>>({});
  const [activeTab, setActiveTab] = useState<Tab>("all");

  // Parse date string to a sortable format
  const parseDate = (dateStr: string): Date => {
    // Handle formats like "11/25", "07/25", "10/2010", "08/22"
    const parts = dateStr.split("/");
    if (parts.length !== 2) return new Date(0); // Invalid format

    const month = parseInt(parts[0], 10) - 1; // Month is 0-indexed
    const yearStr = parts[1];

    // If year is 2 digits, assume 2000s (e.g., "25" -> 2025, "22" -> 2022)
    // If year is 4 digits, use as-is
    let year: number;
    if (yearStr.length === 2) {
      const twoDigitYear = parseInt(yearStr, 10);
      year = twoDigitYear < 50 ? 2000 + twoDigitYear : 1900 + twoDigitYear;
    } else {
      year = parseInt(yearStr, 10);
    }

    return new Date(year, month, 1);
  };

  const sortRecordings = (recordings: Recording[], sectionKey: string): Recording[] => {
    const state = sortState[sectionKey];
    if (!state || !state.column || !state.order) return recordings;

    return [...recordings].sort((a, b) => {
      let comparison = 0;

      if (state.column === "name") {
        comparison = a.title.localeCompare(b.title);
      } else if (state.column === "composer") {
        comparison = a.composer.localeCompare(b.composer);
      } else if (state.column === "date") {
        const dateA = parseDate(a.recordingDate);
        const dateB = parseDate(b.recordingDate);
        comparison = dateA.getTime() - dateB.getTime();
      }

      return state.order === "asc" ? comparison : -comparison;
    });
  };

  const handleSortClick = (sectionKey: string, column: SortColumn) => {
    const currentState = sortState[sectionKey];
    let newState: SortState;

    // If clicking a different column, start with desc
    if (!currentState || currentState.column !== column) {
      newState = { column, order: "desc" };
    } else if (currentState.order === "desc") {
      newState = { column, order: "asc" };
    } else {
      newState = { column: null, order: null };
    }

    setSortState((prev) => ({
      ...prev,
      [sectionKey]: newState,
    }));
  };

  const renderLibrary = (
    recordings: Recording[],
    title: string,
    secondColumnLabel: string = "Composer"
  ) => {
    if (recordings.length === 0) return null;

    const sectionKey = title.toLowerCase();
    const sortedRecordings = sortRecordings(recordings, sectionKey);
    const currentState = sortState[sectionKey];

    return (
      <section className="mb-12">
        <div className="mb-5 flex flex-col justify-between gap-4 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--green)]">
              {recordings.length} recording{recordings.length === 1 ? "" : "s"}
            </p>
            <h2 className="text-3xl font-bold text-[var(--foreground)]">{title}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ["name", "Name"],
              ["composer", secondColumnLabel],
              ["date", "Date"],
            ].map(([column, label]) => (
              <button
                key={column}
                onClick={() => handleSortClick(sectionKey, column as SortColumn)}
                className="min-h-10 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 text-sm font-bold text-[var(--foreground)] transition hover:border-[#b7c3ba] dark:hover:border-[#53625d]"
              >
                {label}
                {currentState?.column === column && currentState?.order && (
                  <span className="ml-2 text-[var(--green)]">
                    {currentState.order === "desc" ? "↓" : "↑"}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {sortedRecordings.map((recording) => (
            <div
              key={`${recording.title}-${recording.recordingDate}`}
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm transition hover:border-[#b7c3ba] dark:hover:border-[#53625d] sm:grid sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6"
            >
              <div>
                <h3 className="text-xl font-bold text-[var(--foreground)]">{recording.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm font-bold text-[var(--muted)]">
                    {recording.composer}
                  </span>
                  <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm font-bold text-[var(--muted)]">
                    {recording.recordingDate}
                  </span>
                  {recording.blogPostSlug && (
                    <a
                      href={`/blog/${recording.blogPostSlug}`}
                      className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm font-bold text-[var(--green)]"
                    >
                      Notes
                    </a>
                  )}
                </div>
              </div>
              <a
                href={recording.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--green-dark)] px-5 text-sm font-extrabold text-white transition hover:opacity-90 dark:bg-[#d9f0e9] dark:text-[#111816] sm:mt-0"
              >
                Watch
              </a>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const tabs: Array<{ key: Tab; label: string }> = [
    { key: "all", label: "All" },
    { key: "classical", label: "Classical" },
    { key: "covers", label: "Covers" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10">
      <header className="mb-10 max-w-3xl">
        <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--green)]">
          Recordings
        </p>
        <h1 className="font-serif-display text-5xl leading-none text-[var(--foreground)] sm:text-6xl">
          Piano Recordings
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
          A collection of my classical and jazz piano performances. More to come!
        </p>
      </header>

      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`min-h-11 rounded-full border px-5 text-sm font-extrabold transition ${
              activeTab === tab.key
                ? "border-[var(--green-dark)] bg-[var(--green-dark)] text-white dark:bg-[#d9f0e9] dark:text-[#111816]"
                : "border-[var(--line)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[#b7c3ba] dark:hover:border-[#53625d]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(activeTab === "all" || activeTab === "classical") &&
        renderLibrary(classicalRecordings, "Classical")}
      {activeTab === "all" && renderLibrary(jazzRecordings, "Jazz")}
      {(activeTab === "all" || activeTab === "covers") &&
        renderLibrary(coversRecordings, "Covers", "Artist")}

      {classicalRecordings.length === 0 &&
        jazzRecordings.length === 0 &&
        coversRecordings.length === 0 && (
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] py-12 text-center text-[var(--muted)]">
            <p className="text-lg mb-2">No recordings yet</p>
            <p className="text-sm">Recordings will appear here once added.</p>
          </div>
        )}
    </div>
  );
}
