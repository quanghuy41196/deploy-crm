import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KanbanBoard from "@/components/sales/kanban-board";

export default function SalesPipeline() {
  const [selectedSales, setSelectedSales] = useState<string>("all");

  const { data: leadsData, isLoading } = useQuery({
    queryKey: ["/api/leads", { assignedTo: selectedSales === "all" ? "" : selectedSales, limit: 1000 }],
  });

  const { data: users } = useQuery({
    queryKey: ["/api/users"],
  });

  // Group leads by stage
  const leadsByStage = {
    reception: leadsData?.leads?.filter(lead => lead.stage === "reception") || [],
    consulting: leadsData?.leads?.filter(lead => lead.stage === "consulting") || [],
    quoted: leadsData?.leads?.filter(lead => lead.stage === "quoted") || [],
    negotiating: leadsData?.leads?.filter(lead => lead.stage === "negotiating") || [],
    closed: leadsData?.leads?.filter(lead => lead.stage === "closed") || [],
  };

  const pipelineStats = {
    totalLeads: leadsData?.leads?.length || 0,
    totalValue: leadsData?.leads?.reduce((sum, lead) => sum + Number(lead.value || 0), 0) || 0,
    conversionRate: 0, // This would be calculated based on historical data
    avgDealTime: 12, // This would be calculated from actual data
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quy trình bán hàng</h1>
          <p className="text-gray-600 mt-1">Theo dõi lead qua từng giai đoạn bán hàng</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Select value={selectedSales} onValueChange={setSelectedSales}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Chọn sales" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả sales</SelectItem>
              {users?.map((user: any) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <KanbanBoard leadsByStage={leadsByStage} />

      {/* Pipeline Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thống kê Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tổng lead trong pipeline</span>
              <span className="text-sm font-medium">{pipelineStats.totalLeads} lead</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Giá trị pipeline</span>
              <span className="text-sm font-medium text-green-600">
                {new Intl.NumberFormat('vi-VN', { 
                  style: 'currency', 
                  currency: 'VND' 
                }).format(pipelineStats.totalValue)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tỷ lệ chuyển đổi</span>
              <span className="text-sm font-medium">{pipelineStats.conversionRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Thời gian trung bình</span>
              <span className="text-sm font-medium">{pipelineStats.avgDealTime} ngày</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Sales tháng này</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* This would come from actual data */}
            <div className="text-sm text-gray-500">
              Chưa có dữ liệu thống kê sales
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt động sắp tới</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* This would come from tasks/activities */}
            <div className="text-sm text-gray-500">
              Chưa có nhiệm vụ sắp tới
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
