import { cn, formatTimestamp } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Announcement } from "@/lib/firebase/model/announcement";
import { Button, buttonVariants } from "../ui/button";
import { useState } from "react";
import { AnnouncementDialog } from "./announcement-dialog";
import { EditAnnouncementDialog } from "./edit-announcement-dialog";

type AnnouncementCardProps = {
  announcement: Announcement;
};

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] =
    useState(false);
  const [isEditAnnouncementDialogOpen, setIsEditAnnouncementDialogOpen] =
    useState(false);

  return (
    <>
      <AnnouncementDialog
        announcement={announcement}
        isOpen={isAnnouncementDialogOpen}
        onOpenChange={setIsAnnouncementDialogOpen}
        onClickEdit={() => {
          setIsAnnouncementDialogOpen(false);
          setIsEditAnnouncementDialogOpen(true);
        }}
      />
      <EditAnnouncementDialog
        announcement={announcement}
        isOpen={isEditAnnouncementDialogOpen}
        onOpenChange={setIsEditAnnouncementDialogOpen}
      />
      <Card className="grid gap-1 py-0" key={announcement.id}>
        <CardContent className="p-4">
          <span className="text-xs text-slate-500">
            {formatTimestamp(announcement.published_at)}
          </span>
          <CardTitle className="text-lg mt-1.5 leading-tight p-0">
            <Button
              className={cn(
                buttonVariants({
                  variant: "link",
                  className:
                    "cursor-pointer text-inherit bg-transparent p-0 hover:bg-transparent",
                })
              )}
              onClick={() => setIsAnnouncementDialogOpen(true)}
            >
              {announcement.title}
            </Button>
          </CardTitle>
          <CardDescription className="text-sm text-slate-900 mt-1">
            {announcement.content}
          </CardDescription>
        </CardContent>
      </Card>
    </>
  );
}
