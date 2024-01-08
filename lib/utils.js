import { clsx } from "clsx"
import { twMerge } from "tailwind-merge";
import * as dateFns from "date-fns";
import { Timestamp } from "firebase/firestore";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function cleanUndefined(object) {
  return JSON.parse(JSON.stringify(object));
}

export async function requestRevalidatePath(path, type) {
  try {
    await fetch(`/api/revalidate?path=${path}&type=${type}`);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function formatTimestamp(rawTimestamp) {
  const timestamp = new Timestamp(
    rawTimestamp._seconds,
    rawTimestamp._nanoseconds
  );

  const date = timestamp.toDate();
  return dateFns.format(date, "dd-MM-yyyy");
}