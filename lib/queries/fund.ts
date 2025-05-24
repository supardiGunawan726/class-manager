import { skipToken, useQuery } from "@tanstack/react-query";
import { getFundByClassId } from "../services/fund";

export function useGetFundByClassId(class_id?: string) {
  const query = useQuery({
    queryKey: ["fund", `fund_${class_id}`],
    queryFn: class_id ? () => getFundByClassId(class_id) : skipToken,
  });

  return query;
}
