import { clsx } from "clsx"
import { twMerge } from "tailwind-merge";
import * as dateFns from "date-fns";
import { Timestamp } from "firebase/firestore";

export const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

export const BILLING_PERIODS = {
  DAILY: {
    value: "daily",
    label: "Setiap hari",
  },
  WEEKLY: {
    value: "weekly",
    label: "Setiap minggu",
  },
  FORTNIGHTLY: {
    value: "fortnightly",
    label: "Setiap dua minggu",
  },
  MONTHLY: {
    value: "monthly",
    label: "Setiap bulan",
  },
};

export const BILLING_STATUS = {
  PAID: {
    value: "paid",
    label: "Lunas",
  },
  UNPAID: {
    value: "unpaid",
    label: "Belum membayar",
  },
  PARTIAL: {
    value: "partial",
    label: "Belum lunas",
  },
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function cleanUndefined(object) {
  return JSON.parse(JSON.stringify(object));
}

export function formatTimestamp(rawTimestamp, format = "dd-MM-yyyy") {
  const timestamp = new Timestamp(
    rawTimestamp._seconds,
    rawTimestamp._nanoseconds
  );

  const date = timestamp.toDate();
  return dateFns.format(date, format);
}

export function parseDate(dateStr, format = "dd-MM-yyyy") {
  return dateFns.parse(dateStr, format, new Date());
}

export function shuffleArray(arraySrc) {
  const array = [...arraySrc];

  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}