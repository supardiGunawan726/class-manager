import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addClassMember,
  approveJoinRequest,
  declineJoinRequest,
  getClassById,
  getClassJoinRequest,
  removeClassMember,
} from "../services/class";
import { User } from "../firebase/model/user";

export function useGetClassById(id?: string) {
  const query = useQuery({
    queryKey: ["class", `class_${id}`],
    queryFn: id ? () => getClassById(id) : skipToken,
  });

  return query;
}

export function useAddClassMember() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (user: Omit<User, "uid"> & { password: string }) =>
      addClassMember(user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
        refetchType: "all",
      });
    },
  });

  return mutation;
}

export function useRemoveClassMember() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ class_id, uid }: { class_id: string; uid: string }) =>
      removeClassMember(class_id, uid),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
        refetchType: "all",
      });
    },
  });

  return mutation;
}

export function useGetClassJoinRequest(class_id?: string) {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: class_id ? () => getClassJoinRequest(class_id) : skipToken,
  });

  return query;
}

export function useApproveJoinRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ class_id, uid }: { class_id: string; uid: string }) =>
      approveJoinRequest(class_id, uid),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
        refetchType: "all",
      });
    },
  });

  return mutation;
}

export function useDeclineJoinRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ class_id, uid }: { class_id: string; uid: string }) =>
      declineJoinRequest(class_id, uid),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
        refetchType: "all",
      });
    },
  });

  return mutation;
}
