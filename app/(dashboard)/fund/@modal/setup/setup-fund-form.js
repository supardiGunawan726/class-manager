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
import { DatePicker } from "../../../../../components/date-picker";
import { setupFund } from "./actions";
import { BILLING_PERIODS } from "@/lib/utils";

export function SetupFundForm({ user, onDataSaved }) {
  const [status, setStatus] = useState({
    loading: false,
    success: false,
  });

  async function submitForm(e) {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false });

      const formData = new FormData(e.target);
      formData.set("class_id", user.class_id);

      await setupFund(formData);
      onDataSaved();

      setStatus({ loading: false, success: true });
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, success: false });
    }
  }

  return (
    <form className="mt-4 grid gap-4" onSubmit={submitForm}>
      <div className="grid grid-cols-4 w-full gap-4">
        <Label htmlFor="billing_amount" className="text-right py-2.5">
          Nominal pembayaran
        </Label>
        <Input
          id="billing_amount"
          name="billing_amount"
          type="number"
          placeholder="Masukan nominal"
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 w-full items-center gap-4">
        <Label htmlFor="billing_period" className="text-right">
          Periode pembayaran
        </Label>
        <Select name="billing_period">
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Periode" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(BILLING_PERIODS).map((period) => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 w-full items-center gap-4">
        <Label htmlFor="billing_start_date" className="text-right">
          Mulai dari
        </Label>
        <DatePicker id="billing_start_date" name="billing_start_date" />
      </div>
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
