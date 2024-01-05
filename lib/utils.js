import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
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