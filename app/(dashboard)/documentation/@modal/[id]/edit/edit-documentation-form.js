"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import * as Icon from "lucide-react";
import {} from "./actions";
import Image from "next/image";
import { FileDropzone } from "./file-dropzone";
import { updateDocumentation } from "./actions";

export function EditDocumentationForm({ user, documentation, onDataSaved }) {
  const [status, setStatus] = useState({
    loading: false,
    success: false,
  });

  const [selectedMedia, setSelectedMedia] = useState(documentation.media);

  function handleFileDrop(files) {
    for (const file of files) {
      const reader = new FileReader();
      reader.onloadend = function (e) {
        setSelectedMedia(function (previousSelectedMedia) {
          const droppedMedia = {
            preview: e.target.result,
            type: file.type,
            filename: file.name,
            file: file,
          };

          const isExist = !!previousSelectedMedia.find(
            (previousSelectedMediaItem) =>
              previousSelectedMediaItem.preview === droppedMedia.preview
          );

          if (isExist) {
            return previousSelectedMedia;
          }

          return [droppedMedia, ...previousSelectedMedia];
        });
      };

      reader.readAsDataURL(file);
    }
  }

  function handleClickDeleteSelectedMedia(mediaItem) {
    return () => {
      setSelectedMedia(function (prev) {
        return prev.filter(
          (previousMediaItem) => previousMediaItem !== mediaItem
        );
      });
    };
  }

  async function submitForm(e) {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false });

      const formData = new FormData(e.target);
      formData.set("id", documentation.id);
      formData.set("class_id", user.class_id);

      for (const media of selectedMedia) {
        // new file to be uploaded
        if (typeof media.preview === "string" && media.file instanceof File) {
          formData.append("new_media_file", media.file);
        }
      }

      for (const media of documentation.media) {
        if (
          selectedMedia.find(
            (selectedMediaItem) =>
              typeof selectedMediaItem.url === "string" &&
              selectedMediaItem.filename === media.filename
          )
        ) {
          continue;
        }

        formData.append("remove_media_filename", media.filename);
      }

      await updateDocumentation(formData);

      onDataSaved();

      setStatus({ loading: false, success: true });
    } catch (error) {
      setStatus({ loading: false, success: false });
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
          defaultValue={documentation.title}
          required
        />
      </div>
      <div className="grid grid-cols-6 w-full gap-4">
        <Label htmlFor="description" className="text-right py-2.5">
          Deskripsi
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Masukan deskripsi"
          className="col-span-3"
          defaultValue={documentation.description}
          required
        />
      </div>
      <div className="grid grid-cols-6 w-full gap-4">
        <Label htmlFor="media" className="text-right py-2.5">
          Media
        </Label>
        <div className="col-span-5 grid grid-cols-3 gap-4">
          <FileDropzone
            onDrop={handleFileDrop}
            accept="video/mp4,video/x-m4v,video/*,image/*"
            multiple
          >
            <div className="aspect-video bg-slate-200 h-full grid place-items-center text-slate-500">
              <Icon.Plus width={32} height={32} />
            </div>
          </FileDropzone>
          {selectedMedia.map((mediaItem) => (
            <figure
              key={mediaItem.url || mediaItem.preview}
              className="relative aspect-video"
            >
              <Image
                src={mediaItem.url || mediaItem.preview}
                className="object-cover"
                alt={`documentation of ${documentation.title}`}
                fill
              />
              <Button
                type="button"
                variant="ghost"
                className="w-full h-full absolute top-0 bottom-0 left-0 right-0 transition-opacity bg-red-500/20 text-red-500 opacity-0 hover:text-red-500 hover:bg-red-500/20 hover:opacity-100"
                onClick={handleClickDeleteSelectedMedia(mediaItem)}
              >
                <Icon.Trash />
              </Button>
            </figure>
          ))}
        </div>
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
