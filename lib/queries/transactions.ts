import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createTransaction,
  getTransaction,
  getTransactions,
  updateTransaction,
} from "../services/transaction";
import { Transaction } from "../firebase/model/transaction";

export function useGetTransactions(class_id?: string, user_id?: string) {
  const query = useQuery({
    queryKey: ["transaction", `transaction_${class_id}`],
    queryFn: class_id ? () => getTransactions(class_id, user_id) : skipToken,
  });

  return query;
}

export function useGetTransaction(class_id?: string, id?: string) {
  const query = useQuery({
    queryKey: ["transaction", `transaction_${class_id}`],
    queryFn: class_id && id ? () => getTransaction(class_id, id) : skipToken,
  });

  return query;
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      class_id,
      data,
    }: {
      class_id: string;
      data: Omit<Transaction, "id" | "proof"> & {
        proof: File;
      };
    }) => createTransaction(class_id, data),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["transaction"],
      });
      queryClient.invalidateQueries({
        queryKey: ["billing"],
      });
    },
  });

  return mutation;
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      class_id,
      id,
      data,
    }: {
      class_id: string;
      id: string;
      data: Partial<Omit<Transaction, "id">>;
    }) => updateTransaction(class_id, id, data),
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transaction"],
      });
      queryClient.invalidateQueries({
        queryKey: [`transaction_${variables.id}`],
      });
      queryClient.invalidateQueries({
        queryKey: ["billing"],
      });
    },
  });

  return mutation;
}
