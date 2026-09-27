"use client";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-12">
      <div className="rounded-[32px] border border-coral/20 bg-white/80 p-10 text-center shadow-soft backdrop-blur">
        <h1 className="font-[var(--font-heading)] text-4xl font-bold text-pine">
          Something interrupted the prototype
        </h1>
        <p className="mt-4 text-pine/70">{error.message || "Please try the request again."}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-pine px-5 py-3 font-semibold text-white"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
