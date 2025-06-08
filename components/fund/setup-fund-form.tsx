import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import * as Icon from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/lib/firebase/model/user";
import { BILLING_PERIODS, Fund } from "@/lib/firebase/model/fund";
import { DatePicker } from "../date-picker";
import { useSetFund } from "@/lib/queries/fund";
import { Timestamp } from "firebase/firestore";

type SetupFundFormProps = {
  user: User;
  onDataSaved: () => void;
};

export function SetupFundForm({ user, onDataSaved }: SetupFundFormProps) {
  const { mutateAsync: setFund } = useSetFund();

  const [status, setStatus] = useState({
    loading: false,
    success: false,
  });

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false });

      const formData = new FormData(e.currentTarget);
      formData.set("class_id", user.class_id!);

      const billingStartDateTimestamp = Timestamp.fromDate(
        new Date(parseInt(formData.get("billing_start_date") as string))
      );
      const billingStartDate = {
        seconds: billingStartDateTimestamp.seconds,
        nanoseconds: billingStartDateTimestamp.nanoseconds,
      };
      await setFund({
        class_id: user.class_id!,
        data: {
          billing_amount: parseInt(formData.get("billing_amount") as string),
          billing_period: formData.get(
            "billing_period"
          ) as Fund["billing_period"],
          billing_start_date: billingStartDate,
          total_funding: 0,
        },
      });
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
