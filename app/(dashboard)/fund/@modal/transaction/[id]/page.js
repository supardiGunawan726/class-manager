import { getTransaction } from "@/lib/firebase/admin/db/fund";
import { TransactionProofDialog } from "./transaction-proof-dialog";
import { getCurrentUser } from "@/lib/firebase/admin/db/user";
import { notFound } from "next/navigation";

export default async function TransactionProofPage(props) {
  const params = await props.params;
  const user = await getCurrentUser();
  const transaction = await getTransaction(user.class_id, params.id);

  if (!transaction) {
    return notFound();
  }

  return <TransactionProofDialog transaction={transaction} />;
}
