"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import * as Icon from "lucide-react";
import { addClassMember } from "@/lib/firebase/db/class";
import { setUserData } from "@/lib/firebase/db/user";
import { addMember } from "./actions";

export function NewMemberForm({ currentUser, onUserCreated }) {
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

      const formData = new FormData(e.target);
      formData.set("class_id", currentUser.class_id);
      const user = await addMember(formData);

      onUserCreated({
        uid: user.uid,
        name: user.name,
        email: user.email,
        nim: user.nim,
        password: formData.get("password"),
        class_id: user.class_id,
      });
      setStatus({ loading: false, success: true, error: null });
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, success: false, error: null });
    }
  }

  return (
    <form className="mt-4 grid gap-4" onSubmit={handleFormSubmit}>
      <div className="grid grid-cols-4 w-full max-w-sm items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Nama
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Masukan nama lengkap"
          className="col-span-3"
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
          name="email"
          type="email"
          placeholder="Masukan email"
          className="col-span-3"
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
          name="nim"
          type="number"
          placeholder="Masukan NIM"
          className="col-span-3"
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
          name="password"
          type="password"
          placeholder="Masukan kata sandi"
          className="col-span-3"
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
