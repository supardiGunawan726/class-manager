"use client";

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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteClassMember } from "@/lib/firebase/db/class";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthContext } from "../auth-provider";

export function MemberTable({ userClassId, userClassMembers }) {
  const router = useRouter();
  const user = useAuthContext();

  function deleteMember(uid) {
    return async () => {
      await deleteClassMember(uid, userClassId);
      router.refresh();
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
        {userClassMembers.map((member) => (
          <TableRow key={member.uid}>
            <TableCell>{member.name}</TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.nim}</TableCell>
            <TableCell>{member.role}</TableCell>
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
                  <DropdownMenuItem asChild>
                    <Link href={`/member/${member.uid}`}>Lihat</Link>
                  </DropdownMenuItem>
                  {user.role === "ketua" && (
                    <DropdownMenuItem onClick={deleteMember(member.uid)}>
                      Hapus
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function MemberTableToolbar() {
  const user = useAuthContext();

  return (
    <header className="flex items-center">
      <Input
        type="text"
        name="search"
        id="search"
        placeholder="Cari mahasiswa dengan nama"
        className="w-[276px]"
      />
      {user.role === "ketua" && (
        <>
          <Link
            href="/member/join-request"
            className={cn(buttonVariants({ variant: "outline" }), "ml-auto")}
          >
            Permintaan bergabung
          </Link>
          <Link href="/member/add" className={cn(buttonVariants(), "ml-2")}>
            Tambah mahasiswa
          </Link>
        </>
      )}
    </header>
  );
}
