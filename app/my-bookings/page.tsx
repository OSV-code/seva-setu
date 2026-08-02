import { Suspense } from "react";
import { MyBookingsClient } from "./my-bookings-client";

interface MyBookingsPageProps {
  searchParams?: Promise<{ created?: string }>;
}

export default async function MyBookingsPage({ searchParams }: MyBookingsPageProps) {
  const params = (await searchParams) ?? {};

  return (
    <Suspense fallback={<div className="p-10 text-sm text-slate-600">Loading bookings...</div>}>
      <MyBookingsClient createdBookingId={params.created ?? null} />
    </Suspense>
  );
}
