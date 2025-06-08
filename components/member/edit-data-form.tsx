import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/lib/firebase/model/user";
import { useSetUserData } from "@/lib/queries/user";
import * as Icon from "lucide-react";
import { FormEvent, useState } from "react";

type EditDataFormProps = {
  user: User;
  onDataSaved: (data: User) => void;
};

export function EditDataForm({ user, onDataSaved }: EditDataFormProps) {
  const { mutateAsync: setUserData } = useSetUserData();

  const [status, setStatus] = useState({
    loading: false,
    success: false,
  });

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false });

      const formData = new FormData(e.currentTarget);
      const data = {
        uid: formData.get("uid") as string,
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        nim: formData.get("nim") as string,
      };

      await setUserData(data);

      onDataSaved(data);
      setStatus({ loading: false, success: true });
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, success: false });
    }
  }

  return (
    <form onSubmit={submitForm} className="mt-4 grid gap-4">
      <div className="grid grid-cols-4 w-full max-w-sm items-center gap-4">
        <input type="hidden" name="uid" value={user.uid} />
        <Label htmlFor="name" className="text-right">
          Nama
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Masukan nama lengkap"
          className="col-span-3"
          defaultValue={user.name}
          disabled={status.loading}
          required
        />
      </div>
      <div className="grid gap-1">
        <div className="grid grid-cols-4 w-full max-w-sm items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Masukan email"
            className="col-span-3"
            defaultValue={user.email}
            disabled={status.loading}
            required
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-start-2 col-span-3 flex gap-1 items-center text-slate-400 text-xs">
            <Icon.Info width={12} height={12} />
            <span>Kamu harus login ulang jika mengubah email</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 w-full max-w-sm items-center gap-4">
        <Label htmlFor="nim" className="text-right">
          NIM
        </Label>
        <Input
          id="nim"
          name="nim"
          type="number"
          placeholder="Masukan NIM"
          className="col-span-3"
          defaultValue={user.nim}
          disabled={status.loading}
          required
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={status.loading}>
          {!status.loading ? (
            <>
              <span>Simpan perubahan</span>
            </>
          ) : (
            <>
              <Icon.Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Menyimpan perubahan</span>
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
