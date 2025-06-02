import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/firebase-config";
import { UserClass } from "@/lib/firebase/model/class";
import { User } from "@/lib/firebase/model/user";
import { useGetClassById } from "@/lib/queries/class";
import {
  useGetCurrentUser,
  useRemoveSessionCookie,
} from "@/lib/queries/session";
import { signOut } from "firebase/auth";
import * as Icon from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

type AppLayoutProps = { children: ReactNode };

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();

  const { data: user, isFetched } = useGetCurrentUser();
  const { data: userClass } = useGetClassById(user?.class_id);

  useEffect(() => {
    if (!user && isFetched) {
      router.replace("/auth/login");
    }
  }, [user, isFetched]);

  return (
    <div className="grid grid-cols-[300px_1fr]">
      {user && userClass && (
        <>
          <Sidebar user={user} userClass={userClass} />
          {children}
        </>
      )}
    </div>
  );
}

type SidebarProps = {
  user: User;
  userClass: UserClass;
};

function Sidebar({ user, userClass }: SidebarProps) {
  const router = useRouter();

  const { mutateAsync: removeSessionCookie } = useRemoveSessionCookie();

  async function logout() {
    await signOut(auth);
    await removeSessionCookie();
    router.replace("/auth/login");
  }

  return (
    <aside className="min-h-screen bg-foreground text-background p-8 flex flex-col">
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
      <footer className="mt-auto pl-1">
        <Button
          variant="ghost"
          className="flex items-center gap-6 p-0 cursor-pointer hover:bg-transparent hover:text-background"
          onClick={logout}
        >
          <Icon.LogOut className="-scale-100" />
          Logout
        </Button>
      </footer>
    </aside>
  );
}
