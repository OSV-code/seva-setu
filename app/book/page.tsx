import { Suspense } from "react";
import { BookClient } from "./book-client";

interface BookPageProps {
  searchParams?: Promise<{ packageId?: string }>;
}

export default async function BookPage({ searchParams }: BookPageProps) {
  const params = (await searchParams) ?? {};
  const initialPackageId = params.packageId ?? "cbc";

  return (
    <Suspense fallback={<div className="p-10 text-sm text-slate-600">Loading booking form...</div>}>
      <BookClient initialPackageId={initialPackageId} />
    </Suspense>
  );
}
