"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClass } from "@/lib/firebase/db/class";
import { setUserData } from "@/lib/firebase/db/user";
import { useRouter } from "next/navigation";
import { useState } from "react";
import slugify from "slugify";
import Image from "next/image";

export function CreateClassForm({ uid }) {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    description: "",
    id: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(e) {
    const { id, value } = e.target;

    if (id === "name") {
      const slug = slugify(value, { lower: true });
      setValues((prev) => ({ ...prev, name: value, id: slug }));
      return;
    }

    setValues((prev) => ({ ...prev, [id]: value }));
  }

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
        <form className="grid w-full gap-3" onSubmit={handleFormSubmit}>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="name">Nama kelas</Label>
            <Input
              id="name"
              type="text"
              placeholder="Masukan nama kelas"
              value={values.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="id">ID kelas</Label>
            <Input
              id="id"
              type="text"
              placeholder="ID kelas"
              value={values.id}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="description">Deskripsi kelas</Label>
            <Textarea
              id="description"
              type="text"
              placeholder="Tujuan kelas, peraturan kelas, apapun itu"
              value={values.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-2 mt-4">
            <Button>Buat kelas</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
