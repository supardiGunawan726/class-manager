import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import * as Icon from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AuthLayout from "./_layout";
import { useCreateSessionCookie } from "@/lib/queries/session";

export default function Page() {
  const router = useRouter();
  const { mutateAsync: createSessionCookie } = useCreateSessionCookie();

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false, error: "" });

      const formData = new FormData(e.currentTarget);

      const userCred = await signInWithEmailAndPassword(
        auth,
        formData.get("email") as string,
        formData.get("password") as string
      );
      const idToken = await userCred.user.getIdToken(true);
      await createSessionCookie(idToken);

      setStatus({ loading: false, success: true, error: "" });

      router.replace("/");
    } catch (err: any) {
      console.dir(err);

      let error;
      if (err.code === "auth/user-not-found") {
        error = "Email belum terdaftar";
      } else if (err.code === "auth/wrong-password") {
        error = "Password tidak benar";
      } else if (err.code === "auth/missing-password") {
        error = "Password tidak boleh kosong";
      } else if (err.code === "auth/invalid-credential") {
        error = "Email atau password salah";
      } else if (err.code === "auth/invalid-email") {
        error = "Email tidak valid";
      } else {
        error = "Terjadi kesalahan, mohon coba kembali";
      }
      setStatus({ loading: false, success: false, error });
    }
  }

  return (
    <AuthLayout>
      <Card className="max-w-sm mx-auto mt-24">
        <CardHeader className="text-center">
          <Image
            src="/images/logo.png"
            width={300}
            height={94}
            alt="Class Manager logo"
            className="mx-auto"
          />
          <CardTitle>Masuk</CardTitle>
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Masukan email"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="password">Kata sandi</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Masukan kata sandi"
              />
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
                  <span>Masuk</span>
                </div>
              </Button>
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
    </AuthLayout>
  );
}
