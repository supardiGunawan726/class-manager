import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import * as Icon from "lucide-react";
import AppLayout from "../_layout";

export default function UtilityPage() {
  return (
    <AppLayout>
      <main className="px-12 pt-10">
        <header>
          <h1 className="font-semibold text-4xl">Utilitas</h1>
        </header>
        <div className="mt-12">
          <Card className="w-max">
            <CardContent className="pt-7 px-10 flex gap-16">
              <Link
                href="/utility/groups-generator"
                className="flex flex-col items-center gap-2 w-16"
              >
                <div className="w-16 h-16 grid place-items-center bg-green-400/20 text-green-400 rounded-lg">
                  <Icon.UserPlus width={28} height={28} />
                </div>
                <span className="text-center whitespace-nowrap">
                  Buat kelompok
                </span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
