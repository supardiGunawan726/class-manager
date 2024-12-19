"use client";

import { Form } from "@/app/components/form";
import { login } from "@/app/services/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

const FormSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email tidak valid")
    .required("Mohon isi email kamu"),
  password: Yup.string()
    .required("Mohon isi kata sandi")
    .min(9, "Kata sandi minimal 9 karakter"),
});

type FormModel = Yup.InferType<typeof FormSchema>;

export default function LoginPage() {
  const router = useRouter();

  async function onSubmit({ email, password }: FormModel) {
    await login({
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
          alt="class manager logo"
        />
      </header>
      <section>
        <h1 className="text-2xl font-bold text-primary">
          Masuk Ke Class Manager
        </h1>
        <Formik
          validationSchema={FormSchema}
          initialValues={{
            email: "",
            password: "",
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
              <Form.InputItem name="password" label="Kata sandi">
                <Input
                  type="password"
                  name="password"
                  placeholder="Masukkan kata sandi"
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></Input>
              </Form.InputItem>
              <Button className="mt-2" loading={isSubmitting}>
                Masuk
              </Button>
              <p>
                Sudah punya akun ?{" "}
                <Link href="/auth/register" className="font-bold text-primary">
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
