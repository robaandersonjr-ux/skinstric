export default function DiamondStack() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div className="absolute h-[420px] w-[420px] rotate-[41deg] border border-dotted border-rule" />
      <div className="absolute h-[420px] w-[420px] rotate-45 border border-dotted border-rule" />
      <div className="absolute h-[420px] w-[420px] rotate-[49deg] border border-dotted border-rule" />
    </div>
  );
}