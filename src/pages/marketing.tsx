import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Play, Pause, Settings, BarChart3, Users, Mail, MessageSquare, Facebook, Linkedin, Chrome, TrendingUp, Target, Send, Eye, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate, formatPercentage } from "@/lib/formatters";

export default function Marketing() {
  const [filters, setFilters] = useState({
    status: "",
    channel: "",
    search: "",
    page: 1,
  });
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [showCampaignForm, setShowCampaignForm] = useState(false);

  const queryClient = useQueryClient();

  const { data: marketingData, isLoading } = useQuery({
    queryKey: ["/api/marketing", filters],
  });

  // Dữ liệu mẫu Marketing & Automation cho CRM ViLead
  const sampleData = {
    campaigns: [
      {
        id: 1,
        name: "CRM Summer Sale 2024",
        type: "Khuyến mãi",
        channel: "Facebook Ads",
        status: "Đang chạy",
        budget: 50000000,
        spent: 32000000,
        startDate: "2024-05-01",
        endDate: "2024-05-31",
        leads: 145,
        conversions: 28,
        conversionRate: 19.3,
        costPerLead: 220690,
        roi: 340,
        target: "SME, Startup",
        description: "Chiến dịch khuyến mãi mùa hè với giảm giá 30% cho gói CRM Premium"
      },
      {
        id: 2,
        name: "Enterprise Package Promo",
        type: "B2B Marketing",
        channel: "LinkedIn",
        status: "Đang chạy",
        budget: 40000000,
        spent: 38000000,
        startDate: "2024-05-10",
        endDate: "2024-06-10",
        leads: 89,
        conversions: 22,
        conversionRate: 24.7,
        costPerLead: 426966,
        roi: 280,
        target: "Enterprise, Tập đoàn",
        description: "Tập trung vào các doanh nghiệp lớn với gói Enterprise"
      },
      {
        id: 3,
        name: "Email Nurturing Series",
        type: "Email Marketing",
        channel: "Email",
        status: "Hoàn thành",
        budget: 8000000,
        spent: 7500000,
        startDate: "2024-04-01",
        endDate: "2024-04-30",
        leads: 234,
        conversions: 45,
        conversionRate: 19.2,
        costPerLead: 32051,
        roi: 450,
        target: "Leads hiện có",
        description: "Chuỗi email nuôi dưỡng leads trong 30 ngày"
      },
      {
        id: 4,
        name: "Google Ads - CRM Keywords",
        type: "SEM",
        channel: "Google Ads",
        status: "Tạm dừng",
        budget: 25000000,
        spent: 18000000,
        startDate: "2024-03-15",
        endDate: "2024-05-15",
        leads: 167,
        conversions: 31,
        conversionRate: 18.6,
        costPerLead: 107784,
        roi: 210,
        target: "Tìm kiếm CRM",
        description: "Quảng cáo Google cho các từ khóa liên quan đến CRM"
      }
    ],
    automations: [
      {
        id: 1,
        name: "Welcome New Leads",
        trigger: "Lead mới đăng ký",
        status: "Đang hoạt động",
        actions: ["Gửi email chào mừng", "Phân công Sales", "Tạo công việc follow-up"],
        leads: 89,
        conversions: 23,
        lastTriggered: "2024-05-27T14:30:00Z"
      },
      {
        id: 2,
        name: "Demo Booking Follow-up",
        trigger: "Sau khi book demo 24h",
        status: "Đang hoạt động",
        actions: ["Gửi email xác nhận", "SMS nhắc nhở", "Cập nhật lead stage"],
        leads: 45,
        conversions: 18,
        lastTriggered: "2024-05-27T10:15:00Z"
      },
      {
        id: 3,
        name: "Abandoned Cart Recovery",
        trigger: "Bỏ giữa chừng pricing page",
        status: "Đang hoạt động",
        actions: ["Email ưu đãi đặc biệt", "Retargeting ads", "Gọi điện tư vấn"],
        leads: 67,
        conversions: 12,
        lastTriggered: "2024-05-27T16:45:00Z"
      },
      {
        id: 4,
        name: "VIP Customer Care",
        trigger: "Khách hàng VIP không hoạt động 30 ngày",
        status: "Tạm dừng",
        actions: ["Email check-in", "Gọi điện chăm sóc", "Gửi quà tặng"],
        leads: 12,
        conversions: 8,
        lastTriggered: "2024-05-20T09:00:00Z"
      }
    ],
    analytics: {
      totalSpent: 95500000,
      totalLeads: 635,
      totalConversions: 126,
      averageROI: 320,
      topChannels: [
        { name: "Facebook Ads", leads: 234, cost: 42000000, conversions: 50 },
        { name: "Email Marketing", leads: 189, cost: 12000000, conversions: 45 },
        { name: "Google Ads", leads: 145, cost: 25000000, conversions: 31 },
        { name: "LinkedIn", leads: 67, cost: 16500000, conversions: 22 }
      ]
    }
  };

  const data = marketingData || sampleData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang chạy': return 'bg-green-100 text-green-800';
      case 'Đang hoạt động': return 'bg-green-100 text-green-800';
      case 'Tạm dừng': return 'bg-yellow-100 text-yellow-800';
      case 'Hoàn thành': return 'bg-blue-100 text-blue-800';
      case 'Đã dừng': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'Facebook Ads': return <Facebook className="w-4 h-4 text-blue-600" />;
      case 'LinkedIn': return <Linkedin className="w-4 h-4 text-blue-800" />;
      case 'Google Ads': return <Chrome className="w-4 h-4 text-green-600" />;
      case 'Email': return <Mail className="w-4 h-4 text-purple-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-900">Marketing & Automation</h1>
          <p className="text-gray-600">Quản lý chiến dịch marketing và tự động hóa quy trình chăm sóc leads</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Phân tích
          </Button>
          <Button onClick={() => setShowCampaignForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo chiến dịch
          </Button>
        </div>
      </div>

      {/* Marketing Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tổng chi phí</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.analytics.totalSpent)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+8.2% vs tháng trước</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Leads generated</p>
                <p className="text-2xl font-bold text-gray-900">{data.analytics.totalLeads}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+15.3% vs tháng trước</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Conversions</p>
                <p className="text-2xl font-bold text-gray-900">{data.analytics.totalConversions}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">CR: {formatPercentage((data.analytics.totalConversions / data.analytics.totalLeads) * 100)}</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">ROI trung bình</p>
                <p className="text-2xl font-bold text-gray-900">{data.analytics.averageROI}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12.1% vs tháng trước</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Chiến dịch Marketing</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích kênh</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Tìm kiếm chiến dịch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm theo tên chiến dịch..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="Đang chạy">Đang chạy</option>
                  <option value="Tạm dừng">Tạm dừng</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đã dừng">Đã dừng</option>
                </select>
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.channel}
                  onChange={(e) => setFilters(prev => ({ ...prev, channel: e.target.value }))}
                >
                  <option value="">Tất cả kênh</option>
                  <option value="Facebook Ads">Facebook Ads</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Email">Email Marketing</option>
                </select>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Tùy chỉnh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.campaigns.map((campaign: any) => (
              <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getChannelIcon(campaign.channel)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                        <p className="text-sm text-gray-500">{campaign.type} • {campaign.channel}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedCampaign(campaign)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          {campaign.status === 'Đang chạy' ? (
                            <DropdownMenuItem>
                              <Pause className="w-4 h-4 mr-2" />
                              Tạm dừng
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <Play className="w-4 h-4 mr-2" />
                              Kích hoạt
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{campaign.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Ngân sách</p>
                      <p className="font-semibold">{formatCurrency(campaign.budget)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Đã chi</p>
                      <p className="font-semibold">{formatCurrency(campaign.spent)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Leads</p>
                      <p className="font-semibold text-blue-600">{campaign.leads}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Conversions</p>
                      <p className="font-semibold text-green-600">{campaign.conversions}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500">CR: {formatPercentage(campaign.conversionRate)}</span>
                      <span className="text-gray-500">ROI: {campaign.roi}%</span>
                    </div>
                    <span className="text-gray-500">{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Đã sử dụng {formatPercentage((campaign.spent / campaign.budget) * 100)} ngân sách
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.automations.map((automation: any) => (
              <Card key={automation.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{automation.name}</h3>
                      <p className="text-sm text-gray-500">Trigger: {automation.trigger}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(automation.status)}>
                        {automation.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          {automation.status === 'Đang hoạt động' ? (
                            <DropdownMenuItem>
                              <Pause className="w-4 h-4 mr-2" />
                              Tạm dừng
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <Play className="w-4 h-4 mr-2" />
                              Kích hoạt
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <p className="text-sm font-medium text-gray-700">Hành động tự động:</p>
                    <div className="space-y-2">
                      {automation.actions.map((action: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Leads xử lý</p>
                      <p className="font-semibold text-blue-600">{automation.leads}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Conversions</p>
                      <p className="font-semibold text-green-600">{automation.conversions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tỷ lệ thành công</p>
                      <p className="font-semibold">{formatPercentage((automation.conversions / automation.leads) * 100)}</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Lần cuối chạy: {formatDate(automation.lastTriggered)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Tạo Automation mới</span>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Tự động hóa quy trình chăm sóc leads và khách hàng để tăng hiệu quả kinh doanh.
                Tạo automation mới để xử lý các tình huống như welcome leads, follow-up, nurturing...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hiệu quả theo kênh Marketing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.analytics.topChannels.map((channel: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getChannelIcon(channel.name)}
                        <h3 className="font-semibold">{channel.name}</h3>
                      </div>
                      <Badge variant="outline">
                        ROI: {((channel.conversions * 50000000 - channel.cost) / channel.cost * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Leads</p>
                        <p className="text-xl font-bold text-blue-600">{channel.leads}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Conversions</p>
                        <p className="text-xl font-bold text-green-600">{channel.conversions}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Chi phí</p>
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(channel.cost)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">CPL</p>
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(channel.cost / channel.leads)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Conversion Rate</span>
                        <span>{formatPercentage((channel.conversions / channel.leads) * 100)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(channel.conversions / channel.leads) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Campaign Detail Dialog */}
      {selectedCampaign && (
        <Dialog open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                {getChannelIcon(selectedCampaign.channel)}
                <div>
                  <h2 className="text-xl font-bold">{selectedCampaign.name}</h2>
                  <p className="text-gray-600">{selectedCampaign.type} • {selectedCampaign.channel}</p>
                </div>
                <Badge className={getStatusColor(selectedCampaign.status)}>
                  {selectedCampaign.status}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin chiến dịch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mô tả</label>
                    <p className="text-gray-900">{selectedCampaign.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Đối tượng mục tiêu</label>
                    <p className="text-gray-900">{selectedCampaign.target}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Thời gian chạy</label>
                    <p className="text-gray-900">{formatDate(selectedCampaign.startDate)} - {formatDate(selectedCampaign.endDate)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hiệu quả & Thống kê</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ngân sách / Đã chi</label>
                    <p className="text-gray-900">{formatCurrency(selectedCampaign.budget)} / {formatCurrency(selectedCampaign.spent)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Leads / Conversions</label>
                    <p className="text-gray-900">{selectedCampaign.leads} / {selectedCampaign.conversions}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Conversion Rate</label>
                    <p className="text-gray-900">{formatPercentage(selectedCampaign.conversionRate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">ROI</label>
                    <p className="text-2xl font-bold text-green-600">{selectedCampaign.roi}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}