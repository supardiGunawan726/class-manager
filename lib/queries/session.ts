import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCookie,
  getCurrentUser,
  removeCookie,
} from "../services/session";

export function useCreateSessionCookie() {
  const clientQuery = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCookie,
    onSuccess: () => {
      clientQuery.invalidateQueries({
        queryKey: ["currentUser"],
        refetchType: "all",
      });
    },
  });

  return mutation;
}

export function useRemoveSessionCookie() {
  const clientQuery = useQueryClient();

  const mutation = useMutation({
    mutationFn: removeCookie,
    onSuccess: () => {
      clientQuery.invalidateQueries({
        queryKey: ["currentUser"],
        refetchType: "all",
      });
    },
  });

  return mutation;
}

export function useGetCurrentUser() {
  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  return query;
}
