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
import { useRouter } from "next/navigation";
import { useState } from "react";

export function JoinClassForm({ uid }) {
  const router = useRouter();
  const [values, setValues] = useState({
    id: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(e) {
    const { id, value } = e.target;
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    setIsLoading(true);
    try {
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
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
