// scripts/probe.mjs
// Probes both Skinstric endpoints and saves the raw responses as fixtures.
// Run with: node scripts/probe.mjs

import { writeFile, mkdir } from "node:fs/promises";

const BASE = "https://us-central1-frontend-simplified.cloudfunctions.net";
const OUT = "fixtures";

// A valid 1x1 transparent PNG, base64-encoded. Small enough to paste,
// real enough to be a legitimate image if the API actually decodes it.
const TINY_PNG =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

async function probe(label, endpoint, body) {
  console.log(`\n--- ${label} ---`);
  try {
    const res = await fetch(`${BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    console.log(`status: ${res.status} ${res.statusText}`);

    let parsed;
    try {
      parsed = JSON.parse(text);
      console.log(JSON.stringify(parsed, null, 2).slice(0, 600));
    } catch {
      console.log("non-JSON response:", text.slice(0, 300));
      return null;
    }

    await mkdir(OUT, { recursive: true });
    await writeFile(`${OUT}/${label}.json`, JSON.stringify(parsed, null, 2));
    return parsed;
  } catch (err) {
    console.error(`request failed:`, err.message);
    return null;
  }
}

await probe("phase-one", "skinstricPhaseOne", {
  name: "John Doe",
  location: "New York",
});

// Capital "I" — matches the spec exactly.
await probe("phase-two-raw", "skinstricPhaseTwo", { Image: TINY_PNG });

// Same image with the data-URL prefix the browser's FileReader produces.
// Tells you whether you need to strip it before sending.
await probe("phase-two-dataurl", "skinstricPhaseTwo", {
  Image: `data:image/png;base64,${TINY_PNG}`,
});

// Lowercase key — checks whether the API is strict about casing.
await probe("phase-two-lowercase", "skinstricPhaseTwo", { image: TINY_PNG });

// Lowercase key + data-URL prefix. Isolates whether the prefix matters.
await probe("phase-two-lowercase-dataurl", "skinstricPhaseTwo", {
  image: `data:image/png;base64,${TINY_PNG}`,
});

// Same call as the one that worked, run again.
// If the numbers differ, the response is randomized per request.
await probe("phase-two-repeat", "skinstricPhaseTwo", { image: TINY_PNG });