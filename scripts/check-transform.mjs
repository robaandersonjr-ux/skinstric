import { readFile } from "node:fs/promises";

const raw = JSON.parse(
  await readFile("fixtures/phase-two-lowercase.json", "utf8")
);

function toScores(category) {
  return Object.entries(category)
    .map(([key, value]) => ({ key, percent: (value * 100).toFixed(2) }))
    .sort((a, b) => Number(b.percent) - Number(a.percent));
}

console.log("RACE:", toScores(raw.data.race));
console.log("AGE:", toScores(raw.data.age));
console.log("GENDER:", toScores(raw.data.gender));