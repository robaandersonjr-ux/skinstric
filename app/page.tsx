export default function Home() {
  return (
    <main className="relative h-[calc(100vh-56px)] overflow-hidden">
      {/* MOBILE: three nested diamonds behind the heading */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center lg:hidden"
      >
        <div className="absolute h-[500px] w-[500px] rotate-45 border border-dotted border-rule" />
        <div className="absolute h-[420px] w-[420px] rotate-45 border border-dotted border-rule" />
        <div className="absolute h-[350px] w-[350px] rotate-45 border border-dotted border-rule" />
      </div>

      {/* DESKTOP: left diamond + DISCOVER A.I. */}
      <div className="fixed left-[-32vw] top-1/2 hidden h-[760px] w-[760px] -translate-y-1/2 lg:block">
        <div
          aria-hidden
          className="h-full w-full rotate-45 border border-dotted border-rule"
        />
        <button
          type="button"
          className="group absolute right-0 top-1/2 flex -translate-y-1/2 translate-x-1/2 items-center gap-4 whitespace-nowrap"
        >
          <span className="relative inline-flex h-[30px] w-[30px] items-center justify-center">
            <span className="absolute inset-0 rotate-45 border border-solid border-ink transition-transform duration-300 group-hover:scale-110" />
            <svg
              viewBox="0 0 24 24"
              width="10"
              height="10"
              className="relative rotate-180 fill-current"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="text-sm">DISCOVER A.I.</span>
        </button>
      </div>

      {/* DESKTOP: right diamond + TAKE TEST */}
      <div className="pointer-events-none fixed right-[-32vw] top-1/2 hidden h-[760px] w-[760px] -translate-y-1/2 lg:block">
        <div
          aria-hidden
          className="h-full w-full rotate-45 border border-dotted border-rule"
        />
        <a
          
  href="/testing"
  className="group pointer-events-auto absolute left-0 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-4 whitespace-nowrap"
>
          <span className="text-sm">TAKE TEST</span>
          <span className="relative inline-flex h-[30px] w-[30px] items-center justify-center">
            <span className="absolute inset-0 rotate-45 border border-solid border-ink transition-transform duration-300 group-hover:scale-110" />
            <svg
              viewBox="0 0 24 24"
              width="10"
              height="10"
              className="relative fill-current"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </a>
      </div>

      {/* Heading — both breakpoints */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <h1 className="text-[60px] font-normal leading-none tracking-tighter lg:text-[100px]">
          Sophisticated
          <br />
          <span className="block">skincare</span>
        </h1>

        <p className="mt-4 w-[30ch] text-[16px] font-semibold text-ink-muted lg:hidden">
          Skinstric developed an A.I. that creates a highly-personalized routine
          tailored to what your skin needs.
        </p>

        <a
          href="/testing"
          className="group mt-6 inline-flex items-center gap-4 whitespace-nowrap lg:hidden"
        >
          <span className="text-[12px] font-bold">ENTER EXPERIENCE</span>
          <span className="relative inline-flex h-[24px] w-[24px] items-center justify-center">
            <span className="absolute inset-0 rotate-45 border border-solid border-ink transition-transform duration-300 group-hover:scale-110" />
            <svg
              viewBox="0 0 24 24"
              width="10"
              height="10"
              className="relative fill-current"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </a>
      </div>

      {/* DESKTOP: bottom-left blurb */}
      <p className="fixed bottom-[8vh] left-8 hidden text-sm lg:block">
        SKINSTRIC DEVELOPED AN A.I. THAT CREATES A<br/>
        HIGHLY-PERSONALIZED ROUTINE TAILORED TO <br/>
        WHAT YOUR SKIN NEEDS.
      </p>
    </main>
  )
}