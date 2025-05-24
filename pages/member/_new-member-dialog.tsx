import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/lib/firebase/model/user";
import { NewMemberForm } from "./_new-member-form";
import { DialogProps } from "@radix-ui/react-dialog";

type NewMemberDialogProps = DialogProps & {
  user: User;
};

export function NewMemberDialog({ user, ...props }: NewMemberDialogProps) {
  const [status, setStatus] = useState<{
    success: boolean;
    user: (User & { password: string }) | null;
  }>({
    success: false,
    user: null,
  });

  useEffect(() => {
    if (!props.open && status.success) {
      setStatus({
        success: false,
        user: null,
      });
    }
  }, [props.open, status.success]);

  const newUserLoginUrl = status.user
    ? `${window.origin}/auth/login?email=${status.user.email}&password=${status.user.password}`
    : null;

  function handleUserCreated(user: User & { password: string }) {
    setStatus({
      success: true,
      user,
    });
  }

  function handleCopyUserLoginUrl() {
    if (newUserLoginUrl) {
      window.navigator.clipboard.writeText(newUserLoginUrl);
    }
    props.onOpenChange?.(false);
  }

  return (
    <Dialog {...props}>
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
              <Button onClick={() => props.onOpenChange?.(false)}>
                Selesai
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
