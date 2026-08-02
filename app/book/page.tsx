"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { SiteHeader } from "@/app/components/site-header";
import { TEST_PACKAGES, TIME_WINDOWS } from "@/lib/demo-data";
import { AppUser, Booking, TimeWindow } from "@/lib/domain";
import { addBooking, getCurrentUser, setCurrentUser } from "@/lib/storage";

const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
  packageId: z.string().min(1, "Choose a package"),
  addressLine1: z.string().min(6, "Address should be more detailed"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Enter a valid 6-digit pincode"),
  slotDate: z.string().min(1, "Select a date"),
  slotWindow: z.string().min(1, "Select a time window"),
});

export default function BookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPackageId = searchParams.get("packageId") ?? TEST_PACKAGES[0].id;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [packageId, setPackageId] = useState(initialPackageId);
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [slotDate, setSlotDate] = useState("");
  const [slotWindow, setSlotWindow] = useState<string>(TIME_WINDOWS[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return;
    }

    setName(currentUser.name);
    setPhone(currentUser.phone);
  }, []);

  const selectedPackage = useMemo(
    () => TEST_PACKAGES.find((item) => item.id === packageId) ?? TEST_PACKAGES[0],
    [packageId],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = bookingSchema.safeParse({
      name,
      phone,
      packageId,
      addressLine1,
      city,
      pincode,
      slotDate,
      slotWindow,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the details and try again.");
      return;
    }

    const user: AppUser = {
      id: `cus_${crypto.randomUUID()}`,
      name,
      phone,
      role: "customer",
    };

    setCurrentUser(user);

    const now = new Date().toISOString();
    const booking: Booking = {
      id: `bk_${crypto.randomUUID()}`,
      customer: {
        id: user.id,
        name: user.name,
        phone: user.phone,
      },
      testPackageId: selectedPackage.id,
      testPackageName: selectedPackage.name,
      labName: null,
      address: {
        line1: addressLine1,
        city,
        pincode,
      },
      slotDate,
      slotTimeWindow: slotWindow as TimeWindow,
      status: "requested",
      amount: selectedPackage.price,
      platformFee: Math.round(selectedPackage.price * 0.2),
      report: null,
      createdAt: now,
      updatedAt: now,
    };

    addBooking(booking);
    router.push(`/my-bookings?created=${booking.id}`);
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] text-slate-900">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Book at-home sample collection</h1>
        <p className="mt-2 text-sm text-slate-600">
          Phase 1 demo flow: book now, status updates are managed manually by admin.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-medium">Full Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-orange-400 focus:ring"
                placeholder="Enter your name"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">Phone Number</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-orange-400 focus:ring"
                placeholder="10 digit mobile number"
                maxLength={10}
              />
            </label>
          </div>

          <label className="space-y-1 block">
            <span className="text-sm font-medium">Test Package</span>
            <select
              value={packageId}
              onChange={(event) => setPackageId(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-orange-400 focus:ring"
            >
              {TEST_PACKAGES.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - Rs. {pkg.price}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-xl bg-orange-50 p-3 text-sm text-orange-900">
            <p className="font-semibold">Prep instructions</p>
            <p>{selectedPackage.prepInstructions}</p>
          </div>

          <label className="space-y-1 block">
            <span className="text-sm font-medium">Address</span>
            <textarea
              value={addressLine1}
              onChange={(event) => setAddressLine1(event.target.value)}
              className="min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-orange-400 focus:ring"
              placeholder="Flat/House, Area, Landmark"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-medium">City</span>
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-orange-400 focus:ring"
                placeholder="City"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">Pincode</span>
              <input
                value={pincode}
                onChange={(event) => setPincode(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-orange-400 focus:ring"
                placeholder="6 digit pincode"
                maxLength={6}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-medium">Slot Date</span>
              <input
                type="date"
                value={slotDate}
                onChange={(event) => setSlotDate(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-orange-400 focus:ring"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm font-medium">Time Window</span>
              <select
                value={slotWindow}
                onChange={(event) => setSlotWindow(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none ring-orange-400 focus:ring"
              >
                {TIME_WINDOWS.map((window) => (
                  <option key={window} value={window}>
                    {window}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Confirm Booking (Rs. {selectedPackage.price})
          </button>
        </form>
      </main>
    </div>
  );
}
