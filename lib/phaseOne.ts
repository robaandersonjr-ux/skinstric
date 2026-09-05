const ENDPOINT =
  "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne";

const STORAGE_KEY = "skinstric:user";

export type UserInfo = { name: string; location: string };

export async function submitPhaseOne(
  info: UserInfo
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(info),
    });

    const json = await res.json();

    if (!res.ok || json.success !== true) {
      return { ok: false, error: json.message ?? "Submission failed." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export function saveUserInfo(info: UserInfo): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
}

export function loadUserInfo(): UserInfo | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserInfo) : null;
  } catch {
    return null;
  }
}