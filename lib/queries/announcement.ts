import { skipToken, useQuery } from "@tanstack/react-query";
import { getAnnouncements } from "../services/announcement";

export function useGetAnnouncements(class_id?: string) {
  const query = useQuery({
    queryKey: ["announcement", `announcement_${class_id}`],
    queryFn: class_id ? () => getAnnouncements(class_id) : skipToken,
  });

  return query;
}
