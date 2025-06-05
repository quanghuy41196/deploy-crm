import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download, Eye, Edit, Trash2, Phone, Mail, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency, formatDate, formatPhone } from "@/lib/formatters";
import AdvancedFilterButton, { FilterField, FilterValues } from "@/components/advanced-filter-button";
import { usePermissions } from "@/hooks/usePermissions";
import { LEAD_SOURCES, REGIONS } from "@/lib/constants";

export default function Customers() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    region: "",
    page: 1,
  });
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<FilterValues>({});

  const { permissions } = usePermissions();

  // Advanced filter configuration for customers
  const filterFields: FilterField[] = [
    {
      key: 'search',
      label: 'Tìm kiếm',
      type: 'text',
      placeholder: 'Tên, email, số điện thoại, công ty...'
    },
    {
      key: 'status',
      label: 'Trạng thái khách hàng',
      type: 'select',
      options: [
        { value: 'active', label: 'Đang hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' },
        { value: 'potential', label: 'Tiềm năng' },
        { value: 'vip', label: 'VIP' }
      ]
    },
    {
      key: 'region',
      label: 'Khu vực',
      type: 'select',
      options: REGIONS.map(region => ({ value: region.value, label: region.label }))
    },
    {
      key: 'originalSource',
      label: 'Nguồn Lead ban đầu',
      type: 'select',
      options: LEAD_SOURCES.map(source => ({ value: source.value, label: source.label }))
    },
    {
      key: 'conversionDate',
      label: 'Ngày chuyển đổi',
      type: 'dateRange'
    },
    {
      key: 'leadCreatedDate',
      label: 'Ngày tạo Lead',
      type: 'dateRange'
    },
    {
      key: 'customerValue',
      label: 'Giá trị khách hàng (VND)',
      type: 'number'
    },
    {
      key: 'company',
      label: 'Công ty',
      type: 'text',
      placeholder: 'Tên công ty...'
    },
    {
      key: 'tags',
      label: 'Thẻ',
      type: 'text',
      placeholder: 'Nhập thẻ...'
    }
  ];

  const { data: customersData, isLoading } = useQuery({
    queryKey: ["/api/customers", filters],
  });

  const customers = customersData?.customers || [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(customers.map((customer: any) => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: number, checked: boolean) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  // Advanced filter handlers
  const handleAdvancedFilterApply = () => {
    setFilters(prev => ({
      ...prev,
      ...advancedFilters,
      page: 1
    }));
  };

  const handleAdvancedFilterClear = () => {
    setAdvancedFilters({});
    setFilters({
      search: "",
      status: "",
      region: "",
      page: 1,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: string }> = {
      'new': { label: 'Khách Hàng Mới', variant: 'secondary' },
      'active': { label: 'Đang Giao Dịch', variant: 'default' },
      'loyal': { label: 'Khách Hàng Thân Thiết', variant: 'default' },
      'potential': { label: 'Tiềm Năng', variant: 'outline' },
      'inactive': { label: 'Ngừng Hợp Tác', variant: 'secondary' },
      'vip': { label: 'VIP', variant: 'default' }
    };

    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return (
      <Badge variant={config.variant as any} className={`status-${status}`}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 animate-pulse">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Stats calculations
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c: any) => c.status === 'active' || c.status === 'loyal' || c.status === 'vip').length;
  const totalValue = customers.reduce((sum: number, c: any) => sum + (c.customer_value || c.total_value || 0), 0);
  const avgValue = totalCustomers > 0 ? totalValue / totalCustomers : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Khách Hàng</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">👥</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Khách Hàng Hoạt Động</p>
                <p className="text-2xl font-bold text-green-600">{activeCustomers}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✅</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Giá Trị</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalValue)}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Giá Trị Trung Bình</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(avgValue)}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-sm">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Basic Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm khách hàng..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="new">Khách Hàng Mới</option>
              <option value="active">Đang Giao Dịch</option>
              <option value="loyal">Thân Thiết</option>
              <option value="potential">Tiềm Năng</option>
              <option value="inactive">Ngừng Hợp Tác</option>
              <option value="vip">VIP</option>
            </select>
            
            <select
              value={filters.region}
              onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
              className="h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
            >
              <option value="">Tất cả khu vực</option>
              <option value="TP.HCM">TP.HCM</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Cần Thơ">Cần Thơ</option>
            </select>
            
            <AdvancedFilterButton
              fields={filterFields}
              values={advancedFilters}
              onValuesChange={setAdvancedFilters}
              onApply={handleAdvancedFilterApply}
              onClear={handleAdvancedFilterClear}
            />
            
            <div className="flex space-x-2 ml-auto">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Thêm mới
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-left w-10">
                    <Checkbox
                      checked={selectedCustomers.length === customers.length && customers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Tên Khách Hàng
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Email
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    SĐT
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Nguồn
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Trạng Thái
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Ngày Chuyển Đổi
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Ngày Tạo Lead
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Nhân Viên
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Giá Trị
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Công Ty
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Địa Chỉ
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Ghi Chú
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Thẻ
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer: any) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked as boolean)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Avatar className="w-8 h-8 mr-3">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(customer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900">{customer.email || "-"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900">{formatPhone(customer.phone)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="outline" className="text-xs">
                        {customer.source || "-"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(customer.status)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {customer.conversion_date ? formatDate(customer.conversion_date) : "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {customer.lead_created_date ? formatDate(customer.lead_created_date) : formatDate(customer.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      {customer.assigned_to ? (
                        <div className="flex items-center">
                          <Avatar className="w-6 h-6 mr-2">
                            <AvatarFallback className="text-xs">
                              {customer.assigned_to.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-900">Sales User</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Chưa phân bổ</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(customer.customer_value || customer.total_value || 0)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900">{customer.company || "-"}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900 truncate max-w-32" title={customer.address}>
                        {customer.address ? (customer.address.length > 30 ? customer.address.substring(0, 30) + "..." : customer.address) : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500 truncate max-w-32" title={customer.notes}>
                        {customer.notes ? (customer.notes.length > 30 ? customer.notes.substring(0, 30) + "..." : customer.notes) : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {customer.tags && customer.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {customer.tags.slice(0, 2).map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {customer.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{customer.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" title="Xem chi tiết">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Gọi điện">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Gửi email">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Chỉnh sửa">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Xóa">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {customers.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Chưa có khách hàng nào</p>
          <p className="text-gray-400">Thêm khách hàng đầu tiên để bắt đầu</p>
        </div>
      )}
    </div>
  );
}