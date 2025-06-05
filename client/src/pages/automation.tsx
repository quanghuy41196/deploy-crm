import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Zap, Mail, UserPlus, Bell, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Automation() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: automationRules, isLoading } = useQuery({
    queryKey: ["/api/automation/rules"],
  });

  const toggleRuleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const response = await fetch(`/api/automation/rules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive }),
      });
      if (!response.ok) throw new Error("Failed to toggle rule");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/automation/rules"] });
      toast({
        title: "Thành công",
        description: "Đã cập nhật quy tắc tự động hóa",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật quy tắc",
        variant: "destructive",
      });
    },
  });

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'lead_created':
        return <UserPlus className="w-4 h-4" />;
      case 'lead_assigned':
        return <UserPlus className="w-4 h-4" />;
      case 'stage_changed':
        return <Settings className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getTriggerLabel = (trigger: string) => {
    const labels = {
      'lead_created': 'Lead mới được tạo',
      'lead_assigned': 'Lead được phân bổ',
      'stage_changed': 'Thay đổi giai đoạn',
      'order_created': 'Đơn hàng mới',
    };
    return labels[trigger as keyof typeof labels] || trigger;
  };

  const getActionIcon = (actions: any[]) => {
    if (actions.some(action => action.type === 'send_email')) {
      return <Mail className="w-4 h-4" />;
    }
    if (actions.some(action => action.type === 'send_notification')) {
      return <Bell className="w-4 h-4" />;
    }
    return <Zap className="w-4 h-4" />;
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
          <h1 className="text-2xl font-bold text-gray-900">Tự động hóa</h1>
          <p className="text-gray-600 mt-1">Thiết lập quy tắc tự động để tối ưu quy trình làm việc</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo quy tắc mới
        </Button>
      </div>

      {/* Automation Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Mẫu tự động hóa phổ biến</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Mail className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium mb-1">Email chào mừng</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Gửi email chào mừng khi có lead mới
                </p>
                <Button variant="outline" size="sm">
                  Sử dụng mẫu
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <UserPlus className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium mb-1">Phân bổ tự động</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Tự động phân bổ lead cho sales theo khu vực
                </p>
                <Button variant="outline" size="sm">
                  Sử dụng mẫu
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 text-center">
                <Bell className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium mb-1">Nhắc nhở follow-up</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Nhắc nhở gọi lại lead sau 3 ngày
                </p>
                <Button variant="outline" size="sm">
                  Sử dụng mẫu
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Active Automation Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Quy tắc tự động hóa ({automationRules?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automationRules?.length > 0 ? (
              automationRules.map((rule: any) => (
                <Card key={rule.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            {getTriggerIcon(rule.trigger)}
                            <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                          </div>
                          <Badge variant={rule.isActive ? "default" : "secondary"}>
                            {rule.isActive ? "Hoạt động" : "Tạm dừng"}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Kích hoạt:</span>
                            <span>{getTriggerLabel(rule.trigger)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getActionIcon(rule.actions || [])}
                            <span>
                              {rule.actions?.length || 0} hành động
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={(checked) => 
                            toggleRuleMutation.mutate({ id: rule.id, isActive: checked })
                          }
                          disabled={toggleRuleMutation.isPending}
                        />
                        <Button variant="outline" size="sm">
                          Chỉnh sửa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có quy tắc tự động hóa
                </h3>
                <p className="text-gray-500 mb-4">
                  Bắt đầu tạo quy tắc đầu tiên để tự động hóa quy trình làm việc
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo quy tắc đầu tiên
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Automation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Email đã gửi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-gray-500">Trong 30 ngày qua</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Lead đã phân bổ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">567</div>
            <p className="text-xs text-gray-500">Tự động phân bổ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Thời gian tiết kiệm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45h</div>
            <p className="text-xs text-gray-500">Ước tính mỗi tháng</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
