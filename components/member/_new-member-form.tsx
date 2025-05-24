import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import * as Icon from "lucide-react";
import { User } from "@/lib/firebase/model/user";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAddClassMember } from "@/lib/queries/class";

type NewMemberFormProps = {
  currentUser: User;
  onUserCreated: (user: User & { password: string }) => void;
};

export function NewMemberForm({
  currentUser,
  onUserCreated,
}: NewMemberFormProps) {
  const { mutateAsync: addClassMember } = useAddClassMember();

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false, error: "" });

      const formData = new FormData(e.currentTarget);
      formData.set("class_id", currentUser.class_id!);
      const user = await addClassMember({
        class_id: currentUser.class_id!,
        nim: formData.get("nim") as string,
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        role: formData.get("role") as User["role"],
      });

      onUserCreated({
        uid: user.uid,
        name: user.name,
        email: user.email,
        nim: user.nim,
        password: formData.get("password") as string,
        class_id: user.class_id,
        role: user.role,
      });
      setStatus({ loading: false, success: true, error: "" });
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, success: false, error: "" });
    }
  }

  return (
    <form className="mt-4 grid gap-4" onSubmit={handleFormSubmit}>
      <div className="grid grid-cols-4 w-full max-w-sm items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Nama
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Masukan nama lengkap"
          className="col-span-3"
          disabled={status.loading}
          required
        />
      </div>
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
          disabled={status.loading}
          required
        />
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
          disabled={status.loading}
          required
        />
      </div>
      <div className="grid grid-cols-4 w-full max-w-sm items-center gap-4">
        <Label htmlFor="password" className="text-right">
          Kata sandi
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Masukan kata sandi"
          className="col-span-3"
          disabled={status.loading}
          required
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={status.loading}>
          {!status.loading ? (
            <>
              <span>Buat akun</span>
            </>
          ) : (
            <>
              <Icon.Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Membuat akun</span>
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
