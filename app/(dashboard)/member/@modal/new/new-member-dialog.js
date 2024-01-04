"use client";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewMemberForm } from "./new-member-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function NewMemberDialog() {
  const router = useRouter();

  const [status, setStatus] = useState({
    success: false,
    user: null,
  });

  function handleUserCreated(user) {
    setStatus({
      success: true,
      user,
    });
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      {!status.success && (
        <>
          <DialogHeader>
            <DialogTitle>Buat akun mahasiswa</DialogTitle>
            <DialogDescription>
              Mohon masukan data mahasiswa yang akan ditambahkan dengan benar
            </DialogDescription>
          </DialogHeader>
          <NewMemberForm onUserCreated={handleUserCreated} />
        </>
      )}
      {status.success && status.user && (
        <>
          <DialogHeader>
            <DialogTitle>Pembuatan akun berhasil</DialogTitle>
            <DialogDescription>
              Salin url dibawah lalu berikan kepada pemilik akun untuk proses
              login yang lebih mudah
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-1">
            <div className="flex gap-2">
              <Button variant="secondary">Salin</Button>
              <Input
                type="text"
                value={`${window.origin}/auth/login?email=${status.user.email}&password=${status.user.password}`}
                readOnly
              />
            </div>
            <p className="text-xs text-red-500">
              Jangan bagikan url pada pihak yang tidak dapat dipercaya!
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => router.replace("/member")}>Selesai</Button>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  );
}
