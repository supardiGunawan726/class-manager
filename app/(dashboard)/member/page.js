import { Input } from "@/components/ui/input";
import Link from "next/link";
import { buttonVariants, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

export default function MemberPage() {
  return (
    <main className="px-12 pt-10">
      <header>
        <h1 className="font-semibold text-4xl">Data mahasiswa</h1>
      </header>
      <div className="mt-12">
        <header className="flex items-center">
          <Input
            type="text"
            name="search"
            id="search"
            placeholder="Cari mahasiswa dengan nama"
            className="w-[276px]"
          />
          <Link href="/member/add" className={cn(buttonVariants(), "ml-auto")}>
            Tambah mahasiswa
          </Link>
        </header>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>NIM</TableHead>
                <TableHead className="w-[100px]">Role</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Supardi G</TableCell>
                <TableCell>supardi.g_ti22@nusaputra.ac.id</TableCell>
                <TableCell>20220040084</TableCell>
                <TableCell>ketua</TableCell>
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
                        <Link href="/member/1">Lihat</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/member/1">Sunting</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Hapus</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
