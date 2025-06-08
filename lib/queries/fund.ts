import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getFundByClassId, setFund } from "../services/fund";
import { Fund } from "../firebase/model/fund";

export function useGetFundByClassId(class_id?: string) {
  const query = useQuery({
    queryKey: ["fund", `fund_${class_id}`],
    queryFn: class_id ? () => getFundByClassId(class_id) : skipToken,
  });

  return query;
}

export function useSetFund() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      class_id,
      data,
    }: {
      class_id: string;
      data: Omit<Fund, "id">;
    }) => setFund(class_id, data),
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["fund"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: [`fund${variables.class_id}`],
        refetchType: "all",
      });
    },
  });

  return mutation;
}
