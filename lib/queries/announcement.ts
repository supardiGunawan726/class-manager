import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from "../services/announcement";
import { Announcement } from "../firebase/model/announcement";

export function useGetAnnouncements(class_id?: string) {
  const query = useQuery({
    queryKey: ["announcement"],
    queryFn: class_id ? () => getAnnouncements(class_id) : skipToken,
  });

  return query;
}

export function useGetAnnouncement(class_id?: string, id?: string) {
  const query = useQuery({
    queryKey: ["announcement", `announcement_${id}`],
    queryFn: class_id && id ? () => getAnnouncement(class_id, id) : skipToken,
  });

  return query;
}

export function useDeleteAnnouncement() {
  const query = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ class_id, id }: { class_id: string; id: string }) =>
      deleteAnnouncement(class_id, id),
    onSettled: (data, error, variables) => {
      query.invalidateQueries({
        queryKey: ["announcement"],
        refetchType: "all",
      });
      query.invalidateQueries({
        queryKey: [`announcement_${variables.id}`],
        refetchType: "all",
      });
    },
  });

  return mutation;
}

export function useCreateAnnouncement() {
  const query = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      class_id,
      data,
    }: {
      class_id: string;
      data: Omit<Announcement, "id" | "published_at">;
    }) => createAnnouncement(class_id, data),
    onSettled: (data, error, variables) => {
      query.invalidateQueries({
        queryKey: ["announcement"],
        refetchType: "all",
      });
    },
  });

  return mutation;
}

export function useUpdateAnnouncement() {
  const query = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      class_id,
      id,
      data,
    }: {
      class_id: string;
      id: string;
      data: Omit<Announcement, "id" | "published_at" | "author">;
    }) => updateAnnouncement(class_id, id, data),
    onSettled: (data, error, variables) => {
      query.invalidateQueries({
        queryKey: ["announcement"],
        refetchType: "all",
      });
      query.invalidateQueries({
        queryKey: [`announcement_${variables.id}`],
        refetchType: "all",
      });
    },
  });

  return mutation;
}
