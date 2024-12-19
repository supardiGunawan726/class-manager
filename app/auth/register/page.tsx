"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Formik } from "formik";
import { Form } from "@/app/components/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as Yup from "yup";
import { register } from "@/app/services/user";
import { useRouter } from "next/navigation";

const FormSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email tidak valid")
    .required("Mohon isi email kamu"),
  name: Yup.string().required("Mohon isi nama kamu"),
  password: Yup.string()
    .required("Mohon isi kata sandi")
    .min(9, "Kata sandi minimal 9 karakter"),
  confirmPassword: Yup.string()
    .required("Mohon ketik ulang kata sandi")
    .oneOf([Yup.ref("password")], "Kata sandi tidak cocok"),
});

type FormModel = Yup.InferType<typeof FormSchema>;

export default function RegisterPage() {
  const router = useRouter();

  async function onSubmit({ name, email, password }: FormModel) {
    await register({
      name,
      email,
      password,
    });
    router.replace("/");
  }

  return (
    <main className="px-4">
      <header className="grid place-items-center">
        <Image
          src="/logo.png"
          width={183}
          height={183}
          alt="Class Manager Logo"
        ></Image>
      </header>
      <section>
        <h1 className="text-2xl font-bold text-primary">
          Daftar Ke Class Manager
        </h1>
        <Formik
          validationSchema={FormSchema}
          initialValues={{
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={onSubmit}
        >
          {({ handleSubmit, handleChange, handleBlur, isSubmitting }) => (
            <Form onSubmit={handleSubmit} className="mt-3">
              <Form.InputItem name="email" label="Email">
                <Input
                  type="email"
                  name="email"
                  placeholder="Masukkan email kamu"
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></Input>
              </Form.InputItem>
              <Form.InputItem name="name" label="Nama lengkap">
                <Input
                  type="text"
                  name="name"
                  placeholder="Masukkan nama kamu"
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></Input>
              </Form.InputItem>
              <div className="grid gap-3">
                <Form.InputItem name="password" label="Kata sandi">
                  <Input
                    type="password"
                    name="password"
                    placeholder="Masukkan kata sandi"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  ></Input>
                </Form.InputItem>
                <Form.InputItem
                  name="confirmPassword"
                  label="Konfirmasi kata sandi"
                >
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Ketik ulang kata sandi"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  ></Input>
                </Form.InputItem>
              </div>
              <Button className="mt-2" loading={isSubmitting}>
                Daftar Sekarang
              </Button>
              <p>
                Sudah punya akun ?{" "}
                <Link href="/auth/login" className="font-bold text-primary">
                  Klik disini untuk masuk
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </section>
    </main>
  );
}
