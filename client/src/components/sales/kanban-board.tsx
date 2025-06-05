import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import KanbanColumn from "./kanban-column";
import { apiRequest } from "@/lib/queryClient";

interface KanbanBoardProps {
  leadsByStage: {
    reception: any[];
    consulting: any[];
    quoted: any[];
    negotiating: any[];
    closed: any[];
  };
}

const STAGES = [
  { key: 'reception', label: 'Tiếp nhận', color: 'bg-gray-50' },
  { key: 'consulting', label: 'Tư vấn', color: 'bg-blue-50' },
  { key: 'quoted', label: 'Báo giá', color: 'bg-orange-50' },
  { key: 'negotiating', label: 'Đàm phán', color: 'bg-purple-50' },
  { key: 'closed', label: 'Chốt Deal', color: 'bg-green-50' },
];

export default function KanbanBoard({ leadsByStage }: KanbanBoardProps) {
  const [draggedLead, setDraggedLead] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStageMutation = useMutation({
    mutationFn: async ({ leadId, newStage }: { leadId: number; newStage: string }) => {
      return apiRequest("PUT", `/api/leads/${leadId}/stage`, { stage: newStage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Thành công",
        description: "Đã cập nhật giai đoạn lead",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật giai đoạn lead",
        variant: "destructive",
      });
    },
  });

  const handleDragStart = (e: React.DragEvent, lead: any) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    
    if (draggedLead && draggedLead.stage !== targetStage) {
      updateStageMutation.mutate({
        leadId: draggedLead.id,
        newStage: targetStage,
      });
    }
    
    setDraggedLead(null);
  };

  const handleDragEnd = () => {
    setDraggedLead(null);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {STAGES.map((stage) => (
            <KanbanColumn
              key={stage.key}
              stage={stage}
              leads={leadsByStage[stage.key as keyof typeof leadsByStage]}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              isDraggedOver={draggedLead && draggedLead.stage !== stage.key}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
