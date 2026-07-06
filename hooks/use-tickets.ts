import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ticket } from "@/lib/db/schema";

async function fetchTickets(): Promise<Ticket[]> {
  const res = await fetch("/api/tickets");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "โหลดข้อมูลไม่สำเร็จ");
  return data.tickets || [];
}

async function updateTicketStatus({ id, status }: { id: string; status: string }): Promise<Ticket> {
  const res = await fetch("/api/tickets", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "อัปเดตไม่สำเร็จ");
  return data.ticket;
}

export function useTickets() {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: fetchTickets,
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTicketStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}
