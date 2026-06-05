export function BrandStory({ data }: { data: { heading: string; description1: string; description2: string } }) {
  return (
    <section className="bg-zinc-950 text-white py-32">
      <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-[#867b5d]">{data.heading}</h2>
          <p className="text-lg text-zinc-300 leading-relaxed mb-6 font-[var(--font-sora)]">
            {data.description1}
          </p>
          <p className="text-lg text-zinc-400 leading-relaxed">
            {data.description2}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square bg-zinc-800 rounded-2xl"></div>
          <div className="aspect-square bg-zinc-800 rounded-2xl translate-y-8"></div>
        </div>
      </div>
    </section>
  );
}
