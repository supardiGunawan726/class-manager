import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
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
        <form className="mt-2 grid gap-3">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Alamat email</Label>
            <Input type="email" id="email" placeholder="Masukan email kamu" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Masukan kata sandi kamu"
            />
          </div>
          <Link
            href="/auth/forgot-password"
            className="ml-auto w-max text-sm text-primary"
          >
            Lupa Kata Sandi
          </Link>
          <Button className="block">Masuk</Button>
          <p>
            Belum punya akun ?{" "}
            <Link href="/auth/register" className="font-bold text-primary">
              Klik disini untuk daftar
            </Link>
          </p>
          <p className="text-center">
            Dengan menggunakan layanan kami, Anda berarti setuju atas{" "}
            <Link href="#" className="underline">
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link href="#" className="underline">
              Kebijiakan Privasi
            </Link>{" "}
            Class Manager
          </p>
        </form>
      </section>
    </main>
  );
}
