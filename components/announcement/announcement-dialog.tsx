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
import * as Icon from "lucide-react";
import { User } from "@/lib/firebase/model/user";
import { Announcement } from "@/lib/firebase/model/announcement";
import { useDeleteAnnouncement } from "@/lib/queries/announcement";
import { useGetCurrentUser } from "@/lib/queries/session";
import { useGetUserByUid } from "@/lib/queries/user";

type AnnouncementDialogProps = {
  announcement: Announcement;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClickEdit: () => void;
};

export function AnnouncementDialog({
  announcement,
  isOpen,
  onOpenChange,
  onClickEdit,
}: AnnouncementDialogProps) {
  const { data: user } = useGetCurrentUser();
  const { data: author } = useGetUserByUid(announcement.author);

  const { mutateAsync: deleteAnnouncement } = useDeleteAnnouncement();

  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteClick() {
    try {
      setIsDeleting(true);

      await deleteAnnouncement({
        class_id: user!.class_id!,
        id: announcement.id,
      });
      onOpenChange(false);

      setIsDeleting(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{announcement.title}</DialogTitle>
          <DialogDescription>
            {author && <span>{author.name}</span>}
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
          <Button onClick={onClickEdit}>Edit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
