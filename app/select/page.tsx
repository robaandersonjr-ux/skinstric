"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadDemographics } from "@/lib/phaseTwo";

export default function Select() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loadDemographics()) {
      setReady(true);
    } else {
      setError("No analysis found. Please upload an image first.");
    }
  }, []);

  return (
    <main className="relative h-[calc(100vh-56px)] overflow-hidden">
      <div className="ml-8 mt-4">
        <h2 className="text-base font-semibold leading-[24px]">A.I. ANALYSIS</h2>
        <p className="mt-2 text-sm uppercase">
          A.I. has estimated the following.
          <br />
          Fix estimated information if needed.
        </p>
      </div>

      <div className="relative flex h-[70%] items-center justify-center">
        <div className="relative grid rotate-45 grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!ready}
            onClick={() => router.push("/summary")}
            className="flex h-[150px] w-[150px] items-center justify-center bg-[#E1E1E2] transition-colors hover:bg-[#D4D4D6] disabled:opacity-50"
          >
            <span className="-rotate-45 text-center text-sm font-semibold">
              DEMOGRAPHICS
            </span>
          </button>

          {["SKIN TYPE DETAILS", "COSMETIC CONCERNS", "WEATHER"].map((label) => (
            <div
              key={label}
              className="flex h-[150px] w-[150px] items-center justify-center bg-[#F3F3F4]"
            >
              <span className="-rotate-45 text-center text-sm font-semibold">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="absolute bottom-24 left-1/2 -translate-x-1/2 text-[12px] text-red-600">
          {error}
        </p>
      )}

      <div className="absolute bottom-8 z-20 flex w-full justify-between px-8">
        <button
          type="button"
          onClick={() => router.push("/result")}
          className="group flex items-center gap-4"
        >
          <span className="relative inline-flex h-[30px] w-[30px] items-center justify-center">
            <span className="absolute inset-0 rotate-45 border border-ink transition-transform duration-300 group-hover:scale-110" />
            <svg viewBox="0 0 24 24" width="10" height="10" className="relative rotate-180 fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="text-sm">BACK</span>
        </button>

        <button
          type="button"
          disabled={!ready}
          onClick={() => router.push("/summary")}
          className="group flex items-center gap-4 disabled:opacity-50"
        >
          <span className="text-sm">GET SUMMARY</span>
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