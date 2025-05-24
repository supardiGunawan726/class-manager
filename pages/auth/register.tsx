import { auth } from "@/lib/firebase/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import { User } from "@/lib/firebase/model/user";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Icon from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AuthLayout from "./_layout";
import { useCreateSessionCookie } from "@/lib/queries/session";
import { useSetUserData } from "@/lib/queries/user";

export default function Page() {
  const router = useRouter();
  const { mutateAsync: createSessionCookie } = useCreateSessionCookie();
  const { mutateAsync: setUserData } = useSetUserData();

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false, error: null });

      const formData = new FormData(e.currentTarget);

      const userCred = await createUserWithEmailAndPassword(
        auth,
        formData.get("email") as string,
        formData.get("password") as string
      );
      const idToken = await userCred.user.getIdToken();
      formData.set("id_token", idToken);
      formData.set("uid", userCred.user.uid);

      await createSessionCookie(idToken);
      await setUserData({
        uid: userCred.user.uid,
        nim: formData.get("nim") as string,
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        role: formData.get("role") as User["role"],
      });

      if (formData.get("role") === "ketua") {
        router.replace(`/class/create`);
      } else {
        router.replace(`/class/join`);
      }

      setStatus({ loading: false, success: true, error: null });
    } catch (error: any) {
      console.error(error);
      setStatus({ loading: false, success: false, error: error.message });
    }
  }

  return (
    <AuthLayout>
      <Card className="max-w-sm mx-auto mt-24">
        <CardHeader className="text-center">
          <Image
            src="/images/logo.png"
            alt="logo"
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
                <SelectTrigger id="role" className="w-full">
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
    </AuthLayout>
  );
}
