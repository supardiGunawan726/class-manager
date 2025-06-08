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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as Icon from "lucide-react";
import {
  useDeleteDocumentation,
  useGetDocumentation,
} from "@/lib/queries/documentations";
import { useGetCurrentUser } from "@/lib/queries/session";
import { useGetUserByUid } from "@/lib/queries/user";
import { DocumentationMedia } from "@/lib/firebase/model/documentation";

type DocumentationDialogProps = {
  documentationId?: string;
  isOpen: boolean;
  handleOpenChange: (isOpen: boolean) => void;
  onClickEdit: () => void;
  onDelete: () => void;
};

export function DocumentationDialog({
  documentationId,
  isOpen,
  handleOpenChange,
  onClickEdit,
  onDelete,
}: DocumentationDialogProps) {
  const { data: user } = useGetCurrentUser();
  const { data: documentation } = useGetDocumentation(
    user?.class_id,
    documentationId
  );
  const { data: author } = useGetUserByUid(documentation?.author);
  const { mutateAsync: deleteDocumentation } = useDeleteDocumentation();

  const [isDeleting, setIsDeleting] = useState(false);
  const [viewedMedia, setViewedMedia] = useState<DocumentationMedia>();

  async function handleDeleteClick() {
    try {
      setIsDeleting(true);

      await deleteDocumentation({
        class_id: author.class_id,
        id: documentation!.id,
      });
      setIsDeleting(false);

      onDelete();
    } catch (error) {
      setIsDeleting(false);
      console.error(error);
    }
  }

  return (
    <>
      <Dialog
        open={typeof viewedMedia !== "undefined"}
        onOpenChange={() => setViewedMedia(undefined)}
      >
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
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-3xl">
          {documentation && author && (
            <>
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
                <Button onClick={onClickEdit} className="cursor-pointer">
                  Edit
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
