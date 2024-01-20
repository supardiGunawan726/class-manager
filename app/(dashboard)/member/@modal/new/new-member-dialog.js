"use client";

import {
  Dialog,
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
import { useRouter, usePathname } from "next/navigation";

export function NewMemberDialog({ user }) {
  const router = useRouter();
  const path = usePathname();

  const [status, setStatus] = useState({
    success: false,
    user: null,
  });

  const newUserLoginUrl = status.user
    ? `${window.origin}/auth/login?email=${status.user.email}&password=${status.user.password}`
    : null;

  function handleOpenChange(open) {
    if (open) {
      router.replace("/member/new");
    } else {
      router.replace("/member");
    }
  }

  function handleUserCreated(user) {
    setStatus({
      success: true,
      user,
    });
  }

  function handleCopyUserLoginUrl() {
    window.navigator.clipboard.writeText(newUserLoginUrl);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={path === "/member/new"}>
      <DialogContent className="sm:max-w-[425px]">
        {!status.success && (
          <>
            <DialogHeader>
              <DialogTitle>Buat akun mahasiswa</DialogTitle>
              <DialogDescription>
                Mohon masukan data mahasiswa yang akan ditambahkan dengan benar
              </DialogDescription>
            </DialogHeader>
            <NewMemberForm
              currentUser={user}
              onUserCreated={handleUserCreated}
            />
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
            {newUserLoginUrl && (
              <div className="grid gap-1">
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={handleCopyUserLoginUrl}>
                    Salin
                  </Button>
                  <Input type="text" value={newUserLoginUrl} readOnly />
                </div>
                <p className="text-xs text-red-500">
                  Jangan bagikan url pada pihak yang tidak dapat dipercaya!
                </p>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => router.replace("/member")}>Selesai</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
