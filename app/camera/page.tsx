"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Status = "requesting" | "ready" | "denied" | "unavailable";

export default function Camera() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<Status>("requesting");

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("unavailable");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        // The user may have navigated away while the permission prompt was open.
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("denied");
      }
    }

    start();

    // Release the camera when leaving the page, or the light stays on.
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  function handleCapture() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // JPEG at 0.9 keeps the base64 payload far smaller than PNG.
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    sessionStorage.setItem("skinstric:image", dataUrl);
    stopStream();
    router.push("/select");
  }

  function handleBack() {
    stopStream();
    router.push("/result");
  }

  return (
    <main className="relative h-[calc(100vh-56px)] overflow-hidden">
      <p className="absolute left-8 top-8 text-[12px] font-semibold uppercase">
        To start analysis
      </p>

      <div className="flex h-full flex-col items-center justify-center gap-6">
        {status === "requesting" && (
          <p className="text-sm">Requesting camera access…</p>
        )}

        {status === "denied" && (
          <div className="text-center">
            <p className="text-sm">Camera access was denied.</p>
            <p className="mt-2 text-sm text-ink-muted">
              Allow camera access in your browser settings, or go back and
              upload a photo instead.
            </p>
          </div>
        )}

        {status === "unavailable" && (
          <div className="text-center">
            <p className="text-sm">No camera available on this device.</p>
            <p className="mt-2 text-sm text-ink-muted">
              Go back and upload a photo instead.
            </p>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`max-h-[60vh] w-auto max-w-full ${
            status === "ready" ? "block" : "hidden"
          }`}
        />

        {status === "ready" && (
          <button
            type="button"
            onClick={handleCapture}
            className="flex h-[64px] w-[64px] items-center justify-center rounded-full border border-ink transition-transform duration-300 hover:scale-105"
            aria-label="Take selfie"
          >
            <span className="h-[48px] w-[48px] rounded-full bg-ink" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleBack}
        className="group absolute bottom-8 left-8 flex items-center gap-4"
      >
        <span className="relative inline-flex h-[30px] w-[30px] items-center justify-center">
          <span className="absolute inset-0 rotate-45 border border-ink transition-transform duration-300 group-hover:scale-110" />
          <svg viewBox="0 0 24 24" width="10" height="10" className="relative rotate-180 fill-current">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="text-sm">BACK</span>
      </button>
    </main>
  );
}