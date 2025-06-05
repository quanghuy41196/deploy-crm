import { Badge } from "@/components/ui/badge";
import KanbanCard from "./kanban-card";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  stage: {
    key: string;
    label: string;
    color: string;
  };
  leads: any[];
  onDragStart: (e: React.DragEvent, lead: any) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetStage: string) => void;
  onDragEnd: () => void;
  isDraggedOver?: boolean;
}

export default function KanbanColumn({
  stage,
  leads,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDraggedOver,
}: KanbanColumnProps) {
  const getBadgeColor = (stageKey: string) => {
    const colorMap = {
      reception: 'bg-gray-200 text-gray-700',
      consulting: 'bg-blue-200 text-blue-700',
      quoted: 'bg-orange-200 text-orange-700',
      negotiating: 'bg-purple-200 text-purple-700',
      closed: 'bg-green-200 text-green-700',
    };
    return colorMap[stageKey as keyof typeof colorMap] || 'bg-gray-200 text-gray-700';
  };

  return (
    <div className="flex-shrink-0 w-80">
      <div
        className={cn(
          "rounded-lg p-4 min-h-[400px] transition-colors",
          stage.color,
          isDraggedOver && "ring-2 ring-primary ring-opacity-50"
        )}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, stage.key)}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">{stage.label}</h3>
          <Badge className={getBadgeColor(stage.key)}>
            {leads.length}
          </Badge>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
          {leads.map((lead) => (
            <KanbanCard
              key={lead.id}
              lead={lead}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
          
          {leads.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">Không có lead nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
