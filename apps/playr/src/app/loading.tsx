export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 bg-zinc-950 z-[100] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full animate-spin mb-4"></div>
        <div className="text-white font-black tracking-widest text-sm uppercase animate-pulse">Loading playR</div>
      </div>
    </div>
  );
}
