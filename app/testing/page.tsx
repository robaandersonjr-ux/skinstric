"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateTextField } from "@/lib/validation";
import { submitPhaseOne, saveUserInfo } from "@/lib/phaseOne";
import DiamondStack from "@/components/DiamondStack";

type Step = "name" | "location" | "processing" | "thanks";

/** Small rotated-diamond arrow button used for BACK and PROCEED. */
function NavButton({
  label,
  direction,
  onClick,
}: {
  label: string;
  direction: "left" | "right";
  onClick: () => void;
}) {
  const diamond = (
    <span className="relative inline-flex h-[30px] w-[30px] items-center justify-center">
      <span className="absolute inset-0 rotate-45 border border-solid border-ink transition-transform duration-300 group-hover:scale-110" />
      <svg
        viewBox="0 0 24 24"
        width="10"
        height="10"
        className={`relative fill-current ${direction === "left" ? "rotate-180" : ""}`}
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-4"
    >
      {direction === "left" ? diamond : <span className="text-sm">{label}</span>}
      {direction === "left" ? <span className="text-sm">{label}</span> : diamond}
    </button>
  );
}

export default function Testing() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);

  const value = step === "name" ? name : location;
  const setValue = step === "name" ? setName : setLocation;
  const fieldLabel = step === "name" ? "name" : "city name";

  async function handleProceed() {
    const result = validateTextField(value, fieldLabel);

    if (!result.valid) {
      setError(result.error);
      return;
    }

    setError(null);

    // The name step only advances — nothing is sent until we have both fields.
    if (step === "name") {
      setName(result.value);
      setStep("location");
      return;
    }

    setStep("processing");

    const info = { name, location: result.value };
    const response = await submitPhaseOne(info);

    if (!response.ok) {
      setError(response.error);
      setStep("location");
      return;
    }

    saveUserInfo(info);
    setStep("thanks");
  }

  function handleBack() {
    setError(null);
    if (step === "location") setStep("name");
    else if (step === "processing" || step === "thanks") setStep("location");
    else router.push("/");
  }

  /* ---------- Processing / Thank you ---------- */

  if (step === "processing" || step === "thanks") {
    return (
      <main className="relative h-[calc(100vh-56px)] overflow-hidden">
        <p className="absolute left-8 top-8 text-[12px] font-semibold uppercase">
          To start analysis
        </p>

        <DiamondStack />

        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          {step === "processing" ? (
            <>
              <p className="text-[16px]">Processing submission</p>
              <div className="mt-4 flex gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink [animation-delay:200ms]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink [animation-delay:400ms]" />
              </div>
            </>
          ) : (
            <>
              <p className="text-[24px]">Thank you!</p>
              <p className="mt-2 text-[16px]">Proceed for the next step</p>
            </>
          )}
        </div>

        <div className="absolute bottom-8 left-8">
          <NavButton label="BACK" direction="left" onClick={handleBack} />
        </div>

        {step === "thanks" && (
          <div className="absolute bottom-8 right-8">
            <NavButton
              label="PROCEED"
              direction="right"
              onClick={() => router.push("/result")}
            />
          </div>
        )}
      </main>
    );
  }

  /* ---------- Name / Location input ---------- */

  return (
    <main className="relative h-[calc(100vh-56px)] overflow-hidden">
      <p className="absolute left-8 top-8 text-[12px] font-semibold uppercase">
        To start analysis
      </p>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="absolute h-[500px] w-[500px] rotate-45 border border-dotted border-rule" />
        <div className="absolute h-[420px] w-[420px] rotate-45 border border-dotted border-rule" />
        <div className="absolute h-[350px] w-[350px] rotate-45 border border-dotted border-rule" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <p className="text-[12px] uppercase tracking-wide text-ink-muted">
          Click to type
        </p>

        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleProceed();
          }}
          autoFocus
          placeholder={step === "name" ? "Introduce Yourself" : "Your City Name"}
          className="mt-2 w-[400px] border-b border-ink bg-transparent pb-2 text-center text-[40px] font-normal tracking-tighter outline-none placeholder:text-ink/40"
        />

        {/* Fixed height keeps the layout from jumping when an error appears */}
        <p className="mt-3 h-5 text-[12px] text-red-600">{error ?? ""}</p>
      </div>

      <div className="absolute bottom-8 left-8">
        <NavButton label="BACK" direction="left" onClick={handleBack} />
      </div>

      <div className="absolute bottom-8 right-8">
        <NavButton label="PROCEED" direction="right" onClick={handleProceed} />
      </div>
    </main>
  );
}