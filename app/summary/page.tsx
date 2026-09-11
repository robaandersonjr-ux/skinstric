"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  toScores,
  topKey,
  type Demographics,
  type Score,
} from "@/lib/demographics";
import { loadDemographics } from "@/lib/phaseTwo";

type Category = "race" | "age" | "gender";

const CATEGORY_LABELS: Record<Category, string> = {
  race: "RACE",
  age: "AGE",
  gender: "SEX",
};

/** Ring chart. r=49.15 in a 100x100 box gives a circumference of 308.819. */
function Ring({ percent }: { percent: number }) {
  const CIRCUMFERENCE = 308.819;
  const offset = CIRCUMFERENCE * (1 - percent / 100);

  return (
    <div className="relative aspect-square w-full max-w-[384px]">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="49.15"
          fill="none"
          stroke="#E1E1E2"
          strokeWidth="1.7"
        />
        <circle
          cx="50"
          cy="50"
          r="49.15"
          fill="none"
          stroke="#1A1B1C"
          strokeWidth="1.7"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-[40px] font-normal">
          {percent.toFixed(2)}
          <span className="text-3xl">%</span>
        </p>
      </div>
    </div>
  );
}

export default function Summary() {
  const router = useRouter();

  const [data, setData] = useState<Demographics | null>(null);
  const [category, setCategory] = useState<Category>("race");
  const [selected, setSelected] = useState<Record<Category, string>>({
    race: "",
    age: "",
    gender: "",
  });

  useEffect(() => {
    const stored = loadDemographics();
    if (!stored) {
      router.push("/result");
      return;
    }
    setData(stored);
    // Default each category to the A.I.'s top pick.
    setSelected({
      race: topKey(toScores(stored.race)),
      age: topKey(toScores(stored.age)),
      gender: topKey(toScores(stored.gender)),
    });
  }, [router]);

  if (!data) {
    return (
      <main className="flex h-[calc(100vh-56px)] items-center justify-center">
        <p className="text-sm">Loading analysis…</p>
      </main>
    );
  }

  const scores: Score[] = toScores(data[category]);
  const activeKey = selected[category];
  const active = scores.find((s) => s.key === activeKey) ?? scores[0];
  const activeLabel =
    category === "age" ? `${active.label} y.o.` : active.label;

  return (
    <main className="mx-5 flex h-[calc(100vh-56px)] flex-col">
      <div className="mb-6 text-start">
        <h2 className="mb-1 text-base font-semibold leading-[24px]">
          A.I. ANALYSIS
        </h2>
        <h3 className="text-4xl font-normal tracking-tighter md:text-[72px] md:leading-[64px]">
          DEMOGRAPHICS
        </h3>
        <h4 className="mt-2 text-sm leading-[24px]">PREDICTED RACE &amp; AGE</h4>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.5fr_8.5fr_3.15fr]">
        {/* Left: category selector */}
        <div className="flex flex-col space-y-3">
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((key) => {
            const isActive = key === category;
            const label = selected[key];
            const display =
              key === "age" && label
                ? label
                : label
                  ? label.charAt(0).toUpperCase() + label.slice(1)
                  : "—";

            return (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={`flex flex-1 flex-col justify-between border-t p-3 text-left transition-colors ${
                  isActive
                    ? "bg-[#1A1B1C] text-white"
                    : "bg-[#F3F3F4] hover:bg-[#E1E1E2]"
                }`}
              >
                <p className="text-base font-semibold">{display}</p>
                <h4 className="mb-1 text-base font-semibold">
                  {CATEGORY_LABELS[key]}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Center: label + ring */}
        <div className="relative flex flex-col items-center justify-center bg-[#F3F3F4] p-4 md:h-[57vh] md:border-t">
          <p className="absolute left-7 top-4 text-[40px]">{activeLabel}</p>
          <div className="md:absolute md:bottom-2 md:right-5">
            <Ring percent={Number(active.percent)} />
          </div>
          <p className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-rule">
            If A.I. estimate is wrong, select the correct one.
          </p>
        </div>

        {/* Right: score list */}
        <div className="bg-[#F3F3F4] py-4 md:border-t">
          <div className="flex justify-between px-4">
            <h4 className="mb-2 text-base font-medium tracking-tight">
              {CATEGORY_LABELS[category]}
            </h4>
            <h4 className="mb-2 text-base font-medium tracking-tight">
              A.I. CONFIDENCE
            </h4>
          </div>

          {scores.map((score) => {
            const isActive = score.key === activeKey;
            return (
              <button
                key={score.key}
                type="button"
                onClick={() =>
                  setSelected((prev) => ({ ...prev, [category]: score.key }))
                }
                className={`flex h-[48px] w-full items-center justify-between px-4 transition-colors ${
                  isActive
                    ? "bg-[#1A1B1C] text-white"
                    : "hover:bg-[#E1E1E2]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`inline-block h-[10px] w-[10px] rotate-45 border ${
                      isActive
                        ? "border-white bg-white"
                        : "border-ink"
                    }`}
                  />
                  <span className="text-base leading-6 tracking-tight">
                    {score.label}
                  </span>
                </span>
                <span className="text-base leading-6 tracking-tight">
                  {score.percent}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto flex justify-between pb-8">
        <button
          type="button"
          onClick={() => router.push("/select")}
          className="group flex items-center gap-4"
        >
          <span className="relative inline-flex h-[30px] w-[30px] items-center justify-center">
            <span className="absolute inset-0 rotate-45 border border-ink transition-transform duration-300 group-hover:scale-110" />
            <svg viewBox="0 0 24 24" width="10" height="10" className="relative rotate-180 fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="text-sm font-semibold">BACK</span>
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="group flex items-center gap-4"
        >
          <span className="text-sm font-semibold">HOME</span>
          <span className="relative inline-flex h-[30px] w-[30px] items-center justify-center">
            <span className="absolute inset-0 rotate-45 border border-ink transition-transform duration-300 group-hover:scale-110" />
            <svg viewBox="0 0 24 24" width="10" height="10" className="relative fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      </div>
    </main>
  );
}