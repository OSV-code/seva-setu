import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 text-center text-slate-900">
      <h1 className="text-3xl font-bold tracking-tight">You are offline</h1>
      <p className="mt-3 text-sm text-slate-600">
        Reconnect to book tests or view reports. You can still browse the app shell while offline.
      </p>
      <Link
        href="/book"
        className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        Try Booking Again
      </Link>
    </main>
  );
}
