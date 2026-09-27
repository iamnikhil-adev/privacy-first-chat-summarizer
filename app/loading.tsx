export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12">
      <div className="rounded-[32px] border border-pine/10 bg-white/80 px-8 py-6 text-center shadow-soft backdrop-blur">
        <div className="font-[var(--font-heading)] text-3xl font-bold text-pine">Loading prototype</div>
        <p className="mt-3 text-pine/70">Pulling chat context, privacy banners, and metrics.</p>
      </div>
    </main>
  );
}
