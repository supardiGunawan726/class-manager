"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatTimestamp } from "@/lib/utils";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteDocumentation } from "./actions";
import * as Icon from "lucide-react";

export function DocumentationDialog({ author, documentation }) {
  const router = useRouter();
  const path = usePathname();

  const [isDeleting, setIsDeleting] = useState(false);
  const [viewedMedia, setViewedMedia] = useState();

  function handleOpenChange(open) {
    if (open) {
      router.replace(`/documentation/${documentation.id}`);
    } else {
      router.replace("/documentation");
    }
  }

  async function handleDeleteClick() {
    try {
      setIsDeleting(true);

      await deleteDocumentation({
        class_id: author.class_id,
        id: documentation.id,
      });
      router.replace("/documentation");

      setIsDeleting(false);
    } catch (error) {
      setIsDeleting(false);
      console.error(error);
    }
  }

  return (
    <>
      <Dialog open={viewedMedia} onOpenChange={() => setViewedMedia("")}>
        {viewedMedia && (
          <DialogContent>
            <figure className="relative aspect-video mt-4">
              <Image
                src={viewedMedia.url}
                alt="documentation"
                className="object-cover"
                fill
              />
            </figure>
          </DialogContent>
        )}
      </Dialog>
      <Dialog
        onOpenChange={handleOpenChange}
        open={path === `/documentation/${documentation.id}`}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{documentation.title}</DialogTitle>
            <DialogDescription>
              <span>{author.name}</span>
              <span> • </span>
              <span>{formatTimestamp(documentation.published_at)}</span>
            </DialogDescription>
          </DialogHeader>
          <p>{documentation.description}</p>
          <div className="grid grid-cols-3 gap-4">
            {documentation.media.map((mediaItem) => (
              <figure key={mediaItem.url} className="aspect-video relative">
                <Button
                  variant="ghost"
                  className="p-0"
                  onClick={() => setViewedMedia(mediaItem)}
                >
                  <Image
                    src={mediaItem.url}
                    alt="documentation"
                    className="object-cover"
                    fill
                  />
                </Button>
              </figure>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {!isDeleting ? (
                <>
                  <span>Hapus</span>
                </>
              ) : (
                <>
                  <Icon.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Menghapus</span>
                </>
              )}
            </Button>
            <Button asChild>
              <Link href={`/documentation/${documentation.id}/edit`}>Edit</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
