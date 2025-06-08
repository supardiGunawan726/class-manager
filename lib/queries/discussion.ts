import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createDiscussionChat,
  createDiscussions,
  getDiscussion,
  getDiscussions,
} from "../services/discussion";
import { Discussion, DiscussionChat } from "../firebase/model/discussion";

export function useGetDiscussions(class_id?: string) {
  const query = useQuery({
    queryKey: ["discussion"],
    queryFn: class_id ? () => getDiscussions(class_id) : skipToken,
  });

  return query;
}

export function useGetDiscussion(class_id?: string, id?: string) {
  const query = useQuery({
    queryKey: ["discussion", `discussion_${id}`],
    queryFn: class_id && id ? () => getDiscussion(class_id, id) : skipToken,
  });

  return query;
}

export function useCreateDiscussion() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      class_id,
      data,
    }: {
      class_id: string;
      data: Omit<Discussion, "id">;
    }) => createDiscussions(class_id, data),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["discussion"],
        refetchType: "all",
      });
    },
  });

  return mutation;
}

export function useCreateDiscussionChat() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      class_id,
      discussion_id,
      data,
    }: {
      class_id: string;
      discussion_id: string;
      data: Omit<DiscussionChat, "id" | "sent_at">;
    }) => createDiscussionChat(class_id, discussion_id, data),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["discussion_chat"],
        refetchType: "all",
      });
    },
  });

  return mutation;
}
