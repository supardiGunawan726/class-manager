import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createDocumentation,
  deleteDocumentation,
  getDocumentation,
  getDocumentations,
  updateDocumentation,
} from "../services/documentation";
import { Documentation } from "../firebase/model/documentation";

export function useGetDocumentations(class_id?: string) {
  const query = useQuery({
    queryKey: ["documentation"],
    queryFn: class_id ? () => getDocumentations(class_id) : skipToken,
  });

  return query;
}

export function useGetDocumentation(class_id?: string, id?: string) {
  const query = useQuery({
    queryKey: [`documentation_${id}`],
    queryFn: class_id && id ? () => getDocumentation(class_id, id) : skipToken,
  });

  return query;
}

export function useDeleteDocumentation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ class_id, id }: { class_id: string; id: string }) =>
      deleteDocumentation(class_id, id),
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["documentation"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: [`documentation_${variables.id}`],
        refetchType: "all",
      });
    },
  });

  return mutation;
}

export function useUpdateDocumentation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      class_id,
      id,
      data,
    }: {
      class_id: string;
      id: string;
      data: Omit<Documentation, "id" | "published_at" | "media" | "author"> & {
        new_media: File[];
        remove_media_filename: string[];
      };
    }) => updateDocumentation(class_id, id, data),
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["documentation"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: [`documentation_${variables.id}`],
        refetchType: "all",
      });
    },
  });

  return mutation;
}

export function useCreateDocumentation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      class_id,
      data,
    }: {
      class_id: string;
      data: Omit<Documentation, "id" | "published_at" | "media"> & {
        media_file: File[];
      };
    }) => createDocumentation(class_id, data),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["documentation"],
        refetchType: "all",
      });
    },
  });

  return mutation;
}
