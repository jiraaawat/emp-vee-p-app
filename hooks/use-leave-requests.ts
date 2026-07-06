import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLeaveRequests, createLeaveRequest, updateLeaveRequest } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useLeaveRequests() {
  return useQuery({
    queryKey: queryKeys.leaveRequests,
    queryFn: getLeaveRequests,
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLeaveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leaveRequests });
    },
  });
}

export function useUpdateLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) =>
      updateLeaveRequest(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.leaveRequests });
      const previous = queryClient.getQueryData(queryKeys.leaveRequests);
      queryClient.setQueryData(queryKeys.leaveRequests, (old: any) =>
        old?.map((item: any) => (item.id === id ? { ...item, status } : item))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(queryKeys.leaveRequests, context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leaveRequests });
    },
  });
}
