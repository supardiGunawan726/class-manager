import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import * as Icon from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User } from "@/lib/firebase/model/user";
import slugify from "slugify";
import { useCreateClass, useGetClassById } from "@/lib/queries/class";
import { useSetUserData } from "@/lib/queries/user";

type CreateClassFormProps = {
  user: User;
};

export function CreateClassForm({ user }: CreateClassFormProps) {
  const { mutateAsync: createClass } = useCreateClass();
  const { mutateAsync: setUserData } = useSetUserData();

  const router = useRouter();

  const [classId, setClassId] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    done: false,
    error: "",
  });

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setStatus({ loading: true, done: false, error: "" });

      const formData = new FormData(e.currentTarget);
      formData.set("member", user.uid);

      await createClass({
        id: formData.get("class_id") as string,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        member: [user.uid],
      });

      await setUserData({
        ...user,
        class_id: formData.get("class_id") as string,
      });

      setStatus({ loading: false, done: true, error: "" });
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
          alt="logo"
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
