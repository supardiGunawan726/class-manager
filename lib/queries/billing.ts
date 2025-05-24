import { skipToken, useQuery } from "@tanstack/react-query";
import { getBillingsByClassId } from "../services/billing";

export function useGetBillingsByClassId(
  class_id?: string,
  q?: { datePeriod?: { seconds: number; nanoseconds: number } }
) {
  const query = useQuery({
    queryKey: ["billing", `billing_${class_id}`],
    queryFn: class_id
      ? () => getBillingsByClassId(class_id, { datePeriod: q?.datePeriod })
      : skipToken,
  });

  return query;
}
