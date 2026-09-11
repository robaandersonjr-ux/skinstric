import type { Demographics } from "./demographics";

const ENDPOINT =
  "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo";

const IMAGE_KEY = "skinstric:image";
const DATA_KEY = "skinstric:demographics";

/** Note: the API requires a lowercase "image" key, not "Image" as documented. */
export async function submitPhaseTwo(
  image: string
): Promise<{ ok: true; data: Demographics } | { ok: false; error: string }> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });

    const json = await res.json();

    if (!res.ok || json.success !== true || !json.data) {
      return { ok: false, error: json.message ?? "Analysis failed." };
    }

    return { ok: true, data: json.data as Demographics };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export function loadImage(): string | null {
  try {
    return sessionStorage.getItem(IMAGE_KEY);
  } catch {
    return null;
  }
}

export function saveDemographics(data: Demographics): void {
  sessionStorage.setItem(DATA_KEY, JSON.stringify(data));
}

export function loadDemographics(): Demographics | null {
  try {
    const raw = sessionStorage.getItem(DATA_KEY);
    return raw ? (JSON.parse(raw) as Demographics) : null;
  } catch {
    return null;
  }
}