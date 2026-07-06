import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpenseRequests, createExpenseRequest, updateExpenseRequest } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useExpenseRequests() {
  return useQuery({
    queryKey: queryKeys.expenseRequests,
    queryFn: getExpenseRequests,
  });
}

export function useCreateExpenseRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpenseRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenseRequests });
    },
  });
}

export function useUpdateExpenseRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) =>
      updateExpenseRequest(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.expenseRequests });
      const previous = queryClient.getQueryData(queryKeys.expenseRequests);
      queryClient.setQueryData(queryKeys.expenseRequests, (old: any) =>
        old?.map((item: any) => (item.id === id ? { ...item, status } : item))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(queryKeys.expenseRequests, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenseRequests });
    },
  });
}
