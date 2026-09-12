"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DiamondStack from "@/components/DiamondStack";

export default function Result() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      // Hand the image to the analysis step via sessionStorage —
      // data URLs are far too long for a query string.
      sessionStorage.setItem("skinstric:image", dataUrl);
      router.push("/select");
    };
    reader.readAsDataURL(file);
  }

  return (
    <main className="relative h-[calc(100vh-56px)] overflow-hidden">
      <p className="absolute left-8 top-8 text-[12px] font-semibold uppercase">
        To start analysis
      </p>

      {/* Preview panel, top right */}
      <div className="absolute right-8 top-8">
        <p className="mb-2 text-[12px]">Preview</p>
        <div className="h-[100px] w-[100px] border border-ink/20">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Selected preview"
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      <DiamondStack />

      {/* Two choices, centered */}
         <div className="pointer-events-none relative z-10 flex h-full items-center justify-center gap-32">        {/* Camera — Phase 3 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => router.push("/camera")}
            aria-label="Allow A.I. to scan your face"
            className="pointer-events-auto flex h-[136px] w-[136px] items-center justify-center rounded-full border border-ink transition-transform duration-300 hover:scale-105"
          >
            <svg viewBox="0 0 48 48" width="72" height="72" fill="currentColor">
              <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M24 6 L34 20 L24 24 Z" />
              <path d="M42 24 L30 32 L24 24 Z" />
              <path d="M32 40 L22 30 L24 24 Z" />
              <path d="M10 38 L18 24 L24 24 Z" />
              <path d="M6 20 L20 18 L24 24 Z" />
            </svg>
          </button>
          {/* Leader line + label, up and to the right */}
          <span className="absolute -top-6 left-[120px] hidden h-px w-[60px] -rotate-[30deg] bg-ink lg:block" />
          <p className="absolute -top-16 left-[170px] hidden whitespace-nowrap text-sm lg:block">
            Allow A.I.
            <br />
            to scan your face
          </p>
        </div>

        {/* Gallery — Phase 2 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Allow A.I. to access gallery"
            className="pointer-events-auto flex h-[136px] w-[136px] items-center justify-center rounded-full border border-ink transition-transform duration-300 hover:scale-105"
          >
            <svg viewBox="0 0 48 48" width="72" height="72" fill="currentColor">
              <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="31" cy="17" r="5" />
              <path d="M10 36 L20 22 L30 36 Z" />
            </svg>
          </button>
          <span className="absolute bottom-0 right-[120px] hidden h-px w-[60px] -rotate-[30deg] bg-ink lg:block" />
          <p className="absolute bottom-[-40px] right-[170px] hidden whitespace-nowrap text-right text-sm lg:block">
            Allow A.I.
            <br />
            access gallery
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Back */}
      <button
        type="button"
        onClick={() => router.push("/testing")}
        className="group absolute bottom-8 left-8 z-20 flex items-center gap-4"
      >
        <span className="relative inline-flex h-[30px] w-[30px] items-center justify-center">
          <span className="absolute inset-0 rotate-45 border border-solid border-ink transition-transform duration-300 group-hover:scale-110" />
          <svg viewBox="0 0 24 24" width="10" height="10" className="relative rotate-180 fill-current">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="text-sm">BACK</span>
      </button>
    </main>
  );
}