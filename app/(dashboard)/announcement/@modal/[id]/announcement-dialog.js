"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatTimestamp } from "@/lib/utils";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { deleteAnnouncement } from "./actions";
import * as Icon from "lucide-react";

export function AnnouncementDialog({ user, author, announcement }) {
  const router = useRouter();
  const path = usePathname();

  const [isDeleting, setIsDeleting] = useState(false);

  function handleOpenChange(open) {
    if (open) {
      router.replace(`/announcement/${announcement.id}`);
    } else {
      router.replace("/announcement");
    }
  }

  async function handleDeleteClick() {
    try {
      setIsDeleting(true);

      await deleteAnnouncement({
        class_id: user.class_id,
        id: announcement.id,
      });
      router.replace("/announcement");

      setIsDeleting(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog
      onOpenChange={handleOpenChange}
      open={path === `/announcement/${announcement.id}`}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{announcement.title}</DialogTitle>
          <DialogDescription>
            <span>{author.name}</span>
            <span> • </span>
            <span>{formatTimestamp(announcement.published_at)}</span>
          </DialogDescription>
        </DialogHeader>
        <p>{announcement.content}</p>
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
            <Link href={`/announcement/${announcement.id}/edit`}>Edit</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
