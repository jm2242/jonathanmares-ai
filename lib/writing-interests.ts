export const writingInterestFilters = [
  { label: "Cycling", value: "cycling", tags: ["cycling"] },
  { label: "DIY Projects", value: "diy-projects", tags: ["diy-projects"] },
  {
    label: "Engineering",
    value: "engineering",
    tags: ["tech", "software", "react", "redux", "github", "api"],
  },
  { label: "Hiking", value: "hiking", tags: ["hiking"] },
  { label: "Jazz", value: "jazz", tags: ["jazz"] },
  { label: "Motorcycles", value: "motorcycles", tags: ["motorcycle"] },
  { label: "Music", value: "music", tags: ["piano", "classical", "jazz", "recordings"] },
  { label: "Sauna", value: "sauna", tags: ["sauna"] },
  { label: "Weightlifting", value: "weightlifting", tags: ["weightlifting"] },
] as const;

export type WritingInterestValue = (typeof writingInterestFilters)[number]["value"];

export function getWritingInterestFilter(value?: string | null) {
  return writingInterestFilters.find((interest) => interest.value === value);
}

export function postMatchesWritingInterest(
  post: { tags?: string[] },
  interest: { value: WritingInterestValue }
) {
  const filter = getWritingInterestFilter(interest.value);
  return filter?.tags.some((tag) => post.tags?.includes(tag)) ?? false;
}

export function displayWritingCategory(tags?: string[]) {
  if (!tags?.length) return "Writing";
  if (tags.includes("motorcycle")) return "Motorcycle";
  if (tags.includes("piano")) return "Piano";
  if (tags.some((tag) => ["tech", "software", "react"].includes(tag))) return "Software";

  const interest = writingInterestFilters.find(({ value }) => tags.includes(value));
  if (interest) return interest.label;

  const [firstTag] = tags;
  return firstTag.charAt(0).toUpperCase() + firstTag.slice(1);
}
