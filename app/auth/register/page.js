"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-config";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as Icon from "lucide-react";
import Image from "next/image";
import { createSessionCookie, saveUserData } from "../actions";

export default function Register() {
  const router = useRouter();

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false, error: null });

      const formData = new FormData(e.target);

      const userCred = await createUserWithEmailAndPassword(
        auth,
        formData.get("email"),
        formData.get("password")
      );
      const idToken = await userCred.user.getIdToken();
      formData.set("id_token", idToken);
      formData.set("uid", userCred.user.uid);

      await createSessionCookie(formData);
      await saveUserData(formData);

      if (formData.get("role") === "ketua") {
        router.replace(`/class/create`);
      } else {
        router.replace(`/class/join`);
      }

      setStatus({ loading: false, success: true, error: null });
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, success: false, error: error.message });
    }
  }

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
        {status.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{status.error}</AlertDescription>
          </Alert>
        )}
        <form className="grid w-full gap-3" onSubmit={handleFormSubmit}>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="name">Nama lengkap</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Masukan nama lengkap"
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Masukan email"
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="nim">NIM</Label>
            <Input
              id="nim"
              name="nim"
              type="number"
              placeholder="Masukan nim"
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="password">Kata sandi</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Masukan kata sandi"
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" required>
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
            <Button disabled={status.loading} className="disabled:opacity-60">
              <div className="relative">
                {status.loading && (
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
