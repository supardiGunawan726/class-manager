import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as Icon from "lucide-react";
import { User } from "@/lib/firebase/model/user";
import {
  useApproveJoinRequest,
  useDeclineJoinRequest,
} from "@/lib/queries/class";

type JoinRequestTableProps = {
  user: User;
  userClassJoinRequests: User[];
};

export function JoinRequestTable({
  user,
  userClassJoinRequests,
}: JoinRequestTableProps) {
  const { mutateAsync: approveJoinRequest } = useApproveJoinRequest();
  const { mutateAsync: declineJoinRequest } = useDeclineJoinRequest();

  function handleDeclineJoinRequest(uid: string) {
    return async () => {
      await declineJoinRequest({ uid, class_id: user.class_id! });
    };
  }

  function handleApproveJoinRequest(uid: string) {
    return async () => {
      await approveJoinRequest({ uid, class_id: user.class_id! });
    };
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Nama</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>NIM</TableHead>
          <TableHead className="w-[120px]">Role</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userClassJoinRequests.map((user) => (
          <TableRow key={user.uid}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.nim}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <Icon.MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={handleApproveJoinRequest(user.uid)}
                  >
                    Izinkan
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDeclineJoinRequest(user.uid)}
                  >
                    Tolak
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
