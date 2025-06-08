import { skipToken, useQuery } from "@tanstack/react-query";
import { getBillingsByClassId } from "../services/billing";

export function useGetBillingsByClassId(
  class_id?: string,
  q?: { datePeriod?: { seconds: number; nanoseconds: number } }
) {
  const queryKey = ["billing", `billing_${class_id}`];
  if (q?.datePeriod) {
    queryKey.push(
      `datePeriod_${q.datePeriod.seconds}-${q.datePeriod.nanoseconds}`
    );
  }

  const query = useQuery({
    queryKey,
    queryFn: class_id
      ? () => getBillingsByClassId(class_id, { datePeriod: q?.datePeriod })
      : skipToken,
  });

  return query;
}
