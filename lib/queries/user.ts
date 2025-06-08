import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getUserByUid, getUsersByClassId, setUserData } from "../services/user";

export function useSetUserData() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: setUserData,
    onSettled(data, error, variables) {
      queryClient.invalidateQueries({
        queryKey: ["user", `user_${variables.uid}`],
        refetchType: "all",
      });
    },
  });

  return mutation;
}

export function useGetUserByUid(uid?: string) {
  const query = useQuery({
    queryKey: ["user", `user_${uid}`],
    queryFn: uid ? () => getUserByUid(uid) : skipToken,
  });

  return query;
}

export function useGetUsersByClassId(class_id?: string) {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: class_id ? () => getUsersByClassId(class_id) : skipToken,
  });

  return query;
}
