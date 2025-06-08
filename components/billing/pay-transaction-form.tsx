import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useState } from "react";
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
import { User } from "@/lib/firebase/model/user";
import { useCreateTransaction } from "@/lib/queries/transactions";
import { Timestamp } from "firebase/firestore";
import { parse } from "date-fns";

type PayTransactionFormProps = {
  user: User;
  billingDateInterval: { seconds: number; nanoseconds: number }[];
  billingDate: string;
  onDataSaved: () => void;
};

export function PayTransactionForm({
  user,
  billingDateInterval,
  billingDate,
  onDataSaved,
}: PayTransactionFormProps) {
  const { mutateAsync: createTransaction } = useCreateTransaction();

  const [status, setStatus] = useState({
    loading: false,
    success: false,
  });
  const [preview, setPreview] = useState<string>();

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false });

      const formData = new FormData(e.currentTarget);

      const timestampBillingDate = Timestamp.fromDate(
        parse(formData.get("billing_date") as string, "dd-MM-yyyy", new Date())
      );
      const billing_date = {
        seconds: timestampBillingDate.seconds,
        nanoseconds: timestampBillingDate.nanoseconds,
      };

      const dateTimestamp = Timestamp.now();
      const date = {
        seconds: dateTimestamp.seconds,
        nanoseconds: dateTimestamp.nanoseconds,
      };

      await createTransaction({
        class_id: user.class_id!,
        data: {
          user_id: user.uid,
          billing_date,
          date,
          amount: parseInt(formData.get("amount") as string),
          proof: formData.get("proof") as File,
          verified: false,
        },
      });
      onDataSaved();

      setStatus({ loading: false, success: true });
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, success: false });
    }
  }

  function onProofChange(e: ChangeEvent<HTMLInputElement>) {
    const reader = new FileReader();

    reader.onloadend = function (e) {
      setPreview(e.target?.result as string);
    };

    if (e.target && e.target.files && e.target.files.length > 0) {
      reader.readAsDataURL(e.target?.files[0]);
    } else {
      setPreview("");
    }
  }

  return (
    <form className="mt-4 grid gap-4" onSubmit={submitForm}>
      <div className="grid grid-cols-4 w-full gap-4 items-center">
        <Label htmlFor="billing_date" className="text-right">
          Tanggal uang kas
        </Label>
        <Select name="billing_date" defaultValue={billingDate} required>
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
