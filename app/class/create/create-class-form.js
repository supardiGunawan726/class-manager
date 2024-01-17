"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import slugify from "slugify";
import * as Icon from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createClass } from "../actions";

export function CreateClassForm({ user }) {
  const router = useRouter();

  const [classId, setClassId] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    done: false,
    error: null,
  });

  async function handleFormSubmit(e) {
    e.preventDefault();

    setIsLoading(true);
    try {
      const class_id = await createClass({
        id: values.id,
        name: values.name,
        description: values.description,
        member: [uid],
      });
      await setUserData(uid, {
        class_id,
      });
      router.replace("/");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      setStatus({ loading: true, done: false, error: null });

      const formData = new FormData(e.target);
      formData.set("member", user.uid);

      await createClass(formData);
      router.replace("/");

      setStatus({ loading: false, done: true, error: null });
    } catch (error) {
      console.error(error);
      setStatus({
        loading: false,
        done: false,
        error: "Terjadi kesalahan, mohon coba kembali",
      });
    }
  }

  return (
    <Card className="max-w-sm mx-auto mt-24">
      <CardHeader className="text-center">
        <Image
          src="/images/logo.png"
          width={300}
          height={94}
          className="mx-auto"
        />
        <CardTitle>Buat kelas</CardTitle>
      </CardHeader>
      <CardContent>
        {status.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{status.error}</AlertDescription>
          </Alert>
        )}
        <form className="grid w-full gap-3" onSubmit={handleFormSubmit}>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="name">Nama kelas</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Masukan nama kelas"
              onChange={(e) => setClassId(slugify(e.target.value))}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="class_id">ID kelas</Label>
            <Input
              id="class_id"
              name="class_id"
              type="text"
              placeholder="ID kelas"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="description">Deskripsi kelas</Label>
            <Textarea
              id="description"
              name="description"
              type="text"
              placeholder="Tujuan kelas, peraturan kelas, apapun itu"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2 mt-4">
            <Button disabled={status.loading} className="disabled:opacity-60">
              <div className="relative">
                {status.loading && (
                  <span className="block mr-1 absolute translate-x-[calc(-100%-4px)]">
                    <Icon.Loader2
                      className="animate-spin"
                      width={18}
                      height={18}
                    />
                  </span>
                )}
                <span>Buat kelas</span>
              </div>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
