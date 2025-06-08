import { Button } from "@/components/ui/button";
import * as Icon from "lucide-react";
import { User } from "@/lib/firebase/model/user";
import { useGetCurrentUser } from "@/lib/queries/session";
import { EditDataDialog } from "./edit-data-dialog";
import { useState } from "react";

type MemberToolbarProps = {
  user: User;
};

export function MemberToolbar({ user }: MemberToolbarProps) {
  const { data: currentUser } = useGetCurrentUser();

  const isCurrentUserKetua = currentUser?.role === "ketua";
  const isViewingOwnUser = currentUser?.uid === user.uid;

  const [isEditDataDialogOpen, setIsEditDataDialogOpen] = useState(false);

  return (
    <div className="ml-auto flex gap-2">
      {(isCurrentUserKetua || isViewingOwnUser) && (
        <>
          <EditDataDialog
            user={user}
            isOpen={isEditDataDialogOpen}
            onOpenChange={setIsEditDataDialogOpen}
          />
          <Button
            variant="outline"
            size="icon"
            className="rounded-full text-slate-500 hover:text-slate-500"
            onClick={() => setIsEditDataDialogOpen(true)}
          >
            <Icon.Pencil />
          </Button>
        </>
      )}
    </div>
  );
}
