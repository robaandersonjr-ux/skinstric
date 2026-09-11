"use client";

import { useRouter } from "next/navigation";

export default function Camera() {
  const router = useRouter();

  return (
    <main className="flex h-[calc(100vh-56px)] flex-col items-center justify-center gap-4">
      <p className="text-sm">Camera capture is not yet implemented.</p>
      <button
        type="button"
        onClick={() => router.push("/result")}
        className="text-sm underline"
      >
        Back to upload
      </button>
    </main>
  );
}