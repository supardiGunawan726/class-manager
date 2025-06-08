import * as Icon from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/firebase/model/user";

type ClassToolbarProps = {
  user: User;
};

export function ClassToolbar({ user }: ClassToolbarProps) {
  if (user.role !== "ketua") {
    return null;
  }

  return (
    <div className="ml-auto flex gap-2">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full text-slate-500 hover:text-slate-500"
      >
        <Icon.Pencil />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full text-red-500 hover:text-red-500 border-red-100"
      >
        <Icon.Trash />
      </Button>
    </div>
  );
}
