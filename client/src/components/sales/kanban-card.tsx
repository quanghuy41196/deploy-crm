import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { formatCurrency } from "@/lib/formatters";
import { LEAD_SOURCES } from "@/lib/constants";

interface KanbanCardProps {
  lead: any;
  onDragStart: (e: React.DragEvent, lead: any) => void;
  onDragEnd: () => void;
}

export default function KanbanCard({ lead, onDragStart, onDragEnd }: KanbanCardProps) {
  const getSourceBadge = (source: string) => {
    const sourceConfig = LEAD_SOURCES.find(s => s.value === source);
    if (!sourceConfig) return null;

    return (
      <Badge variant="secondary" className={`source-${source} text-xs`}>
        {sourceConfig.icon && <sourceConfig.icon className="w-3 h-3 mr-1" />}
        {sourceConfig.label}
      </Badge>
    );
  };

  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: vi 
    });
  };

  return (
    <Card
      className="kanban-card cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={(e) => onDragStart(e, lead)}
      onDragEnd={onDragEnd}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-900 truncate flex-1">
            {lead.name}
          </h4>
          <span className="text-xs text-gray-500 ml-2">
            {formatTimeAgo(lead.createdAt)}
          </span>
        </div>
        
        <div className="space-y-2">
          {lead.phone && (
            <div className="flex items-center text-xs text-gray-600">
              <Phone className="w-3 h-3 mr-1" />
              <span className="truncate">{lead.phone}</span>
            </div>
          )}
          
          {lead.email && (
            <div className="flex items-center text-xs text-gray-600">
              <Mail className="w-3 h-3 mr-1" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            {getSourceBadge(lead.source)}
            {lead.value && (
              <span className="text-xs font-medium text-green-600">
                {formatCurrency(Number(lead.value))}
              </span>
            )}
          </div>
          
          {lead.product && (
            <div className="text-xs text-gray-500 truncate">
              {lead.product}
            </div>
          )}
          
          {lead.lastContactedAt && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              <span>Liên hệ lần cuối: {formatTimeAgo(lead.lastContactedAt)}</span>
            </div>
          )}
          
          {lead.content && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded text-ellipsis overflow-hidden">
              {lead.content.length > 60 
                ? `${lead.content.substring(0, 60)}...` 
                : lead.content
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
