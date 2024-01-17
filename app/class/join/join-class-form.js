"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as Icon from "lucide-react";
import Image from "next/image";
import { joinClass } from "../actions";

export function JoinClassForm({ user }) {
  const [status, setStatus] = useState({
    loading: false,
    done: false,
    error: null,
  });

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      setStatus({ loading: true, done: false, error: null });

      const formData = new FormData(e.target);
      formData.set("uid", user.uid);

      await joinClass(formData);

      setStatus({ loading: false, done: true, error: null });
    } catch (error) {
      console.error(error);
      setStatus({
        loading: false,
        done: false,
        error: "Terjadi kesalahan, mohon coba kembali",
      });
    }
  }

  if (status.done) {
    return (
      <Card className="max-w-sm mx-auto mt-24">
        <CardHeader className="text-center">
          <Image
            src="/images/logo.png"
            width={300}
            height={94}
            className="mx-auto"
          />
          <CardTitle>Permintaan gabung sudah terkirim!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
            Mohon tunggu ketua kelas anda untuk menerima permintaan bergabung
            anda.
          </p>
        </CardContent>
      </Card>
    );
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
        <CardDescription>Gabung kelas</CardDescription>
      </CardHeader>
      <CardContent>
        {status.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form className="grid w-full gap-3" onSubmit={handleFormSubmit}>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="class_id">ID kelas</Label>
            <Input
              id="class_id"
              name="class_id"
              type="text"
              placeholder="ID kelas"
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
                <span>Gabung</span>
              </div>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
