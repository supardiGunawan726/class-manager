"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinClass } from "@/lib/firebase/db/class";
import { useState } from "react";

export function JoinClassForm({ uid }) {
  const [values, setValues] = useState({
    id: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    done: false,
    error: null,
  });

  function handleInputChange(e) {
    const { id, value } = e.target;
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    setStatus({ loading: true, done: false, error: null });
    try {
      await joinClass(uid, values.id);
      setStatus({ loading: false, done: true, error: null });
    } catch (error) {
      console.log(error);
      setStatus({ loading: false, done: false, error: error.message });
    }
  }

  if (status.done) {
    return (
      <Card className="max-w-sm mx-auto mt-24">
        <CardHeader className="text-center">
          <CardTitle>Class Manager</CardTitle>
          <CardDescription>Permintaan gabung sudah terkirim!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
            Mohon tunggu untuk ketua kelas anda untuk menerima permintaan
            bergabung anda.
          </p>
          <form action="/api/auth/logout" method="post">
            <button>Logout</button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-sm mx-auto mt-24">
      <CardHeader className="text-center">
        <CardTitle>Class Manager</CardTitle>
        <CardDescription>Gabung kelas</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid w-full gap-3" onSubmit={handleFormSubmit}>
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
          <div className="grid w-full max-w-sm items-center gap-2 mt-4">
            <Button>Gabung</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
