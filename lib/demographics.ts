export type DemographicKey = "race" | "age" | "gender";

export type Demographics = {
  race: Record<string, number>;
  age: Record<string, number>;
  gender: Record<string, number>;
};

export type PhaseTwoResponse = {
  success: boolean;
  message: string;
  data: Demographics;
};

export type Score = {
  /** Raw key from the API, e.g. "south asian". Use this as a stable id. */
  key: string;
  /** Display form, e.g. "South Asian". */
  label: string;
  /** Raw 0–1 value from the API. */
  value: number;
  /** Percentage string to 2dp, e.g. "77.49". */
  percent: string;
};

/** "south asian" -> "South Asian". Leaves "70+" and "0-2" alone. */
function toLabel(key: string): string {
  return key
    .split(" ")
    .map((word) =>
      /^[a-z]/.test(word) ? word[0].toUpperCase() + word.slice(1) : word
    )
    .join(" ");
}

/** Sorts one category descending and formats each score to 2dp. */
export function toScores(category: Record<string, number>): Score[] {
  return Object.entries(category)
    .map(([key, value]) => ({
      key,
      label: toLabel(key),
      value,
      percent: (value * 100).toFixed(2),
    }))
    .sort((a, b) => b.value - a.value);
}

/** Runs toScores over all three categories. */
export function toAllScores(data: Demographics) {
  return {
    race: toScores(data.race),
    age: toScores(data.age),
    gender: toScores(data.gender),
  };
}

/** The API's top pick for a category — the default selection on load. */
export function topKey(scores: Score[]): string {
  return scores[0]?.key ?? "";
}