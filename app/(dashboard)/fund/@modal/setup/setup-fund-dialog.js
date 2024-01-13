"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { SetupFundForm } from "./setup-fund-form";
import { useToast } from "@/components/ui/use-toast";

export function SetupFundDialog({ user }) {
  const router = useRouter();
  const path = usePathname();

  const { toast } = useToast();

  function handleOpenChange(open) {
    if (open) {
      router.replace(`/fund/setup`);
    } else {
      router.replace("/fund");
    }
  }

  function handleDataSaved() {
    toast({
      title: "Fitur uang kas berhasil disiapkan",
    });
    router.replace("/fund");
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={path === "/fund/setup"}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Persiapkan uang kas</DialogTitle>
          <DialogDescription>
            Mohon masukan informasi mengenai pengumpulan uang kas kelas kamu
          </DialogDescription>
        </DialogHeader>
        <SetupFundForm user={user} onDataSaved={handleDataSaved} />
      </DialogContent>
    </Dialog>
  );
}
