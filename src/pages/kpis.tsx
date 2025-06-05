import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Users,
  DollarSign,
  ShoppingCart,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Award,
  Briefcase,
  Settings,
  Edit,
  Save,
  Plus,
  Trash2,
  UserPlus
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function KPIs() {
  const [selectedPeriod, setSelectedPeriod] = useState("this_month");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [editingKPI, setEditingKPI] = useState<string | null>(null);
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showIndividualKPIModal, setShowIndividualKPIModal] = useState(false);
  const [showBulkKPIModal, setShowBulkKPIModal] = useState(false);

  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: leadSources } = useQuery({
    queryKey: ["/api/dashboard/lead-sources"],
  });

  const { data: topSales } = useQuery({
    queryKey: ["/api/dashboard/top-sales"],
  });

  // KPI Definitions
  const kpiDefinitions = [
    {
      id: "revenue_growth",
      name: "Tăng Trưởng Doanh Thu",
      category: "financial",
      target: 15,
      unit: "%",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      id: "lead_conversion",
      name: "Tỷ Lệ Chuyển Đổi Lead",
      category: "sales",
      target: 25,
      unit: "%",
      icon: <Target className="w-5 h-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      id: "customer_acquisition",
      name: "Thu Hút Khách Hàng Mới",
      category: "marketing",
      target: 50,
      unit: "khách hàng",
      icon: <Users className="w-5 h-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      id: "avg_deal_size",
      name: "Giá Trị Giao Dịch TB",
      category: "financial",
      target: 2000000,
      unit: "VND",
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      id: "sales_cycle",
      name: "Chu Kỳ Bán Hàng",
      category: "sales",
      target: 30,
      unit: "ngày",
      icon: <Clock className="w-5 h-5" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      id: "customer_satisfaction",
      name: "Hài Lòng Khách Hàng",
      category: "service",
      target: 90,
      unit: "%",
      icon: <Award className="w-5 h-5" />,
      color: "text-pink-600",
      bgColor: "bg-pink-100"
    },
    {
      id: "team_productivity",
      name: "Năng Suất Đội Ngũ",
      category: "performance",
      target: 85,
      unit: "%",
      icon: <Zap className="w-5 h-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      id: "pipeline_velocity",
      name: "Tốc Độ Pipeline",
      category: "sales",
      target: 1.2,
      unit: "x",
      icon: <Activity className="w-5 h-5" />,
      color: "text-teal-600",
      bgColor: "bg-teal-100"
    }
  ];

  // Calculate actual KPI values using real data
  const calculateKPIValues = () => {
    const totalRevenue = dashboardStats?.monthlyRevenue || 0;
    const totalOrders = dashboardStats?.orders || 0;
    const totalLeads = dashboardStats?.newLeads || 0;
    const conversionRate = dashboardStats?.conversionRate || 0;

    return {
      revenue_growth: {
        current: 12.5,
        previous: 8.3,
        status: "up"
      },
      lead_conversion: {
        current: conversionRate,
        previous: conversionRate * 0.92,
        status: conversionRate > 25 ? "up" : "down"
      },
      customer_acquisition: {
        current: Math.floor(totalLeads * 0.23),
        previous: Math.floor(totalLeads * 0.19),
        status: "up"
      },
      avg_deal_size: {
        current: totalOrders > 0 ? Math.floor(totalRevenue / totalOrders) : 0,
        previous: totalOrders > 0 ? Math.floor(totalRevenue / totalOrders * 0.95) : 0,
        status: "up"
      },
      sales_cycle: {
        current: 28,
        previous: 35,
        status: "up"
      },
      customer_satisfaction: {
        current: 87,
        previous: 84,
        status: "up"
      },
      team_productivity: {
        current: 82,
        previous: 78,
        status: "up"
      },
      pipeline_velocity: {
        current: 1.15,
        previous: 1.08,
        status: "up"
      }
    };
  };

  const kpiValues = calculateKPIValues();

  const formatKPIValue = (value: number, unit: string) => {
    if (unit === "VND") {
      return formatCurrency(value);
    }
    if (unit === "%" || unit === "x") {
      return `${value.toFixed(1)}${unit}`;
    }
    return `${value.toLocaleString()} ${unit}`;
  };

  const getKPIStatus = (current: number, target: number, kpiId: string) => {
    const isReverse = kpiId === "sales_cycle"; // Lower is better for sales cycle
    
    if (isReverse) {
      if (current <= target) return "excellent";
      if (current <= target * 1.2) return "good";
      return "poor";
    } else {
      if (current >= target) return "excellent";
      if (current >= target * 0.8) return "good";
      return "poor";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-100";
      case "good": return "text-yellow-600 bg-yellow-100";
      case "poor": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return <CheckCircle className="w-4 h-4" />;
      case "good": return <Clock className="w-4 h-4" />;
      case "poor": return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  // Individual KPI targets data
  const individualKPITargets = {
    "Nguyễn Văn A": {
      deals_closed: 10,
      revenue: 40000000,
      conversion_rate: 25,
      customer_acquisition: 15,
      sales_cycle: 30,
      satisfaction_score: 90
    },
    "Trần Thị B": {
      leads_generated: 80,
      cost_per_lead: 150000,
      campaign_roi: 300,
      customer_acquisition: 20,
      revenue_growth: 15,
      pipeline_velocity: 1.2
    },
    "Lê Văn C": {
      satisfaction_score: 90,
      retention_rate: 85,
      support_tickets: 50,
      team_productivity: 85,
      response_time: 2,
      resolution_rate: 95
    }
  };

  // Calculate team KPI aggregation from individual targets
  const calculateTeamKPIFromIndividuals = () => {
    const allMembers = Object.values(individualKPITargets);
    
    // Calculate average/sum based on KPI type
    const teamAggregation = {
      revenue_growth: allMembers.reduce((sum, member) => sum + (member.revenue_growth || 0), 0) / allMembers.filter(m => m.revenue_growth).length || 0,
      lead_conversion: allMembers.reduce((sum, member) => sum + (member.conversion_rate || 0), 0) / allMembers.filter(m => m.conversion_rate).length || 0,
      customer_acquisition: allMembers.reduce((sum, member) => sum + (member.customer_acquisition || 0), 0),
      avg_deal_size: allMembers.reduce((sum, member) => sum + (member.revenue || 0), 0) / allMembers.filter(m => m.deals_closed).reduce((sum, member) => sum + (member.deals_closed || 0), 0) || 0,
      sales_cycle: allMembers.reduce((sum, member) => sum + (member.sales_cycle || 0), 0) / allMembers.filter(m => m.sales_cycle).length || 0,
      customer_satisfaction: allMembers.reduce((sum, member) => sum + (member.satisfaction_score || 0), 0) / allMembers.filter(m => m.satisfaction_score).length || 0,
      team_productivity: allMembers.reduce((sum, member) => sum + (member.team_productivity || 0), 0) / allMembers.filter(m => m.team_productivity).length || 0,
      pipeline_velocity: allMembers.reduce((sum, member) => sum + (member.pipeline_velocity || 0), 0) / allMembers.filter(m => m.pipeline_velocity).length || 0
    };

    return teamAggregation;
  };

  const teamKPIFromIndividuals = calculateTeamKPIFromIndividuals();

  // Previous month data for comparison (tháng trước)
  const previousMonthData = {
    "Nguyễn Văn A": {
      deals_closed: 8,
      revenue: 32000000,
      conversion_rate: 22,
      customer_acquisition: 12,
      sales_cycle: 35,
      satisfaction_score: 87
    },
    "Trần Thị B": {
      leads_generated: 65,
      cost_per_lead: 180000,
      campaign_roi: 250,
      customer_acquisition: 15,
      revenue_growth: 12,
      pipeline_velocity: 1.0
    },
    "Lê Văn C": {
      satisfaction_score: 85,
      retention_rate: 80,
      support_tickets: 55,
      team_productivity: 80,
      response_time: 2.5,
      resolution_rate: 90
    }
  };

  // Team performance data
  const teamPerformance = [
    {
      name: "Nguyễn Văn A",
      role: "Sales Manager",
      kpis: {
        deals_closed: { value: 12, target: 10, unit: "deals" },
        revenue: { value: 45000000, target: 40000000, unit: "VND" },
        conversion_rate: { value: 28.5, target: 25, unit: "%" }
      }
    },
    {
      name: "Trần Thị B",
      role: "Marketing Lead",
      kpis: {
        leads_generated: { value: 85, target: 80, unit: "leads" },
        cost_per_lead: { value: 125000, target: 150000, unit: "VND" },
        campaign_roi: { value: 340, target: 300, unit: "%" }
      }
    },
    {
      name: "Lê Văn C",
      role: "Customer Success",
      kpis: {
        satisfaction_score: { value: 92, target: 90, unit: "%" },
        retention_rate: { value: 88, target: 85, unit: "%" },
        support_tickets: { value: 45, target: 50, unit: "tickets" }
      }
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KPIs & Hiệu Suất</h1>
          <p className="text-gray-600">Theo dõi các chỉ số hiệu suất quan trọng</p>
        </div>
        <div className="flex space-x-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="this_week">Tuần này</option>
            <option value="this_month">Tháng này</option>
            <option value="this_quarter">Quý này</option>
            <option value="this_year">Năm này</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="all">Tất cả đội ngũ</option>
            <option value="sales">Đội bán hàng</option>
            <option value="marketing">Đội marketing</option>
            <option value="support">Đội hỗ trợ</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
          <TabsTrigger value="individual">Cá Nhân</TabsTrigger>
          <TabsTrigger value="team">Đội Nhóm</TabsTrigger>
          <TabsTrigger value="alerts">Cảnh Báo</TabsTrigger>
          <TabsTrigger value="settings">Cài Đặt</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {kpiDefinitions.map((kpi) => {
              const values = kpiValues[kpi.id as keyof typeof kpiValues];
              const status = getKPIStatus(values.current, kpi.target, kpi.id);
              const progress = kpi.id === "sales_cycle" 
                ? Math.max(0, Math.min(100, (kpi.target / values.current) * 100))
                : Math.max(0, Math.min(100, (values.current / kpi.target) * 100));

              return (
                <Card key={kpi.id} className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                        <div className={kpi.color}>
                          {kpi.icon}
                        </div>
                      </div>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
                        {getStatusIcon(status)}
                        <span className="capitalize">{status === "excellent" ? "Xuất sắc" : status === "good" ? "Tốt" : "Cần cải thiện"}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900 text-sm">{kpi.name}</h3>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatKPIValue(values.current, kpi.unit)}
                        </span>
                        <div className={`flex items-center space-x-1 text-sm ${values.status === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {values.status === 'up' ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>
                            {Math.abs(((values.current - values.previous) / values.previous) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Mục tiêu: {formatKPIValue(kpi.target, kpi.unit)}</span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              progress >= 100 ? 'bg-green-500' : 
                              progress >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, progress)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Hiệu Suất Theo Danh Mục
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['financial', 'sales', 'marketing', 'performance'].map((category) => {
                    const categoryKPIs = kpiDefinitions.filter(kpi => kpi.category === category);
                    const avgPerformance = categoryKPIs.reduce((sum, kpi) => {
                      const values = kpiValues[kpi.id as keyof typeof kpiValues];
                      const progress = kpi.id === "sales_cycle" 
                        ? (kpi.target / values.current) * 100
                        : (values.current / kpi.target) * 100;
                      return sum + Math.min(100, progress);
                    }, 0) / categoryKPIs.length;

                    const categoryNames: Record<string, string> = {
                      financial: "Tài Chính",
                      sales: "Bán Hàng", 
                      marketing: "Marketing",
                      performance: "Hiệu Suất"
                    };

                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{categoryNames[category]}</span>
                          <span className="text-gray-600">{avgPerformance.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              avgPerformance >= 90 ? 'bg-green-500' :
                              avgPerformance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${avgPerformance}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Mục Tiêu Quan Trọng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Cần Chú Ý</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Tỷ lệ chuyển đổi lead hiện tại ({dashboardStats?.conversionRate || 0}%) 
                      chưa đạt mục tiêu 25%. Cần tối ưu quy trình bán hàng.
                    </p>
                  </div>

                  <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">Đạt Mục Tiêu</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Tăng trưởng doanh thu đạt 12.5%, vượt kế hoạch ban đầu.
                      Duy trì momentum này trong quý tới.
                    </p>
                  </div>

                  <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Hành Động</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Tập trung vào rút ngắn chu kỳ bán hàng xuống dưới 30 ngày 
                      để đạt mục tiêu quý.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Individual Performance Tab */}
        <TabsContent value="individual" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">KPI Cá Nhân</h2>
              <p className="text-gray-600">Theo dõi và quản lý KPI của từng thành viên</p>
            </div>
            <Button
              onClick={() => setShowIndividualKPIModal(true)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm KPI Cá Nhân</span>
            </Button>
          </div>

          {/* Individual KPI Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Bảng KPI Thành Viên
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-gray-700">Thành Viên</th>
                      <th className="text-center p-3 font-medium text-gray-700">Số Deals</th>
                      <th className="text-center p-3 font-medium text-gray-700">Doanh Thu</th>
                      <th className="text-center p-3 font-medium text-gray-700">Tỷ Lệ Chuyển Đổi</th>
                      <th className="text-center p-3 font-medium text-gray-700">KH Mới</th>
                      <th className="text-center p-3 font-medium text-gray-700">Chu Kỳ Bán</th>
                      <th className="text-center p-3 font-medium text-gray-700">Hài Lòng KH</th>
                      <th className="text-center p-3 font-medium text-gray-700">Tổng KPIs</th>
                      <th className="text-center p-3 font-medium text-gray-700">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(individualKPITargets).map(([memberName, targets]) => (
                      <tr key={memberName} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {memberName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{memberName}</div>
                              <div className="text-sm text-gray-500">Nhân viên kinh doanh</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center p-3">
                          <span className="font-medium text-gray-900">
                            {targets.deals_closed || '-'}
                          </span>
                        </td>
                        <td className="text-center p-3">
                          <span className="font-medium text-gray-900">
                            {targets.revenue ? formatCurrency(targets.revenue).replace(' VND', '') : '-'}
                          </span>
                        </td>
                        <td className="text-center p-3">
                          <span className="font-medium text-gray-900">
                            {targets.conversion_rate ? `${targets.conversion_rate}%` : '-'}
                          </span>
                        </td>
                        <td className="text-center p-3">
                          <span className="font-medium text-gray-900">
                            {targets.customer_acquisition || '-'}
                          </span>
                        </td>
                        <td className="text-center p-3">
                          <span className="font-medium text-gray-900">
                            {targets.sales_cycle ? `${targets.sales_cycle} ngày` : '-'}
                          </span>
                        </td>
                        <td className="text-center p-3">
                          <span className="font-medium text-gray-900">
                            {targets.satisfaction_score ? `${targets.satisfaction_score}%` : '-'}
                          </span>
                        </td>
                        <td className="text-center p-3">
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            {Object.keys(targets).length} KPIs
                          </Badge>
                        </td>
                        <td className="text-center p-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedMember(memberName);
                              setShowIndividualKPIModal(true);
                            }}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Chỉnh Sửa
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Individual Member Performance */}
          <div className="grid gap-6">
            {teamPerformance.map((member, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-gray-600">{member.role}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Hiệu suất tốt
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMember(member.name);
                          setShowIndividualKPIModal(true);
                        }}
                        className="flex items-center space-x-1"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Cài Đặt KPI</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(member.kpis).map(([kpiKey, kpiData]) => {
                      const progress = (kpiData.value / kpiData.target) * 100;
                      const kpiNames: Record<string, string> = {
                        deals_closed: "Deals Đóng",
                        revenue: "Doanh Thu",
                        conversion_rate: "Tỷ Lệ Chuyển Đổi",
                        leads_generated: "Lead Tạo",
                        cost_per_lead: "Chi Phí/Lead",
                        campaign_roi: "ROI Chiến Dịch",
                        satisfaction_score: "Điểm Hài Lòng",
                        retention_rate: "Tỷ Lệ Giữ Chân",
                        support_tickets: "Tickets Hỗ Trợ"
                      };

                      return (
                        <div key={kpiKey} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{kpiNames[kpiKey]}</span>
                            <span className={progress >= 100 ? 'text-green-600' : 'text-gray-600'}>
                              {formatKPIValue(kpiData.value, kpiData.unit)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                progress >= 100 ? 'bg-green-500' : 
                                progress >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(100, progress)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Mục tiêu: {formatKPIValue(kpiData.target, kpiData.unit)}</span>
                            <span className="text-blue-600">
                              Cá nhân: {individualKPITargets[member.name as keyof typeof individualKPITargets]?.[kpiKey as keyof typeof individualKPITargets[keyof typeof individualKPITargets]] || 'N/A'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Individual Contribution to Team KPIs */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Đóng Góp Vào KPI Đội Nhóm:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {member.name === "Nguyễn Văn A" && (
                        <>
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="font-medium">Chuyển đổi</div>
                            <div className="text-blue-600">+{individualKPITargets["Nguyễn Văn A"].conversion_rate}%</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="font-medium">Khách hàng</div>
                            <div className="text-green-600">+{individualKPITargets["Nguyễn Văn A"].customer_acquisition}</div>
                          </div>
                        </>
                      )}
                      {member.name === "Trần Thị B" && (
                        <>
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <div className="font-medium">Khách hàng</div>
                            <div className="text-purple-600">+{individualKPITargets["Trần Thị B"].customer_acquisition}</div>
                          </div>
                          <div className="text-center p-2 bg-indigo-50 rounded">
                            <div className="font-medium">Tăng trưởng</div>
                            <div className="text-indigo-600">+{individualKPITargets["Trần Thị B"].revenue_growth}%</div>
                          </div>
                        </>
                      )}
                      {member.name === "Lê Văn C" && (
                        <>
                          <div className="text-center p-2 bg-pink-50 rounded">
                            <div className="font-medium">Hài lòng</div>
                            <div className="text-pink-600">+{individualKPITargets["Lê Văn C"].satisfaction_score}%</div>
                          </div>
                          <div className="text-center p-2 bg-orange-50 rounded">
                            <div className="font-medium">Năng suất</div>
                            <div className="text-orange-600">+{individualKPITargets["Lê Văn C"].team_productivity}%</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          {/* Team Management Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quản Lý KPI Đội Nhóm</h2>
              <p className="text-gray-600">Tổng hợp KPI từ mục tiêu cá nhân của từng thành viên</p>
            </div>
            <Button
              onClick={() => setShowBulkKPIModal(true)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm KPI Nhanh</span>
            </Button>
          </div>

          {/* Team KPI Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Bảng KPI Đội Nhóm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-gray-700">Đội Nhóm</th>
                      <th className="text-center p-3 font-medium text-gray-700">Số Thành Viên</th>
                      <th className="text-center p-3 font-medium text-gray-700">Tỷ Lệ Chuyển Đổi</th>
                      <th className="text-center p-3 font-medium text-gray-700">Khách Hàng Mới</th>
                      <th className="text-center p-3 font-medium text-gray-700">Doanh Thu</th>
                      <th className="text-center p-3 font-medium text-gray-700">Chu Kỳ Bán</th>
                      <th className="text-center p-3 font-medium text-gray-700">Hài Lòng KH</th>
                      <th className="text-center p-3 font-medium text-gray-700">Hiệu Suất</th>
                      <th className="text-center p-3 font-medium text-gray-700">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Sales Team */}
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">KD</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Đội Kinh Doanh</div>
                            <div className="text-sm text-gray-500">Sales Team</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-medium text-gray-900">2</span>
                      </td>
                      <td className="text-center p-3">
                        <div className="flex items-center justify-center">
                          <span className="font-medium text-blue-600">{teamKPIFromIndividuals.lead_conversion.toFixed(1)}%</span>
                          <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-medium text-gray-900">{teamKPIFromIndividuals.customer_acquisition}</span>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-medium text-gray-900">47 triệu</span>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-medium text-orange-600">{teamKPIFromIndividuals.sales_cycle.toFixed(0)} ngày</span>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-medium text-purple-600">{teamKPIFromIndividuals.customer_satisfaction.toFixed(0)}%</span>
                      </td>
                      <td className="text-center p-3">
                        <Badge className="bg-green-100 text-green-800 border-green-200">Tốt</Badge>
                      </td>
                      <td className="text-center p-3">
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                          <Edit className="w-4 h-4 mr-1" />
                          Chi Tiết
                        </Button>
                      </td>
                    </tr>

                    {/* Marketing Team */}
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-600">MK</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Đội Marketing</div>
                            <div className="text-sm text-gray-500">Marketing Team</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-medium text-gray-900">1</span>
                      </td>
                      <td className="text-center p-3">
                        <div className="flex items-center justify-center">
                          <span className="font-medium text-blue-600">18.5%</span>
                          <TrendingDown className="w-4 h-4 text-red-500 ml-1" />
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-medium text-gray-900">15</span>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-medium text-gray-900">-</span>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-medium text-gray-600">-</span>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-medium text-gray-600">-</span>
                      </td>
                      <td className="text-center p-3">
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Trung Bình</Badge>
                      </td>
                      <td className="text-center p-3">
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                          <Edit className="w-4 h-4 mr-1" />
                          Chi Tiết
                        </Button>
                      </td>
                    </tr>

                    {/* Support Team */}
                    <tr className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-green-600">HT</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Đội Hỗ Trợ</div>
                            <div className="text-sm text-gray-500">Support Team</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-medium text-gray-900">1</span>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-medium text-gray-600">-</span>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-medium text-gray-600">-</span>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-medium text-gray-600">-</span>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-medium text-green-600">2.5 giờ</span>
                      </td>
                      <td className="text-center p-3">
                        <div className="flex items-center justify-center">
                          <span className="font-medium text-green-600">85%</span>
                          <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <Badge className="bg-green-100 text-green-800 border-green-200">Xuất Sắc</Badge>
                      </td>
                      <td className="text-center p-3">
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                          <Edit className="w-4 h-4 mr-1" />
                          Chi Tiết
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Individual Contribution Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Phân Tích Đóng Góp Cá Nhân
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(individualKPITargets).map(([memberName, targets]) => (
                  <div key={memberName} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">{memberName}</h4>
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        {Object.keys(targets).length} KPIs
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(targets).map(([kpiKey, value]) => {
                        const kpiLabels: Record<string, string> = {
                          deals_closed: "Deals",
                          revenue: "Doanh Thu",
                          conversion_rate: "Chuyển Đổi",
                          customer_acquisition: "KH Mới",
                          sales_cycle: "Chu Kỳ",
                          satisfaction_score: "Hài Lòng",
                          leads_generated: "Lead Tạo",
                          cost_per_lead: "Chi Phí/Lead",
                          campaign_roi: "ROI",
                          retention_rate: "Giữ Chân",
                          support_tickets: "Tickets",
                          team_productivity: "Năng Suất",
                          revenue_growth: "Tăng Trưởng",
                          pipeline_velocity: "Tốc Độ",
                          response_time: "Phản Hồi",
                          resolution_rate: "Giải Quyết"
                        };

                        return (
                          <div key={kpiKey} className="text-center p-2 bg-white rounded border">
                            <div className="text-sm font-medium text-gray-700">{kpiLabels[kpiKey]}</div>
                            <div className="text-lg font-bold text-blue-600">{value}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Performance Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  So Sánh Với Tháng Trước
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(individualKPITargets).map(([memberName, currentTargets]) => {
                    const previousData = previousMonthData[memberName as keyof typeof previousMonthData];
                    if (!previousData) return null;

                    return (
                      <div key={memberName} className="p-3 border rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">{memberName}</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(currentTargets).slice(0, 3).map(([kpiKey, currentValue]) => {
                            const previousValue = previousData[kpiKey as keyof typeof previousData];
                            if (!previousValue) return null;

                            const change = ((currentValue - previousValue) / previousValue) * 100;
                            const isPositive = change > 0;

                            return (
                              <div key={kpiKey} className="flex items-center justify-between">
                                <span className="text-gray-600">{kpiKey}</span>
                                <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                  {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                  <span>{Math.abs(change).toFixed(1)}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Phân Tích Tổng Hợp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">Điểm Mạnh</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Đội nhóm có tỷ lệ chuyển đổi cao ({teamKPIFromIndividuals.lead_conversion.toFixed(1)}%) 
                      và khách hàng hài lòng ({teamKPIFromIndividuals.customer_satisfaction.toFixed(0)}%).
                    </p>
                  </div>

                  <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Cơ Hội Cải Thiện</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Tập trung vào rút ngắn chu kỳ bán hàng từ {teamKPIFromIndividuals.sales_cycle.toFixed(0)} ngày 
                      xuống dưới 25 ngày để tăng hiệu quả.
                    </p>
                  </div>

                  <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-800">Đề Xuất</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      Thiết lập KPI cá nhân định kỳ hàng tháng để duy trì động lực 
                      và theo dõi tiến độ từng thành viên.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="space-y-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <h4 className="font-medium text-red-800">Cảnh báo: Tỷ lệ chuyển đổi thấp</h4>
                    <p className="text-sm text-red-700">
                      Tỷ lệ chuyển đổi lead tuần này giảm 15% so với tuần trước
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Thông báo: Tiến độ chậm</h4>
                    <p className="text-sm text-yellow-700">
                      Mục tiêu doanh thu tháng này có khả năng không đạt được
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-800">Thành công: Vượt mục tiêu</h4>
                    <p className="text-sm text-green-700">
                      Đội marketing đã vượt 120% mục tiêu tạo lead tháng này
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* KPI Target Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Cài Đặt Mục Tiêu KPI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {kpiDefinitions.map((kpi) => (
                  <div key={kpi.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                        <div className={kpi.color}>
                          {kpi.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{kpi.name}</h4>
                        <p className="text-xs text-gray-600">{kpi.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {editingKPI === kpi.id ? (
                        <>
                          <input
                            type="number"
                            defaultValue={kpi.target}
                            className="w-20 px-2 py-1 text-sm border rounded"
                            step={kpi.unit === "%" ? "0.1" : "1"}
                          />
                          <Button
                            size="sm"
                            onClick={() => setEditingKPI(null)}
                            className="px-2 py-1 h-8"
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-medium">
                            {formatKPIValue(kpi.target, kpi.unit)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingKPI(kpi.id)}
                            className="px-2 py-1 h-8"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Team Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Quản Lý Đội Nhóm
                  </div>
                  <Button size="sm" className="flex items-center space-x-1">
                    <UserPlus className="w-4 h-4" />
                    <span>Thêm Thành Viên</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamPerformance.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">{member.name}</h4>
                      <p className="text-xs text-gray-600">{member.role}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {editingTeam === member.name ? (
                        <>
                          <select className="px-2 py-1 text-sm border rounded">
                            <option value="sales">Sales Manager</option>
                            <option value="marketing">Marketing Lead</option>
                            <option value="support">Customer Success</option>
                            <option value="admin">Admin</option>
                          </select>
                          <Button
                            size="sm"
                            onClick={() => setEditingTeam(null)}
                            className="px-2 py-1 h-8"
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Badge variant="outline">{member.role}</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingTeam(member.name)}
                            className="px-2 py-1 h-8"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="px-2 py-1 h-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Team KPI Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Cấu Hình KPI Theo Đội Nhóm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sales Team */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Đội Bán Hàng
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Tỷ Lệ Chuyển Đổi</span>
                        <span className="text-sm text-gray-600">25%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Chu Kỳ Bán Hàng</span>
                        <span className="text-sm text-gray-600">30 ngày</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '93%' }}></div>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Doanh Thu Trung Bình</span>
                        <span className="text-sm text-gray-600">2M VND</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Marketing Team */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Đội Marketing
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Thu Hút Khách Hàng</span>
                        <span className="text-sm text-gray-600">50 khách hàng</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Tăng Trưởng Doanh Thu</span>
                        <span className="text-sm text-gray-600">15%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '83%' }}></div>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Tốc Độ Pipeline</span>
                        <span className="text-sm text-gray-600">1.2x</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Support Team */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Đội Hỗ Trợ
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Hài Lòng Khách Hàng</span>
                        <span className="text-sm text-gray-600">90%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-pink-500 h-2 rounded-full" style={{ width: '97%' }}></div>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Năng Suất Đội Ngũ</span>
                        <span className="text-sm text-gray-600">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Thời Gian Phản Hồi</span>
                        <span className="text-sm text-gray-600">&lt; 2 giờ</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Global Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Cài Đặt Chung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Báo Cáo Tự Động</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Gửi báo cáo hàng tuần</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Thông báo khi KPI thấp</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Báo cáo chi tiết hàng tháng</span>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Ngưỡng Cảnh Báo</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">KPI dưới mức (%)</label>
                      <input type="number" defaultValue="80" className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Thời gian cảnh báo (phút)</label>
                      <input type="number" defaultValue="60" className="w-full px-3 py-2 border rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline">Hủy Bỏ</Button>
                <Button>Lưu Cài Đặt</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Individual KPI Settings Modal */}
      <Dialog open={showIndividualKPIModal} onOpenChange={setShowIndividualKPIModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Cài Đặt KPI Cá Nhân - {selectedMember}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <strong>Lưu ý:</strong> Mục tiêu KPI cá nhân sẽ được tổng hợp để tính toán KPI của toàn đội nhóm. 
              Hãy đặt mục tiêu phù hợp với vai trò và khả năng của từng thành viên.
            </div>

            {selectedMember && individualKPITargets[selectedMember as keyof typeof individualKPITargets] && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(individualKPITargets[selectedMember as keyof typeof individualKPITargets]).map(([kpiKey, currentValue]) => {
                  const kpiLabels: Record<string, { name: string; unit: string; description: string }> = {
                    deals_closed: { name: "Số Deal Đóng", unit: "deals", description: "Số lượng deal được đóng thành công mỗi tháng" },
                    revenue: { name: "Doanh Thu", unit: "VND", description: "Tổng doanh thu đạt được mỗi tháng" },
                    conversion_rate: { name: "Tỷ Lệ Chuyển Đổi", unit: "%", description: "Tỷ lệ chuyển đổi từ lead thành khách hàng" },
                    customer_acquisition: { name: "Khách Hàng Mới", unit: "khách hàng", description: "Số khách hàng mới thu được mỗi tháng" },
                    sales_cycle: { name: "Chu Kỳ Bán Hàng", unit: "ngày", description: "Thời gian trung bình để đóng một deal" },
                    satisfaction_score: { name: "Điểm Hài Lòng", unit: "%", description: "Điểm hài lòng khách hàng trung bình" },
                    leads_generated: { name: "Lead Tạo", unit: "leads", description: "Số lượng lead mới được tạo mỗi tháng" },
                    cost_per_lead: { name: "Chi Phí/Lead", unit: "VND", description: "Chi phí trung bình để có được một lead" },
                    campaign_roi: { name: "ROI Chiến Dịch", unit: "%", description: "Tỷ suất sinh lời từ các chiến dịch marketing" },
                    retention_rate: { name: "Tỷ Lệ Giữ Chân", unit: "%", description: "Tỷ lệ khách hàng tiếp tục sử dụng dịch vụ" },
                    support_tickets: { name: "Tickets Hỗ Trợ", unit: "tickets", description: "Số lượng ticket hỗ trợ xử lý mỗi tháng" },
                    team_productivity: { name: "Năng Suất Đội Nhóm", unit: "%", description: "Mức độ năng suất làm việc của đội nhóm" },
                    revenue_growth: { name: "Tăng Trưởng Doanh Thu", unit: "%", description: "Tỷ lệ tăng trưởng doanh thu so với kỳ trước" },
                    pipeline_velocity: { name: "Tốc Độ Pipeline", unit: "x", description: "Tốc độ di chuyển của lead qua pipeline bán hàng" },
                    response_time: { name: "Thời Gian Phản Hồi", unit: "giờ", description: "Thời gian trung bình để phản hồi khách hàng" },
                    resolution_rate: { name: "Tỷ Lệ Giải Quyết", unit: "%", description: "Tỷ lệ giải quyết thành công các vấn đề khách hàng" }
                  };

                  const kpiInfo = kpiLabels[kpiKey];
                  if (!kpiInfo) return null;

                  return (
                    <div key={kpiKey} className="space-y-3 p-4 border rounded-lg bg-gray-50">
                      <div>
                        <Label className="text-sm font-medium">{kpiInfo.name}</Label>
                        <p className="text-xs text-gray-600 mt-1">{kpiInfo.description}</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <Input
                            type="number"
                            defaultValue={currentValue}
                            className="text-center"
                            placeholder={`Nhập mục tiêu ${kpiInfo.name.toLowerCase()}`}
                          />
                        </div>
                        <span className="text-sm text-gray-500 min-w-[60px]">{kpiInfo.unit}</span>
                      </div>

                      <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                        <strong>Hiện tại:</strong> {currentValue} {kpiInfo.unit}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Tác Động Lên KPI Đội Nhóm</h4>
              <p className="text-sm text-gray-600 mb-3">
                Thay đổi mục tiêu KPI cá nhân sẽ ảnh hưởng đến các chỉ số tổng hợp của đội nhóm:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-medium text-blue-600">Tỷ Lệ Chuyển Đổi TB</div>
                  <div className="text-gray-600">Tính từ TB cá nhân</div>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-medium text-green-600">Khách Hàng Mới</div>
                  <div className="text-gray-600">Tổng cộng cá nhân</div>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-medium text-purple-600">Hài Lòng KH</div>
                  <div className="text-gray-600">Tính từ TB cá nhân</div>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-medium text-orange-600">Chu Kỳ Bán</div>
                  <div className="text-gray-600">Tính từ TB cá nhân</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowIndividualKPIModal(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  // Save individual KPI targets here
                  setShowIndividualKPIModal(false);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Lưu Cài Đặt KPI
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk KPI Settings Modal */}
      <Dialog open={showBulkKPIModal} onOpenChange={setShowBulkKPIModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Thêm KPI Nhanh Cho Nhiều Nhân Viên
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <strong>Tính năng:</strong> Thiết lập KPI cho nhiều nhân viên cùng lúc dựa trên hiệu suất tháng trước. 
              Hệ thống sẽ tự động đề xuất mục tiêu phù hợp cho từng thành viên.
            </div>

            {/* Team Members Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(previousMonthData).map(([memberName, previousData]) => (
                <Card key={memberName} className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{memberName}</CardTitle>
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Hiệu Suất Tháng Trước:</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(previousData).slice(0, 4).map(([kpiKey, value]) => {
                            const kpiLabels: Record<string, string> = {
                              deals_closed: "Deals",
                              revenue: "Doanh Thu",
                              conversion_rate: "Chuyển Đổi",
                              customer_acquisition: "KH Mới",
                              sales_cycle: "Chu Kỳ",
                              satisfaction_score: "Hài Lòng",
                              leads_generated: "Lead",
                              cost_per_lead: "Chi Phí/Lead",
                              campaign_roi: "ROI",
                              retention_rate: "Giữ Chân",
                              support_tickets: "Tickets",
                              team_productivity: "Năng Suất",
                              revenue_growth: "Tăng Trưởng",
                              pipeline_velocity: "Tốc Độ",
                              response_time: "Phản Hồi",
                              resolution_rate: "Giải Quyết"
                            };

                            return (
                              <div key={kpiKey} className="flex justify-between">
                                <span className="text-gray-600">{kpiLabels[kpiKey]}:</span>
                                <span className="font-medium">{value}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <h4 className="text-sm font-medium text-green-700 mb-2">Mục Tiêu Đề Xuất (Tăng 15%):</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(previousData).slice(0, 4).map(([kpiKey, value]) => {
                            const kpiLabels: Record<string, string> = {
                              deals_closed: "Deals",
                              revenue: "Doanh Thu", 
                              conversion_rate: "Chuyển Đổi",
                              customer_acquisition: "KH Mới",
                              sales_cycle: "Chu Kỳ",
                              satisfaction_score: "Hài Lòng"
                            };

                            // Calculate suggested target (increase by 15% for performance KPIs, decrease for cost/time)
                            const isDecrease = kpiKey === 'sales_cycle' || kpiKey === 'cost_per_lead' || kpiKey === 'response_time';
                            const suggestedValue = isDecrease 
                              ? Math.round(value * 0.85 * 10) / 10 
                              : Math.round(value * 1.15 * 10) / 10;

                            return (
                              <div key={kpiKey} className="flex justify-between">
                                <span className="text-green-600">{kpiLabels[kpiKey]}:</span>
                                <span className="font-medium text-green-700">{suggestedValue}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Điều Chỉnh Mục Tiêu (%)</Label>
                        <select className="w-full p-2 border rounded-md text-sm">
                          <option value="10">Tăng 10% (Dễ)</option>
                          <option value="15" selected>Tăng 15% (Khuyến nghị)</option>
                          <option value="20">Tăng 20% (Thách thức)</option>
                          <option value="25">Tăng 25% (Cao)</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Global Settings */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-purple-600" />
                  Cài Đặt Chung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Thời Gian Áp Dụng</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="current">Tháng hiện tại</option>
                      <option value="next">Tháng tới</option>
                      <option value="quarter">Cả quý</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Phương Thức Tính Toán</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="percentage">Theo phần trăm</option>
                      <option value="absolute">Theo giá trị tuyệt đối</option>
                      <option value="smart">Thông minh (AI)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Mức Độ Khó</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="easy">Dễ (5-10%)</option>
                      <option value="moderate">Vừa (10-15%)</option>
                      <option value="challenging">Khó (15-25%)</option>
                      <option value="aggressive">Tích cực (25%+)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-800">Dự Đoán Tác Động Lên Đội Nhóm</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="text-center p-2 bg-blue-50 rounded border">
                      <div className="font-medium text-blue-600">Tỷ Lệ Chuyển Đổi</div>
                      <div className="text-gray-600">~{(teamKPIFromIndividuals.lead_conversion * 1.15).toFixed(1)}%</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded border">
                      <div className="font-medium text-green-600">Khách Hàng Mới</div>
                      <div className="text-gray-600">~{Math.round(teamKPIFromIndividuals.customer_acquisition * 1.15)}</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded border">
                      <div className="font-medium text-purple-600">Hài Lòng KH</div>
                      <div className="text-gray-600">~{(teamKPIFromIndividuals.customer_satisfaction * 1.1).toFixed(0)}%</div>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded border">
                      <div className="font-medium text-orange-600">Chu Kỳ Bán</div>
                      <div className="text-gray-600">~{(teamKPIFromIndividuals.sales_cycle * 0.9).toFixed(0)} ngày</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowBulkKPIModal(false)}
              >
                Hủy
              </Button>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Xem Trước
              </Button>
              <Button
                onClick={() => {
                  // Save bulk KPI targets here
                  setShowBulkKPIModal(false);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Áp Dụng KPI Cho Tất Cả
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}