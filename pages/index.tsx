import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import * as Icon from "lucide-react";
import { useGetCurrentUser } from "@/lib/queries/session";
import Greeting from "@/components/homepage/greeting";
import Announcement from "@/components/homepage/announcement";
import Fund from "@/components/homepage/fund";
import { useGetFundByClassId } from "@/lib/queries/fund";
import { useGetBillingsByClassId } from "@/lib/queries/billing";
import { getBillingDateInterval } from "@/lib/services/billing";
import { useGetAnnouncements } from "@/lib/queries/announcement";
import AppLayout from "@/components/app-layout";

export default function Home() {
  const { data: currentUser } = useGetCurrentUser();
  const { data: fund } = useGetFundByClassId(currentUser?.class_id);
  const billingDateInterval = fund ? getBillingDateInterval(fund) : undefined;
  const datePeriod = billingDateInterval
    ? billingDateInterval[billingDateInterval.length - 1]
    : undefined;
  const { data: billings } = useGetBillingsByClassId(currentUser?.class_id, {
    datePeriod,
  });

  const { data: announcements = [] } = useGetAnnouncements(
    currentUser?.class_id
  );

  return (
    <AppLayout>
      <main className="px-12 pt-10">
        <header>{currentUser && <Greeting user={currentUser} />}</header>
        <div className="grid grid-cols-[3fr_2fr] gap-8 mt-12">
          <div className="grid gap-8">
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
                  <span className="text-center whitespace-nowrap">
                    Utilitas
                  </span>
                </Link>
              </CardContent>
            </Card>
            {fund && datePeriod && billings && (
              <Fund fund={fund} datePeriod={datePeriod} billings={billings} />
            )}
          </div>
          <div>
            <Announcement announcements={announcements} />
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
