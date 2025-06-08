import { Input } from "@/components/ui/input";
import { User } from "@/lib/firebase/model/user";
import React from "react";
import { JoinRequestTable } from "../../../components/member/_join-request-table";
import { useGetCurrentUser } from "@/lib/queries/session";
import { useGetClassJoinRequest } from "@/lib/queries/class";
import AppLayout from "@/components/app-layout";

export default function JoinRequest() {
  const { data: user } = useGetCurrentUser();
  const { data: userClassJoinRequests = [] } = useGetClassJoinRequest(
    user?.class_id
  );

  return (
    <AppLayout>
      <main className="px-12 pt-10">
        <header>
          <h1 className="font-semibold text-4xl">Permintaan bergabung</h1>
        </header>
        <div className="mt-12">
          <div className="mt-4">
            {userClassJoinRequests.length < 1 && (
              <div className="flex flex-col items-center justify-center gap-4 min-h-[500px]">
                <p className="text-sm text-slate-500 text-center">
                  Permintaan bergabung kosong
                </p>
              </div>
            )}
            {user && userClassJoinRequests.length > 0 && (
              <>
                {/* <header className="flex items-center">
                  <Input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Cari mahasiswa dengan nama"
                    className="w-[276px]"
                  />
                </header> */}
                <JoinRequestTable
                  user={user}
                  userClassJoinRequests={userClassJoinRequests}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
