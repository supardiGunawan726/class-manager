import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import * as Icon from "lucide-react";
import { User } from "@/lib/firebase/model/user";
import { useCreateAnnouncement } from "@/lib/queries/announcement";

type NewAnnouncementFormProps = {
  user: User;
  onDataSaved: () => void;
};

export function NewAnnouncementForm({
  user,
  onDataSaved,
}: NewAnnouncementFormProps) {
  const { mutateAsync: createAnnouncement } = useCreateAnnouncement();

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
        class_id: user.class_id,
        author: user.uid,
        title: formData.get("title") as string,
        content: formData.get("content") as string,
      };

      await createAnnouncement({
        class_id: user.class_id!,
        data,
      });
      onDataSaved();

      setStatus({ loading: false, success: true });
    } catch (error) {
      setStatus({ loading: false, success: false });
    }
  }

  return (
    <form className="mt-4 grid gap-4" onSubmit={submitForm}>
      <div className="grid grid-cols-4 w-full items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Judul
        </Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Masukan judul pengumuman"
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 w-full gap-4">
        <Label htmlFor="content" className="text-right py-2.5">
          Isi
        </Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Masukan isi dari pengumuman"
          className="col-span-3"
          required
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={status.loading}>
          {!status.loading ? (
            <>
              <span>Buat pengumuman</span>
            </>
          ) : (
            <>
              <Icon.Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Membuat pengumuman</span>
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
