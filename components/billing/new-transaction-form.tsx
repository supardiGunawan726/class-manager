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
import { DatePicker } from "@/components/date-picker";
import Image from "next/image";
import { User } from "@/lib/firebase/model/user";
import { useCreateTransaction } from "@/lib/queries/transactions";
import { parse } from "date-fns";
import { Timestamp } from "firebase/firestore";

type NewTransactionFormProps = {
  user: User;
  users: User[];
  billingDateInterval: { seconds: number; nanoseconds: number }[];
  billingDate: string;
  onDataSaved: () => void;
};

export function NewTransactionForm({
  user,
  users,
  billingDateInterval,
  billingDate,
  onDataSaved,
}: NewTransactionFormProps) {
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
      formData.set("class_id", user.class_id!);

      const timestampBillingDate = Timestamp.fromDate(
        parse(formData.get("billing_date") as string, "dd-MM-yyyy", new Date())
      );
      const billing_date = {
        seconds: timestampBillingDate.seconds,
        nanoseconds: timestampBillingDate.nanoseconds,
      };

      const dateTimestamp = Timestamp.fromDate(
        new Date(parseInt(formData.get("date") as string))
      );
      const date = {
        seconds: dateTimestamp.seconds,
        nanoseconds: dateTimestamp.nanoseconds,
      };

      await createTransaction({
        class_id: user.class_id!,
        data: {
          user_id: formData.get("user_id") as string,
          billing_date,
          date,
          amount: parseInt(formData.get("amount") as string),
          proof: formData.get("proof") as File,
          verified: true,
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
        <Label htmlFor="user_id" className="text-right">
          Pelaku transaksi
        </Label>
        <Select name="user_id" required>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Pelaku transaksi" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.uid} value={user.uid}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
        <Label htmlFor="date" className="text-right">
          Tanggal transaksi
        </Label>
        <DatePicker id="date" name="date" />
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
