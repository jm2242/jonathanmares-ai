export const writingInterestFilters = [
  { label: "Cycling", value: "cycling" },
  { label: "DIY Projects", value: "diy-projects" },
  { label: "Hiking", value: "hiking" },
  { label: "Jazz", value: "jazz" },
  { label: "Sauna", value: "sauna" },
  { label: "Weightlifting", value: "weightlifting" },
] as const;

export type WritingInterestValue = (typeof writingInterestFilters)[number]["value"];

export function getWritingInterestFilter(value?: string | null) {
  return writingInterestFilters.find((interest) => interest.value === value);
}

export function postMatchesWritingInterest(
  post: { tags?: string[] },
  interest: { value: WritingInterestValue }
) {
  return post.tags?.includes(interest.value) ?? false;
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
