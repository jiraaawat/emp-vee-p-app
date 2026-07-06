import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAttendance, clockIn, clockOut } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export function useAttendance() {
  return useQuery({
    queryKey: queryKeys.attendance,
    queryFn: getAttendance,
  });
}

export function useClockIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clockIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance });
    },
  });
}

export function useClockOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clockOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance });
    },
  });
}
