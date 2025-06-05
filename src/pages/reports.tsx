import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  Download, 
  Plus,
  Filter,
  Settings,
  Play,
  Save,
  FileText,
  Users,
  DollarSign,
  ShoppingCart,
  Target
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/formatters";
import ReportBuilderModal from "@/components/reports/report-builder-modal";

export default function Reports() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customReport, setCustomReport] = useState({
    name: "",
    dateRange: "last_30_days",
    metrics: [] as string[],
    filters: {} as Record<string, any>,
    chartType: "bar"
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTemplate, setModalTemplate] = useState<any>(null);

  const { data: reportsData } = useQuery({
    queryKey: ["/api/reports"],
  });

  // Report Templates
  const reportTemplates = [
    {
      id: "sales_performance",
      name: "Hiệu Suất Bán Hàng",
      description: "Báo cáo doanh thu, đơn hàng và tỷ lệ chuyển đổi",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-green-100 text-green-600",
      metrics: ["revenue", "orders", "conversion_rate", "avg_order_value"]
    },
    {
      id: "lead_analysis",
      name: "Phân Tích Lead",
      description: "Nguồn lead, chất lượng và hiệu quả chuyển đổi",
      icon: <Users className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600",
      metrics: ["total_leads", "lead_sources", "conversion_by_source", "lead_quality"]
    },
    {
      id: "customer_insights",
      name: "Thông Tin Khách Hàng",
      description: "Hành vi khách hàng, giá trị và phân khúc",
      icon: <Target className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-600",
      metrics: ["customer_lifetime_value", "retention_rate", "customer_segments", "repeat_purchases"]
    },
    {
      id: "product_performance",
      name: "Hiệu Suất Sản Phẩm",
      description: "Doanh số sản phẩm, xu hướng và tồn kho",
      icon: <ShoppingCart className="w-6 h-6" />,
      color: "bg-orange-100 text-orange-600",
      metrics: ["product_sales", "inventory_turnover", "top_products", "product_trends"]
    },
    {
      id: "team_performance",
      name: "Hiệu Suất Đội Ngũ",
      description: "Thành tích nhân viên, mục tiêu và KPI",
      icon: <Users className="w-6 h-6" />,
      color: "bg-indigo-100 text-indigo-600",
      metrics: ["team_sales", "individual_performance", "target_achievement", "activity_metrics"]
    }
  ];

  // Available Metrics
  const availableMetrics = [
    { id: "revenue", name: "Doanh Thu", category: "financial" },
    { id: "orders", name: "Đơn Hàng", category: "sales" },
    { id: "leads", name: "Lead", category: "sales" },
    { id: "customers", name: "Khách Hàng", category: "customer" },
    { id: "conversion_rate", name: "Tỷ Lệ Chuyển Đổi", category: "performance" },
    { id: "avg_order_value", name: "Giá Trị Đơn Hàng TB", category: "financial" },
    { id: "customer_acquisition_cost", name: "Chi Phí Thu Hút KH", category: "financial" },
    { id: "lifetime_value", name: "Giá Trị Trọn Đời", category: "customer" },
    { id: "activities", name: "Hoạt Động", category: "performance" },
    { id: "tasks_completed", name: "Công Việc Hoàn Thành", category: "performance" }
  ];

  // Sample Report Data
  const sampleData = {
    overview: {
      total_revenue: 125680000,
      total_orders: 89,
      total_leads: 156,
      conversion_rate: 57.1,
      growth_rate: 12.5
    },
    charts: {
      monthly_revenue: [
        { month: "T1", value: 18500000 },
        { month: "T2", value: 22300000 },
        { month: "T3", value: 19800000 },
        { month: "T4", value: 28600000 },
        { month: "T5", value: 36480000 }
      ],
      lead_sources: [
        { source: "Facebook", value: 45, percentage: 28.8 },
        { source: "Zalo", value: 38, percentage: 24.4 },
        { source: "Website", value: 32, percentage: 20.5 },
        { source: "Giới thiệu", value: 25, percentage: 16.0 },
        { source: "Google Ads", value: 16, percentage: 10.3 }
      ],
      top_products: [
        { name: "ViLead CRM Professional", sales: 156, revenue: 935440000 },
        { name: "ViLead CRM Basic", sales: 85, revenue: 254150000 },
        { name: "Training Package", sales: 12, revenue: 47880000 },
        { name: "Module Quản Lý Kho", sales: 45, revenue: 89550000 }
      ]
    }
  };

  const addMetricToCustomReport = (metricId: string) => {
    if (!customReport.metrics.includes(metricId)) {
      setCustomReport(prev => ({
        ...prev,
        metrics: [...prev.metrics, metricId]
      }));
    }
  };

  const removeMetricFromCustomReport = (metricId: string) => {
    setCustomReport(prev => ({
      ...prev,
      metrics: prev.metrics.filter(m => m !== metricId)
    }));
  };

  const handleCreateReport = () => {
    setModalTemplate(null);
    setIsModalOpen(true);
  };

  const handleTemplateReport = (template: any) => {
    setModalTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalTemplate(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo Cáo</h1>
          <p className="text-gray-600">Tạo và tùy chỉnh báo cáo theo nhu cầu</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Button onClick={handleCreateReport}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo Báo Cáo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
          <TabsTrigger value="templates">Mẫu Báo Cáo</TabsTrigger>
          <TabsTrigger value="custom">Tạo Tùy Chỉnh</TabsTrigger>
          <TabsTrigger value="saved">Đã Lưu</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng Doanh Thu</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(sampleData.overview.total_revenue)}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <span className="text-sm text-green-600">+{sampleData.overview.growth_rate}%</span>
                  <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Đơn Hàng</p>
                    <p className="text-2xl font-bold text-gray-900">{sampleData.overview.total_orders}</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lead Mới</p>
                    <p className="text-2xl font-bold text-gray-900">{sampleData.overview.total_leads}</p>
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tỷ Lệ Chuyển Đổi</p>
                    <p className="text-2xl font-bold text-gray-900">{sampleData.overview.conversion_rate}%</p>
                  </div>
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tăng Trưởng</p>
                    <p className="text-2xl font-bold text-gray-900">+{sampleData.overview.growth_rate}%</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Doanh Thu Theo Tháng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleData.charts.monthly_revenue.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.month}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(item.value / Math.max(...sampleData.charts.monthly_revenue.map(d => d.value))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{formatCurrency(item.value)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Nguồn Lead
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleData.charts.lead_sources.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.source}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{item.value} ({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Sản Phẩm Bán Chạy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Sản Phẩm</th>
                      <th className="text-left py-2">Số Lượng Bán</th>
                      <th className="text-left py-2">Doanh Thu</th>
                      <th className="text-left py-2">Tỷ Trọng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.charts.top_products.map((product, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 font-medium">{product.name}</td>
                        <td className="py-3">{product.sales}</td>
                        <td className="py-3">{formatCurrency(product.revenue)}</td>
                        <td className="py-3">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${(product.revenue / Math.max(...sampleData.charts.top_products.map(p => p.revenue))) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${template.color}`}>
                      {template.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.metrics.slice(0, 3).map((metric) => (
                          <Badge key={metric} variant="secondary" className="text-xs">
                            {availableMetrics.find(m => m.id === metric)?.name || metric}
                          </Badge>
                        ))}
                        {template.metrics.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.metrics.length - 3}
                          </Badge>
                        )}
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => handleTemplateReport(template)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Tạo Báo Cáo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Custom Report Builder Tab */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tạo Báo Cáo Tùy Chỉnh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Tên Báo Cáo</label>
                <Input
                  placeholder="Nhập tên báo cáo..."
                  value={customReport.name}
                  onChange={(e) => setCustomReport(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Khoảng Thời Gian</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={customReport.dateRange}
                  onChange={(e) => setCustomReport(prev => ({ ...prev, dateRange: e.target.value }))}
                >
                  <option value="last_7_days">7 ngày qua</option>
                  <option value="last_30_days">30 ngày qua</option>
                  <option value="last_90_days">90 ngày qua</option>
                  <option value="this_month">Tháng này</option>
                  <option value="last_month">Tháng trước</option>
                  <option value="this_quarter">Quý này</option>
                  <option value="this_year">Năm này</option>
                  <option value="custom">Tùy chỉnh</option>
                </select>
              </div>

              {/* Metrics Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Chọn Chỉ Số</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
                  {availableMetrics.map((metric) => (
                    <div
                      key={metric.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        customReport.metrics.includes(metric.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        if (customReport.metrics.includes(metric.id)) {
                          removeMetricFromCustomReport(metric.id);
                        } else {
                          addMetricToCustomReport(metric.id);
                        }
                      }}
                    >
                      <div className="font-medium text-sm">{metric.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{metric.category}</div>
                    </div>
                  ))}
                </div>

                {/* Selected Metrics */}
                {customReport.metrics.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Đã chọn ({customReport.metrics.length}):</p>
                    <div className="flex flex-wrap gap-2">
                      {customReport.metrics.map((metricId) => {
                        const metric = availableMetrics.find(m => m.id === metricId);
                        return (
                          <Badge
                            key={metricId}
                            variant="default"
                            className="cursor-pointer"
                            onClick={() => removeMetricFromCustomReport(metricId)}
                          >
                            {metric?.name} ×
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Chart Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Loại Biểu Đồ</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={customReport.chartType}
                  onChange={(e) => setCustomReport(prev => ({ ...prev, chartType: e.target.value }))}
                >
                  <option value="bar">Biểu Đồ Cột</option>
                  <option value="line">Biểu Đồ Đường</option>
                  <option value="pie">Biểu Đồ Tròn</option>
                  <option value="area">Biểu Đồ Vùng</option>
                  <option value="table">Bảng Dữ Liệu</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <Button disabled={!customReport.name || customReport.metrics.length === 0}>
                  <Play className="w-4 h-4 mr-2" />
                  Tạo Báo Cáo
                </Button>
                <Button variant="outline" disabled={!customReport.name || customReport.metrics.length === 0}>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu Mẫu
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Saved Reports Tab */}
        <TabsContent value="saved" className="space-y-6">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có báo cáo đã lưu</h3>
            <p className="text-gray-600 mb-4">Tạo và lưu báo cáo tùy chỉnh để sử dụng sau</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tạo Báo Cáo Đầu Tiên
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Builder Modal */}
      <ReportBuilderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        template={modalTemplate}
      />
    </div>
  );
}