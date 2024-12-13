import Image from "next/image";
export default function RegisterPage() {
  return (
    <main className="px-4">
      <header className="grid place-items-center">
        <Image
          src="/logo.png"
          width={183}
          height={183}
          alt="Class Manger Logo"
        ></Image>
      </header>
      <section>
        <h1 className="text-2xl font-bold text-primary">
          Daftar Ke Class Manger
        </h1>
        <form className="mt-2 grid gap-3">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="email">Alamat Email</label>
            <input type="email" id="email" placeholder="Masukkan Email Kamu" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="nama"> Nama Lengkap</label>
            <input type="nama" id="nama" placeholder="Masukkan Nama Anda" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="sandi">Kata Sandi</label>
            <input type="sandi" id="sandi" placeholder="Masukkan Kata Sandi" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="sandi">Ketik Ulang Kata Sandi</label>
            <input
              type="sandi"
              id="sandi"
              placeholder="Masukkan Kata Sandi Kembali"
            />
          </div>
        </form>
      </section>
    </main>
  );
}
