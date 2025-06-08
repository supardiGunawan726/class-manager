import { auth } from "@/lib/firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";

export default function AuthLayout({ children }: { children: ReactElement }) {
  const router = useRouter();

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          router.replace("/");
        }
      }),
    []
  );

  return <>{children}</>;
}
