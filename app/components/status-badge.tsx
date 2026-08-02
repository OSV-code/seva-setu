import { BookingStatus, bookingStatusColor, bookingStatusLabel } from "@/lib/domain";

interface StatusBadgeProps {
  status: BookingStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${bookingStatusColor(status)}`}
    >
      {bookingStatusLabel(status)}
    </span>
  );
}
