"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import * as Icon from "lucide-react";
import { useUserClassContext } from "@/app/(dashboard)/user-class-provider";
import { addClassMember } from "@/lib/firebase/db/class";
import { setUserData } from "@/lib/firebase/db/user";

export function NewMemberForm({ onUserCreated }) {
  const userClass = useUserClassContext();

  const [values, setValues] = useState({
    fullname: "",
    email: "",
    nim: "",
    password: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  async function handleInputChange(e) {
    const { id, value } = e.target;
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false, error: null });

      const getUserDataResult = await fetch(`/api/user/${values.email}`);
      const getUserDataBody = await getUserDataResult.json();

      let user = getUserDataBody?.data?.user;

      if (!user) {
        const createUserResult = await fetch("/api/user", {
          method: "post",
          body: JSON.stringify({
            name: values.fullname,
            email: values.email,
            nim: parseInt(values.nim),
            password: values.password,
          }),
        });
        const createUserBody = await createUserResult.json();
        user = createUserBody?.data?.user;
      }

      if (!user) {
        throw new Error("Error creating user");
      }

      if (user.class_id) {
        throw new Error("User has join other class");
      }

      await fetch("/api/auth/user-role", {
        method: "post",
        body: JSON.stringify({
          uid: user.uid,
          role: "anggota",
        }),
      });
      await addClassMember(user.uid, userClass.id);
      await setUserData(user.uid, {
        class_id: userClass.id,
      });
      setStatus({ loading: false, success: true, error: null });
      onUserCreated({
        uid: user.uid,
        name: values.fullname,
        email: values.email,
        nim: parseInt(values.nim),
        password: values.password,
        class_id: userClass.id,
      });
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, success: false, error: null });
    }
  }

  return (
    <form className="mt-4 grid gap-4" onSubmit={handleFormSubmit}>
      <div className="grid grid-cols-4 w-full max-w-sm items-center gap-4">
        <Label htmlFor="fullname" className="text-right">
          Nama
        </Label>
        <Input
          id="fullname"
          type="text"
          placeholder="Masukan nama lengkap"
          className="col-span-3"
          value={values.fullname}
          onChange={handleInputChange}
          disabled={status.loading}
          required
        />
      </div>
      <div className="grid grid-cols-4 w-full max-w-sm items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Masukan email"
          className="col-span-3"
          value={values.email}
          onChange={handleInputChange}
          disabled={status.loading}
          required
        />
      </div>
      <div className="grid grid-cols-4 w-full max-w-sm items-center gap-4">
        <Label htmlFor="nim" className="text-right">
          NIM
        </Label>
        <Input
          id="nim"
          type="number"
          placeholder="Masukan NIM"
          className="col-span-3"
          value={values.nim}
          onChange={handleInputChange}
          disabled={status.loading}
          required
        />
      </div>
      <div className="grid grid-cols-4 w-full max-w-sm items-center gap-4">
        <Label htmlFor="password" className="text-right">
          Kata sandi
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Masukan kata sandi"
          className="col-span-3"
          value={values.password}
          onChange={handleInputChange}
          disabled={status.loading}
          required
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={status.loading}>
          {!status.loading ? (
            <>
              <span>Buat akun</span>
            </>
          ) : (
            <>
              <Icon.Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Membuat akun</span>
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
