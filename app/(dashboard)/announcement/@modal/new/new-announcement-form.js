"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createAnnouncement } from "./actions";
import * as Icon from "lucide-react";

export function NewAnnouncementForm({ user, onDataSaved }) {
  const [status, setStatus] = useState({
    loading: false,
    success: false,
  });

  async function submitForm(e) {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false });

      const formData = new FormData(e.target);
      const data = {
        class_id: user.class_id,
        author: user.uid,
        title: formData.get("title"),
        content: formData.get("content"),
      };

      await createAnnouncement(data);
      onDataSaved(data);

      setStatus({ loading: false, success: true });
    } catch (error) {
      setStatus({ loading: false, success: false });
    }
  }

  return (
    <form className="mt-4 grid gap-4" onSubmit={submitForm}>
      <div className="grid grid-cols-4 w-full max-w-sm items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Judul
        </Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Masukan nama lengkap"
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 w-full max-w-sm gap-4">
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
