import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-12">
      <div className="rounded-[32px] border border-pine/10 bg-white/80 p-10 text-center shadow-soft backdrop-blur">
        <h1 className="font-[var(--font-heading)] text-4xl font-bold text-pine">Page not found</h1>
        <p className="mt-4 text-pine/70">
          The prototype route you requested is not part of this demo.
        </p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-pine px-5 py-3 font-semibold text-white">
          Return to the main app
        </Link>
      </div>
    </main>
  );
}
