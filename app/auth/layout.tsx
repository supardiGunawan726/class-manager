"use client";

import { onAuthStateChanged } from "firebase/auth";
import { ReactNode, useEffect } from "react";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          router.replace("/");
        }
      }),
    [router],
  );

  return children;
}
