import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { getUserByUid, getUsersByClassId, setUserData } from "../services/user";

export function useSetUserData() {
  const mutation = useMutation({
    mutationFn: setUserData,
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
