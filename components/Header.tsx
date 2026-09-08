export default function Header() {
  return (
    <header className="flex w-full items-center justify-between px-4 py-2">
      <div className="flex items-center gap-1">
      <a
        href="/"
        className="text-sm font-semibold leading-none tracking-tight text-ink"
      >
          SKINSTRIC
        </a>
        <span className="text-sm font-normal leading-none text-ink-muted">
          [ INTRO ]
        </span>
      </div>

      <button
        type="button"
        className="rounded-sm bg-ink px-4 py-2 text-[10px] font-semibold leading-4 text-ink-inverse transition-colors hover:bg-ink/90"
      >
        ENTER CODE
      </button>
    </header>
  );
}