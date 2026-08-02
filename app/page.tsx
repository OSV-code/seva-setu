import Link from "next/link";
import { SiteHeader } from "@/app/components/site-header";
import { TEST_PACKAGES } from "@/lib/demo-data";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-slate-900">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-7 shadow-sm sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(249,115,22,0.2),transparent_45%),radial-gradient(circle_at_85%_20%,rgba(20,184,166,0.18),transparent_50%)]" />
          <div className="relative">
            <p className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-wider text-slate-700">
              HOME COLLECTION PATHOLOGY
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
              Book pathology tests at home. Receive reports digitally.
            </h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Seva Setu helps families book convenient sample collection slots and track progress from
              request to report-ready status.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Book a Test
              </Link>
              <Link
                href="/my-bookings"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-500"
              >
                Track My Bookings
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {["Pick Test", "Choose Slot", "Get Report"].map((step, index) => (
            <article key={step} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                Step {index + 1}
              </p>
              <h2 className="mt-2 text-xl font-semibold">{step}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {index === 0
                  ? "Browse curated test packages with transparent pricing."
                  : index === 1
                    ? "Pick your address and preferred date/time window."
                    : "Admin uploads report and you can download it from My Bookings."}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Popular Test Packages</h2>
            <Link href="/book" className="text-sm font-semibold text-orange-700 hover:text-orange-800">
              Start booking now
            </Link>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEST_PACKAGES.map((pkg) => (
              <article key={pkg.id} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold">{pkg.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{pkg.description}</p>
                <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">Sample: {pkg.sampleType}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xl font-bold">Rs. {pkg.price}</p>
                  <Link
                    href={`/book?packageId=${pkg.id}`}
                    className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
                  >
                    Select
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
