import { useMutation, useQuery } from "@tanstack/react-query";
import { createCookie, getCurrentUser } from "../services/session";

export function useCreateSessionCookie() {
  const mutation = useMutation({
    mutationFn: createCookie,
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
