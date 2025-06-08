import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import * as Icon from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/lib/firebase/model/user";
import { useCreateDiscussion } from "@/lib/queries/discussion";

type NewDiscussionFormProps = {
  user: User;
  onDataSaved: () => void;
};

export function NewDiscussionForm({
  user,
  onDataSaved,
}: NewDiscussionFormProps) {
  const { mutateAsync: createDiscussion } = useCreateDiscussion();

  const [status, setStatus] = useState({
    loading: false,
    success: false,
  });

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false });

      const formData = new FormData(e.currentTarget);
      await createDiscussion({
        class_id: user.class_id!,
        data: {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
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
      <div className="grid grid-cols-4 w-full gap-4 items-center">
        <Label htmlFor="name" className="text-right">
          Nama forum
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Masukan nama forum diskusi"
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 w-full gap-4">
        <Label htmlFor="description" className="text-right py-2">
          Deskripsi
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Masukan deskripsi singkat mengenai forum"
          className="col-span-3"
          required
        />
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
