"use client";

import {
  AppUser,
  Booking,
  BookingStatus,
  ReportAsset,
  canTransitionBookingStatus,
} from "@/lib/domain";

const BOOKING_KEY = "sevaSetu.bookings";
const USER_KEY = "sevaSetu.currentUser";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getCurrentUser(): AppUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  return safeParse<AppUser | null>(window.localStorage.getItem(USER_KEY), null);
}

export function setCurrentUser(user: AppUser): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getBookings(): Booking[] {
  if (typeof window === "undefined") {
    return [];
  }

  return safeParse<Booking[]>(window.localStorage.getItem(BOOKING_KEY), []);
}

function saveBookings(bookings: Booking[]): void {
  window.localStorage.setItem(BOOKING_KEY, JSON.stringify(bookings));
}

export function addBooking(booking: Booking): void {
  if (typeof window === "undefined") {
    return;
  }

  const bookings = getBookings();
  bookings.unshift(booking);
  saveBookings(bookings);
}

export function getBookingsByPhone(phone: string): Booking[] {
  const normalizedPhone = phone.trim();
  return getBookings().filter((booking) => booking.customer.phone === normalizedPhone);
}

export function updateBookingStatus(bookingId: string, nextStatus: BookingStatus): Booking {
  const bookings = getBookings();
  const bookingIndex = bookings.findIndex((booking) => booking.id === bookingId);

  if (bookingIndex < 0) {
    throw new Error("Booking not found");
  }

  const existingBooking = bookings[bookingIndex];
  if (!canTransitionBookingStatus(existingBooking.status, nextStatus)) {
    throw new Error(`Invalid status transition: ${existingBooking.status} -> ${nextStatus}`);
  }

  const updatedBooking: Booking = {
    ...existingBooking,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };

  bookings[bookingIndex] = updatedBooking;
  saveBookings(bookings);

  return updatedBooking;
}

export function assignLab(bookingId: string, labName: string): Booking {
  const bookings = getBookings();
  const bookingIndex = bookings.findIndex((booking) => booking.id === bookingId);

  if (bookingIndex < 0) {
    throw new Error("Booking not found");
  }

  const updatedBooking: Booking = {
    ...bookings[bookingIndex],
    labName: labName.trim() || null,
    updatedAt: new Date().toISOString(),
  };

  bookings[bookingIndex] = updatedBooking;
  saveBookings(bookings);

  return updatedBooking;
}

export function attachReportToBooking(bookingId: string, report: ReportAsset): Booking {
  const bookings = getBookings();
  const bookingIndex = bookings.findIndex((booking) => booking.id === bookingId);

  if (bookingIndex < 0) {
    throw new Error("Booking not found");
  }

  const updatedBooking: Booking = {
    ...bookings[bookingIndex],
    report,
    updatedAt: new Date().toISOString(),
  };

  bookings[bookingIndex] = updatedBooking;
  saveBookings(bookings);

  return updatedBooking;
}
