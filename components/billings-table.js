import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BILLING_STATUS, formatTimestamp, idrFormatter } from "@/lib/utils";
import * as Icon from "lucide-react";

export function BillingTable({ billings, simple }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Tanggal</TableHead>
          {!simple && <TableHead>Terbayar/Tagihan</TableHead>}
          <TableHead className="text-center">Status</TableHead>
          {!simple && (
            <>
              <TableHead>Terverifikasi</TableHead>
              <TableHead>Total uang kas</TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {billings.map((billing, index) => (
          <TableRow key={billing.name}>
            <TableCell>{++index}</TableCell>
            <TableCell>{billing.name}</TableCell>
            <TableCell>
              {billing.last_transaction_date
                ? formatTimestamp(billing.last_transaction_date)
                : "-"}
            </TableCell>
            {!simple && (
              <TableCell>
                {idrFormatter.format(billing.amount_paid)}/
                {idrFormatter.format(billing.amount_bill)}
              </TableCell>
            )}
            <TableCell>
              <div className="grid place-items-center">
                <StatusBadge status={billing.status} />
              </div>
            </TableCell>
            {!simple && (
              <>
                <TableCell>
                  <div className="grid place-items-center">
                    {billing.verified ? (
                      <Icon.Check className="text-green-500" />
                    ) : (
                      <Icon.X className="text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {idrFormatter.format(billing.total_funding)}
                </TableCell>
              </>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function StatusBadge({ status }) {
  if (status === BILLING_STATUS.PAID.value) {
    return (
      <Badge className="bg-green-500 hover:bg-green-400">
        {BILLING_STATUS.PAID.label}
      </Badge>
    );
  }

  if (status === BILLING_STATUS.PARTIAL.value) {
    return (
      <Badge className="bg-yellow-500 hover:bg-yellow-400">
        {BILLING_STATUS.PARTIAL.label}
      </Badge>
    );
  }

  if (status === BILLING_STATUS.UNPAID.value) {
    return <Badge variant="destructive">{BILLING_STATUS.UNPAID.label}</Badge>;
  }

  return <Badge>Tidak diketahui</Badge>;
}
