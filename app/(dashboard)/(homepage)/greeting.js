"use client";

import { useAuthContext } from "../auth-provider";

export function Greeting() {
  const user = useAuthContext();

  return (
    <h1 className="font-semibold text-4xl">Selamat datang, {user.name}!</h1>
  );
}
