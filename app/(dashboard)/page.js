import { Card, CardContent } from "@/components/ui/card";
import { Greeting } from "./greeting";
import Link from "next/link";
import * as Icon from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="px-12 pt-10">
      <header>
        <Greeting />
      </header>
      <div className="grid grid-cols-[3fr_2fr] gap-8 mt-12">
        <div>
          <Card>
            <CardContent className="pt-7 flex justify-around">
              <Link
                href="/member"
                className="flex flex-col items-center gap-2 w-16"
              >
                <div className="w-16 h-16 grid place-items-center bg-yellow-400/20 text-yellow-400 rounded-lg">
                  <Icon.Users2 width={28} height={28} />
                </div>
                <span className="text-center whitespace-nowrap">
                  Data mahasiswa
                </span>
              </Link>
              <Link
                href="/documentation"
                className="flex flex-col items-center gap-2 w-16"
              >
                <div className="w-16 h-16 grid place-items-center bg-orange-400/20 text-orange-400 rounded-lg">
                  <Icon.Folder width={28} height={28} />
                </div>
                <span className="text-center whitespace-nowrap">
                  Dokumentasi
                </span>
              </Link>
              <Link
                href="/utility"
                className="flex flex-col items-center gap-2 w-16"
              >
                <div className="w-16 h-16 grid place-items-center bg-green-400/20 text-green-400 rounded-lg">
                  <Icon.PencilRuler width={28} height={28} />
                </div>
                <span className="text-center whitespace-nowrap">Utilitas</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
