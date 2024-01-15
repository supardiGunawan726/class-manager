"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-config";
import { useRouter } from "next/navigation";
import { setUserData } from "@/lib/firebase/db/user";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as Icon from "lucide-react";
import Image from "next/image";

export default function Register() {
  const router = useRouter();
  const [values, setValues] = useState({
    fullname: "",
    email: "",
    nim: "",
    password: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  function handleInputChange(e) {
    const { id, value } = e.target;

    setValues((prev) => ({ ...prev, [id]: value }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      setError(null);
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan, mohon coba kembali");
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async function (user) {
      if (!user) return;

      const idToken = await getIdToken(user, true);
      await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      await fetch("/api/auth/custom-claims", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: values.role,
        }),
      });
      await setUserData(user.uid, {
        name: values.fullname,
        nim: parseInt(values.nim, 10),
      });
      const idTokenResult = await user.getIdTokenResult(true);
      if (idTokenResult.claims.role === "ketua") {
        router.push(`/class/create?uid=${user.uid}`);
      } else {
        router.push(`/class/join?uid=${user.uid}`);
      }
    });

    return unsubscribe;
  }, [values]);

  return (
    <Card className="max-w-sm mx-auto mt-24">
      <CardHeader className="text-center">
        <Image
          src="/images/logo.png"
          width={300}
          height={94}
          className="mx-auto"
        />
        <CardTitle>Daftar</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form className="grid w-full gap-3" onSubmit={handleFormSubmit}>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="fullname">Nama lengkap</Label>
            <Input
              id="fullname"
              type="text"
              placeholder="Masukan nama lengkap"
              value={values.fullname}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukan email"
              value={values.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="nim">NIM</Label>
            <Input
              id="nim"
              type="number"
              placeholder="Masukan nim"
              value={values.nim}
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
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="role">Jabatan</Label>
            <Select
              onValueChange={(value) =>
                handleInputChange({ target: { value, id: "role" } })
              }
              required
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ketua">Ketua kelas</SelectItem>
                <SelectItem value="anggota">Anggota kelas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full max-w-sm items-center gap-2 mt-4">
            <Button disabled={isLoading} className="disabled:opacity-60">
              <div className="relative">
                {isLoading && (
                  <span className="block mr-1 absolute translate-x-[calc(-100%-4px)]">
                    <Icon.Loader2
                      className="animate-spin"
                      width={18}
                      height={18}
                    />
                  </span>
                )}
                <span>Daftar</span>
              </div>
            </Button>
            <Link
              href="/auth/login"
              className={buttonVariants({ variant: "outline" })}
            >
              Sudah punya akun? Masuk
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
