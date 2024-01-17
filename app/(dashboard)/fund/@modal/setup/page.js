import { SetupFundDialog } from "./setup-fund-dialog";
import { getCurrentUser } from "@/lib/firebase/admin/db/user";

export default async function SetupFundPage() {
  const user = await getCurrentUser();

  return <SetupFundDialog user={user} />;
}
