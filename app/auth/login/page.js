"use client";

import {
  onAuthStateChanged,
  getIdToken,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/firebase-config";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  async function handleInputChange(e) {
    const { id, value } = e.target;

    setValues((prev) => ({ ...prev, [id]: value }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, values.email, values.password);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, function (user) {
      if (!user) return;

      getIdToken(user, true).then(function (idToken) {
        fetch("/api/auth/login", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }).then((response) => {
          if (response.status === 200) {
            router.replace("/");
          }
        });
      });
    });

    return unsubscribe;
  }, []);

  return (
    <Card className="max-w-sm mx-auto mt-24">
      <CardHeader className="text-center">
        <CardTitle>Class Manager</CardTitle>
        <CardDescription>Masuk</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid w-full gap-3" onSubmit={handleFormSubmit}>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukan email"
              value={values.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="password">Kata sandi</Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukan kata sandi"
              value={values.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2 mt-4">
            <Button>Masuk</Button>
            <Link
              href="/auth/register"
              className={buttonVariants({ variant: "outline" })}
            >
              Belum punya akun? Buat akun
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
