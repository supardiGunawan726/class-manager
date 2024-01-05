import * as Icon from "lucide-react";
import Link from "next/link";

export function Sidebar({ user, userClass }) {
  return (
    <aside className="min-h-screen bg-foreground text-background p-8">
      <header className="flex gap-4 items-center">
        <div className="bg-slate-700 w-14 h-14 grid place-items-center rounded-full">
          <Icon.User />
        </div>
        <div className="font-semibold">
          {user && (
            <Link href={`/member/${user.uid}`}>
              <h4 className="text-lg hover:underline">{user.name}</h4>
            </Link>
          )}
          {userClass && (
            <Link href="/class" className="hover:underline">
              <span className="text-xs">{userClass.name}</span>
            </Link>
          )}
        </div>
      </header>
      <nav className="mt-16 pl-1 grid gap-6">
        <Link href="/" className="flex gap-6">
          <Icon.LayoutDashboard />
          <span>Dashboard</span>
        </Link>
        <Link href="/member" className="flex gap-6">
          <Icon.Users2 />
          <span>Data mahasiswa</span>
        </Link>
        <Link href="/fund" className="flex gap-6">
          <Icon.DollarSign />
          <span>Uang kas</span>
        </Link>
        <Link href="/documentation" className="flex gap-6">
          <Icon.Camera />
          <span>Dokumentasi kelas</span>
        </Link>
        <Link href="/discussion" className="flex gap-6">
          <Icon.MessageCircle />
          <span>Forum Diskusi</span>
        </Link>
        <Link href="/announcement" className="flex gap-6">
          <Icon.Bell />
          <span>Pengumuman</span>
        </Link>
        <Link href="/utility" className="flex gap-6">
          <Icon.PencilRuler />
          <span>Utilitas</span>
        </Link>
      </nav>
    </aside>
  );
}
