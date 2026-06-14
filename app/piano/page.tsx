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

interface SortState {
  column: SortColumn;
  order: SortOrder;
}

export default function Piano() {
  const [sortState, setSortState] = useState<Record<string, SortState>>({});

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

  const renderTable = (
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
        <h2 className="text-2xl font-semibold mb-6 text-[#111111] dark:text-gray-100 border-b border-gray-200 dark:border-gray-800 pb-2">
          {title}
        </h2>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header */}
            <div
              className="grid bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-t-lg"
              style={{ gridTemplateColumns: "2fr 1fr 0.75fr 1fr" }}
            >
              <button
                onClick={() => handleSortClick(sectionKey, "name")}
                className="py-3 px-4 font-semibold text-[#111111] dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 last:border-r-0 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                Name
                {currentState?.column === "name" && currentState?.order && (
                  <span className="text-sm">{currentState.order === "desc" ? "↓" : "↑"}</span>
                )}
              </button>
              <button
                onClick={() => handleSortClick(sectionKey, "composer")}
                className="py-3 px-4 font-semibold text-[#111111] dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 last:border-r-0 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                {secondColumnLabel}
                {currentState?.column === "composer" && currentState?.order && (
                  <span className="text-sm">{currentState.order === "desc" ? "↓" : "↑"}</span>
                )}
              </button>
              <button
                onClick={() => handleSortClick(sectionKey, "date")}
                className="py-3 px-4 font-semibold text-[#111111] dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 last:border-r-0 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                Date
                {currentState?.column === "date" && currentState?.order && (
                  <span className="text-sm">{currentState.order === "desc" ? "↓" : "↑"}</span>
                )}
              </button>
              <div className="py-3 px-4 font-semibold text-[#111111] dark:text-gray-100">
                YouTube Link
              </div>
            </div>

            {/* Rows */}
            {sortedRecordings.map((recording, index) => (
              <div
                key={index}
                className={`piano-recording-row grid bg-[#f9fafb] dark:bg-gray-900 border-l border-r border-gray-200 dark:border-gray-800 ${
                  index === sortedRecordings.length - 1 ? "rounded-b-lg border-b" : "border-b"
                } hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
                style={{ gridTemplateColumns: "2fr 1fr 0.75fr 1fr" }}
              >
                <div className="py-4 px-4 text-[#111111] dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{recording.title}</span>
                    {recording.blogPostSlug && (
                      <a
                        href={`/blog/${recording.blogPostSlug}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        title="Read blog post about this piece"
                      >
                        📝
                      </a>
                    )}
                  </div>
                </div>
                <div className="py-4 px-4 text-[#111111] dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                  {recording.composer}
                </div>
                <div className="py-4 px-4 text-[#111111] dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                  {recording.recordingDate}
                </div>
                <div className="py-4 px-4 text-[#111111] dark:text-gray-300">
                  <a
                    href={recording.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Watch
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-[#111111] dark:text-gray-100">
        Piano Recordings
      </h1>
      <p className="text-lg text-[#111111] dark:text-gray-300 mb-8">
        A collection of my classical and jazz piano performances. More to come!
      </p>

      {renderTable(classicalRecordings, "Classical")}
      {renderTable(jazzRecordings, "Jazz")}
      {renderTable(coversRecordings, "Covers", "Artist")}

      {classicalRecordings.length === 0 &&
        jazzRecordings.length === 0 &&
        coversRecordings.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">No recordings yet</p>
            <p className="text-sm">Recordings will appear here once added.</p>
          </div>
        )}
    </div>
  );
}
