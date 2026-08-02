"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/app/components/site-header";
import { StatusBadge } from "@/app/components/status-badge";
import { Booking } from "@/lib/domain";
import { getBookingsByPhone, getCurrentUser } from "@/lib/storage";

export default function MyBookingsPage() {
  const searchParams = useSearchParams();
  const createdBookingId = searchParams.get("created");

  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return;
    }

    setPhone(currentUser.phone);
    setBookings(getBookingsByPhone(currentUser.phone));
  }, []);

  function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookings(getBookingsByPhone(phone));
  }

  const hasBookings = bookings.length > 0;
  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [bookings],
  );

  return (
    <div className="min-h-screen bg-[var(--surface)] text-slate-900">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter your phone number to view active and past test collections.
        </p>

        <form onSubmit={handleLookup} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="10 digit mobile number"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none ring-orange-400 focus:ring sm:max-w-xs"
            maxLength={10}
          />
          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            View Bookings
          </button>
        </form>

        {!hasBookings ? (
          <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">
            No bookings found yet for this number.
          </section>
        ) : null}

        <section className="mt-8 grid gap-4">
          {sortedBookings.map((booking) => (
            <article
              key={booking.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm ${
                booking.id === createdBookingId ? "border-emerald-300" : "border-black/10"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{booking.testPackageName}</h2>
                <StatusBadge status={booking.status} />
              </div>

              <dl className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-slate-500">Booking ID</dt>
                  <dd>{booking.id}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Scheduled Slot</dt>
                  <dd>
                    {booking.slotDate} ({booking.slotTimeWindow})
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Address</dt>
                  <dd>
                    {booking.address.line1}, {booking.address.city} - {booking.address.pincode}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Amount</dt>
                  <dd>Rs. {booking.amount}</dd>
                </div>
              </dl>

              {booking.report ? (
                <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm">
                  <p className="font-semibold text-emerald-900">Report Ready</p>
                  <a
                    href={booking.report.dataUrl}
                    download={booking.report.fileName}
                    className="mt-1 inline-block font-medium text-emerald-700 underline"
                  >
                    Download {booking.report.fileName}
                  </a>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Report not uploaded yet.</p>
              )}
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
