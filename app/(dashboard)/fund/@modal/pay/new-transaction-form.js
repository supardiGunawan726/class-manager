"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import * as Icon from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatTimestamp } from "@/lib/utils";
import Image from "next/image";
import { createTransaction } from "./actions";
import { useSearchParams } from "next/navigation";

export function NewTransactionForm({ user, billingDateInterval, onDataSaved }) {
  const searchParams = useSearchParams();

  const [status, setStatus] = useState({
    loading: false,
    success: false,
  });
  const [preview, setPreview] = useState(false);

  async function submitForm(e) {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false });

      const formData = new FormData(e.target);
      formData.set("class_id", user.class_id);
      formData.set("user_id", user.uid);
      formData.set("date", Date.now());

      await createTransaction(formData);
      onDataSaved();

      setStatus({ loading: false, success: true });
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, success: false });
    }
  }

  function onProofChange(e) {
    const reader = new FileReader();

    reader.onloadend = function (e) {
      setPreview(e.target.result);
    };

    if (e.target.files.length > 0) {
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setPreview(null);
    }
  }

  return (
    <form className="mt-4 grid gap-4" onSubmit={submitForm}>
      <div className="grid grid-cols-4 w-full gap-4 items-center">
        <Label htmlFor="billing_date" className="text-right">
          Tanggal uang kas
        </Label>
        <Select
          name="billing_date"
          defaultValue={searchParams.get("billing_date")}
          required
        >
          <SelectTrigger id="billing_date" className="col-span-3">
            <SelectValue placeholder="Tanggal uang kas" />
          </SelectTrigger>
          <SelectContent>
            {billingDateInterval.map((billingDate) => (
              <SelectItem
                key={formatTimestamp(billingDate)}
                value={formatTimestamp(billingDate)}
              >
                {formatTimestamp(billingDate)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 w-full gap-4 items-center">
        <Label htmlFor="amount" className="text-right">
          Nominal pembayaran
        </Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          placeholder="Masukan nominal"
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 w-full gap-4 items-center">
        <Label htmlFor="proof" className="text-right">
          Bukti pembayaran
        </Label>
        <Input
          id="proof"
          name="proof"
          type="file"
          className="col-span-3"
          onChange={onProofChange}
          required
        />
      </div>
      {preview && (
        <div className="grid grid-cols-4 w-full gap-4">
          <Label className="text-right py-2">Pratinjau</Label>
          <figure className="col-span-3 max-w-xs">
            <Image
              src={preview}
              width={200}
              height={200}
              alt="Proof of payment"
            />
          </figure>
        </div>
      )}
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary" type="button">
            Batal
          </Button>
        </DialogClose>
        <Button type="submit" disabled={status.loading}>
          {!status.loading ? (
            <>
              <span>Simpan</span>
            </>
          ) : (
            <>
              <Icon.Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Menyimpan</span>
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
