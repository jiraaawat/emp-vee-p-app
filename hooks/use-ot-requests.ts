import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOtRequests, createOtRequest, updateOtRequest } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useOtRequests() {
  return useQuery({
    queryKey: queryKeys.otRequests,
    queryFn: getOtRequests,
  });
}

export function useCreateOtRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOtRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.otRequests });
    },
  });
}

export function useUpdateOtRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) =>
      updateOtRequest(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.otRequests });
      const previous = queryClient.getQueryData(queryKeys.otRequests);
      queryClient.setQueryData(queryKeys.otRequests, (old: any) =>
        old?.map((item: any) => (item.id === id ? { ...item, status } : item))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(queryKeys.otRequests, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.otRequests });
    },
  });
}
