"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./auth-provider";
import { useUserClassContext } from "./user-class-provider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Home() {
  const router = useRouter();
  const user = useAuthContext();
  const userClass = useUserClassContext();

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    router.refresh();
  }

  return (
    <Card className="max-w-md mx-auto mt-24">
      <CardHeader className="text-center">
        <CardTitle>Class Manager</CardTitle>
        <CardDescription>Anggap saja ini sudah didashboard ya</CardDescription>
      </CardHeader>
      <CardContent>
        <Label className="font-bold">Info user</Label>
        <Separator className="my-2" />
        <ul>
          <li>
            <div className="flex justify-between">
              <span>UID</span>
              <span>{user.uid}</span>
            </div>
          </li>
          <li>
            <Separator className="my-2" />
          </li>
          <li>
            <div className="flex justify-between">
              <span>Nama</span>
              <span>{user.name}</span>
            </div>
          </li>
          <li>
            <Separator className="my-2" />
          </li>
          <li>
            <div className="flex justify-between">
              <span>Email</span>
              <span>{user.email}</span>
            </div>
          </li>
          <li>
            <Separator className="my-2" />
          </li>
          <li>
            <div className="flex justify-between">
              <span>NIM</span>
              <span>{user.nim}</span>
            </div>
          </li>
        </ul>

        <Label className="font-bold mt-8 inline-block">Info kelas</Label>
        <Separator className="my-2" />
        <ul>
          <li>
            <div className="flex justify-between">
              <span>ID kelas</span>
              <span>{userClass.id}</span>
            </div>
          </li>
          <li>
            <Separator className="my-2" />
          </li>
          <li>
            <div className="flex justify-between">
              <span>Nama kelas</span>
              <span>{userClass.name}</span>
            </div>
          </li>
        </ul>

        <Label className="font-bold mt-8 inline-block">Member kelas</Label>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {userClass.member.map((uid) => (
                <TableCell key={uid} className="font-medium">
                  {uid}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>

        <Label className="font-bold mt-8 inline-block">
          Permintaan bergabung ke kelas
        </Label>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>UID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {userClass.join_requests.map((join_request) => (
                <TableCell key={join_request.uid} className="font-medium">
                  {join_request.uid}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={logout}>Logout</Button>
      </CardFooter>
    </Card>
  );
}
