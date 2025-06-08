import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/lib/firebase/model/transaction";
import { formatTimestamp, idrFormatter } from "@/lib/utils";
import * as Icon from "lucide-react";
import Link from "next/link";

type UserTransactionTableProps = {
  transactions: Transaction[];
};

export function UserTransactionTable({
  transactions,
}: UserTransactionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Nominal</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Keterangan</TableHead>
          <TableHead className="text-center">Terverifikasi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction, index) => (
          <TableRow key={transaction.id}>
            <TableCell>{++index}</TableCell>
            <TableCell>{idrFormatter.format(transaction.amount)}</TableCell>
            <TableCell>{formatTimestamp(transaction.date)}</TableCell>
            <TableCell>
              <Link
                href={`/fund?date=${formatTimestamp(transaction.billing_date)}`}
                className="hover:underline"
              >
                Bayar uang kas {formatTimestamp(transaction.billing_date)}
              </Link>
            </TableCell>
            <TableCell>
              <div className="grid place-items-center">
                {transaction.verified ? (
                  <Icon.Check className="text-green-500" />
                ) : (
                  <Icon.X className="text-red-500" />
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
