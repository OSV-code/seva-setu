"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/app/components/site-header";
import { StatusBadge } from "@/app/components/status-badge";
import { BOOKING_STATUSES, Booking, BookingStatus, ReportAsset, getNextStatuses } from "@/lib/domain";
import { assignLab, attachReportToBooking, getBookings, updateBookingStatus } from "@/lib/storage";

const defaultAdminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "seva123";

function getAllowedStatusOptions(currentStatus: BookingStatus): BookingStatus[] {
  const next = getNextStatuses(currentStatus);
  return [currentStatus, ...next];
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!unlocked) {
      return;
    }

    setBookings(getBookings());
  }, [unlocked]);

  const stats = useMemo(() => {
    const buckets: Record<BookingStatus, number> = {
      requested: 0,
      confirmed: 0,
      technician_assigned: 0,
      sample_collected: 0,
      processing: 0,
      report_ready: 0,
      cancelled: 0,
    };

    for (const booking of bookings) {
      buckets[booking.status] += 1;
    }

    return buckets;
  }, [bookings]);

  function handleUnlock() {
    if (password !== defaultAdminPassword) {
      setError("Incorrect password.");
      return;
    }

    setError(null);
    setUnlocked(true);
  }

  function updateBookingInState(nextBooking: Booking) {
    setBookings((prev) => prev.map((booking) => (booking.id === nextBooking.id ? nextBooking : booking)));
  }

  function handleStatusChange(bookingId: string, nextStatus: BookingStatus) {
    try {
      const updated = updateBookingStatus(bookingId, nextStatus);
      updateBookingInState(updated);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    }
  }

  function handleLabBlur(bookingId: string, labName: string) {
    try {
      const updated = assignLab(bookingId, labName);
      updateBookingInState(updated);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign lab.");
    }
  }

  function handleReportUpload(bookingId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const report: ReportAsset = {
        id: `rep_${crypto.randomUUID()}`,
        fileName: file.name,
        dataUrl: String(reader.result),
        uploadedAt: new Date().toISOString(),
        uploadedBy: "admin",
      };

      try {
        const updated = attachReportToBooking(bookingId, report);
        updateBookingInState(updated);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload report.");
      }
    };

    reader.readAsDataURL(file);
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[var(--surface)] text-slate-900">
        <SiteHeader />
        <main className="mx-auto w-full max-w-lg px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Access</h1>
          <p className="mt-2 text-sm text-slate-600">Phase 1 internal page for manual booking operations.</p>
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <label className="space-y-1 block">
              <span className="text-sm font-medium">Admin password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-orange-400 focus:ring"
                placeholder="Enter password"
              />
            </label>
            {error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}
            <button
              type="button"
              onClick={handleUnlock}
              className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Unlock Admin Panel
            </button>
            <p className="mt-3 text-xs text-slate-500">
              Default password is "seva123". Override it with NEXT_PUBLIC_ADMIN_PASSWORD.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] text-slate-900">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Booking Console</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manual assignment, status updates, and report upload for Phase 1 demo.
        </p>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BOOKING_STATUSES.map((status) => (
            <div key={status} className="rounded-xl border border-black/10 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{status.replaceAll("_", " ")}</p>
              <p className="mt-2 text-2xl font-semibold">{stats[status]}</p>
            </div>
          ))}
        </section>

        {error ? <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

        <section className="mt-6 grid gap-4">
          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">
              No bookings yet.
            </div>
          ) : null}

          {bookings.map((booking) => {
            const statusOptions = getAllowedStatusOptions(booking.status);

            return (
              <article key={booking.id} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">{booking.testPackageName}</h2>
                  <StatusBadge status={booking.status} />
                </div>

                <p className="mt-1 text-sm text-slate-500">{booking.id}</p>

                <dl className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                  <div>
                    <dt className="font-medium text-slate-500">Customer</dt>
                    <dd>
                      {booking.customer.name} ({booking.customer.phone})
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-500">Collection Slot</dt>
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

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <label className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Lab Assigned</span>
                    <input
                      defaultValue={booking.labName ?? ""}
                      onBlur={(event) => handleLabBlur(booking.id, event.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-orange-400 focus:ring"
                      placeholder="Lab name"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Update Status</span>
                    <select
                      value={booking.status}
                      onChange={(event) =>
                        handleStatusChange(booking.id, event.target.value as BookingStatus)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-orange-400 focus:ring"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Upload Report PDF</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(event) => handleReportUpload(booking.id, event)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                  </label>
                </div>

                {booking.report ? (
                  <p className="mt-3 text-sm text-emerald-700">Report uploaded: {booking.report.fileName}</p>
                ) : null}
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
