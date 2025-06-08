"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import * as Icon from "lucide-react";
import { useGetUserByUid } from "@/lib/queries/user";
import { Announcement } from "@/lib/firebase/model/announcement";
import { useUpdateAnnouncement } from "@/lib/queries/announcement";

type EditAnnouncementFormProps = {
  announcement: Announcement;
  onDataSaved: () => void;
};

export function EditAnnouncementForm({
  announcement,
  onDataSaved,
}: EditAnnouncementFormProps) {
  const { data: author } = useGetUserByUid(announcement.author);
  const { mutateAsync: updateAnnouncement } = useUpdateAnnouncement();

  const [status, setStatus] = useState({
    loading: false,
    success: false,
  });

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false });

      const formData = new FormData(e.currentTarget);

      await updateAnnouncement({
        class_id: author!.class_id!,
        id: announcement.id,
        data: {
          title: formData.get("title") as string,
          content: formData.get("content") as string,
        },
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
          defaultValue={announcement.title}
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
          defaultValue={announcement.content}
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
