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
];

const jazzRecordings: Recording[] = [];

export default function Piano() {
  const renderTable = (recordings: Recording[], title: string) => {
    if (recordings.length === 0) return null;

    return (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-[#111111] dark:text-gray-100 border-b border-gray-200 dark:border-gray-800 pb-2">
          {title}
        </h2>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header */}
            <div className="grid grid-cols-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-t-lg">
              <div className="py-3 px-4 font-semibold text-[#111111] dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                Name
              </div>
              <div className="py-3 px-4 font-semibold text-[#111111] dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                Composer
              </div>
              <div className="py-3 px-4 font-semibold text-[#111111] dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                Recording Date
              </div>
              <div className="py-3 px-4 font-semibold text-[#111111] dark:text-gray-100">
                YouTube Link
              </div>
            </div>

            {/* Rows */}
            {recordings.map((recording, index) => (
              <div
                key={index}
                className={`piano-recording-row grid grid-cols-4 bg-[#f9fafb] dark:bg-gray-900 border-l border-r border-gray-200 dark:border-gray-800 ${
                  index === recordings.length - 1 ? "rounded-b-lg border-b" : "border-b"
                } hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
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

      {classicalRecordings.length === 0 && jazzRecordings.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">No recordings yet</p>
          <p className="text-sm">Recordings will appear here once added.</p>
        </div>
      )}
    </div>
  );
}
