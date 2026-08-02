export const BOOKING_STATUSES = [
  "requested",
  "confirmed",
  "technician_assigned",
  "sample_collected",
  "processing",
  "report_ready",
  "cancelled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type UserRole = "customer" | "lab_partner" | "admin";

export type SampleType = "blood" | "urine" | "swab";

export type TimeWindow = "7:00-9:00" | "9:00-11:00" | "11:00-13:00" | "16:00-18:00";

export interface TestPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  sampleType: SampleType;
  prepInstructions: string;
}

export interface AppUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
}

export interface BookingAddress {
  line1: string;
  city: string;
  pincode: string;
}

export interface ReportAsset {
  id: string;
  fileName: string;
  dataUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Booking {
  id: string;
  customer: Pick<AppUser, "id" | "name" | "phone">;
  testPackageId: string;
  testPackageName: string;
  labName: string | null;
  address: BookingAddress;
  slotDate: string;
  slotTimeWindow: TimeWindow;
  status: BookingStatus;
  amount: number;
  platformFee: number;
  report: ReportAsset | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_TRANSITIONS: Record<BookingStatus, readonly BookingStatus[]> = {
  requested: ["confirmed", "cancelled"],
  confirmed: ["technician_assigned", "cancelled"],
  technician_assigned: ["sample_collected", "cancelled"],
  sample_collected: ["processing", "cancelled"],
  processing: ["report_ready", "cancelled"],
  report_ready: [],
  cancelled: [],
};

export function getNextStatuses(currentStatus: BookingStatus): readonly BookingStatus[] {
  return STATUS_TRANSITIONS[currentStatus];
}

export function canTransitionBookingStatus(
  currentStatus: BookingStatus,
  nextStatus: BookingStatus,
): boolean {
  return STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
}

export function bookingStatusLabel(status: BookingStatus): string {
  return status
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function bookingStatusColor(status: BookingStatus): string {
  switch (status) {
    case "requested":
      return "bg-slate-100 text-slate-700";
    case "confirmed":
      return "bg-blue-100 text-blue-700";
    case "technician_assigned":
      return "bg-indigo-100 text-indigo-700";
    case "sample_collected":
      return "bg-amber-100 text-amber-700";
    case "processing":
      return "bg-orange-100 text-orange-700";
    case "report_ready":
      return "bg-emerald-100 text-emerald-700";
    case "cancelled":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}
