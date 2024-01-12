"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Fragment, useState } from "react";
import * as Icon from "lucide-react";
import { uploadMedia } from "./actions";
import Image from "next/image";

export function NewDocumentationForm({ user, onDataSaved }) {
  const [status, setStatus] = useState({
    loading: false,
    success: false,
  });

  const [previews, setPreviews] = useState([]);

  async function submitForm(e) {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false });

      const formData = new FormData(e.target);
      formData.append("author", user.uid);
      formData.append("class_id", user.class_id);

      await uploadMedia(formData);
      onDataSaved();

      setStatus({ loading: false, success: true });
    } catch (error) {
      setStatus({ loading: false, success: false });
    }
  }

  async function onFilesChange(e) {
    setPreviews([]);

    const files = e.target.files;

    for (const file of files) {
      const reader = new FileReader();
      reader.onloadend = function (e) {
        setPreviews((prev) => [...prev, e.target.result]);
      };

      reader.readAsDataURL(file);
    }
  }

  return (
    <form className="mt-4 grid gap-4" onSubmit={submitForm}>
      <div className="grid grid-cols-6 w-full items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Nama
        </Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Masukan judul"
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-6 w-full gap-4">
        <Label htmlFor="description" className="text-right py-2.5">
          Isi
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Masukan deskripsi"
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-6 w-full gap-4 items-center">
        <Label htmlFor="media" className="text-right">
          Media
        </Label>
        <Input
          id="media"
          name="media"
          type="file"
          className="col-span-3"
          accept="video/mp4,video/x-m4v,video/*,image/*"
          onChange={onFilesChange}
          multiple
          required
        />
      </div>
      {previews.length > 0 && (
        <div className="grid grid-cols-6 w-full gap-4">
          <Label htmlFor="media" className="text-right py-2.5">
            Pratinjau
          </Label>
          <div className="col-span-5 grid grid-cols-3 gap-4">
            {previews.map((preview) => (
              <Fragment key={preview}>
                {preview.startsWith("data:image") && (
                  <figure className="aspect-video relative">
                    <Image
                      src={preview}
                      alt="preview"
                      className="object-cover"
                      fill
                    />
                  </figure>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      )}
      <DialogFooter>
        <Button type="submit" disabled={status.loading}>
          {!status.loading ? (
            <>
              <span>Buat dokumentasi</span>
            </>
          ) : (
            <>
              <Icon.Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Membuat dokumentasi</span>
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
