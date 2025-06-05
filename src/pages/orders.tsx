import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download, Eye, Edit, Trash2, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency, formatCompactCurrency, formatDate, formatPhone } from "@/lib/formatters";
import OrderForm from "@/components/orders/order-form";
import AdvancedFilterButton, { FilterField, FilterValues } from "@/components/advanced-filter-button";
import { usePermissions } from "@/hooks/usePermissions";
import { ORDER_STATUSES } from "@/lib/constants";

export default function Orders() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    page: 1,
  });
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterValues>({});

  const { permissions } = usePermissions();

  // Advanced filter configuration for orders
  const filterFields: FilterField[] = [
    {
      key: 'search',
      label: 'Tìm kiếm',
      type: 'text',
      placeholder: 'Mã đơn hàng, tên khách hàng...'
    },
    {
      key: 'status',
      label: 'Trạng thái đơn hàng',
      type: 'select',
      options: ORDER_STATUSES.map(status => ({ value: status.value, label: status.label }))
    },
    {
      key: 'paymentStatus',
      label: 'Trạng thái thanh toán',
      type: 'select',
      options: [
        { value: 'paid', label: 'Đã thanh toán' },
        { value: 'unpaid', label: 'Chưa thanh toán' },
        { value: 'pending_contract', label: 'Chờ hợp đồng' },
        { value: 'partial', label: 'Thanh toán một phần' }
      ]
    },
    {
      key: 'orderDate',
      label: 'Ngày đặt hàng',
      type: 'dateRange'
    },
    {
      key: 'deliveryDate',
      label: 'Ngày giao hàng',
      type: 'dateRange'
    },
    {
      key: 'orderValue',
      label: 'Giá trị đơn hàng (VND)',
      type: 'number'
    },
    {
      key: 'customerType',
      label: 'Loại khách hàng',
      type: 'select',
      options: [
        { value: 'new', label: 'Khách hàng mới' },
        { value: 'returning', label: 'Khách hàng cũ' },
        { value: 'vip', label: 'Khách hàng VIP' }
      ]
    },
    {
      key: 'salesPerson',
      label: 'Nhân viên Sale',
      type: 'text',
      placeholder: 'Tên nhân viên...'
    }
  ];

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["/api/orders", filters],
  });

  const orders = ordersData?.orders || [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map((order: any) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: number, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
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
      page: 1,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: string; color: string }> = {
      'pending': { label: 'Chờ Xử Lý', variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
      'processing': { label: 'Đang Xử Lý', variant: 'default', color: 'bg-blue-100 text-blue-800' },
      'shipped': { label: 'Đã Giao Hàng', variant: 'default', color: 'bg-purple-100 text-purple-800' },
      'completed': { label: 'Hoàn Thành', variant: 'default', color: 'bg-green-100 text-green-800' },
      'cancelled': { label: 'Đã Hủy', variant: 'secondary', color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || { label: status, variant: 'outline', color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getProductNames = (items: any) => {
    try {
      const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
      if (parsedItems?.products && Array.isArray(parsedItems.products)) {
        return parsedItems.products.map((p: any) => p.name).join(', ');
      }
      return 'Sản phẩm CRM';
    } catch {
      return 'Sản phẩm CRM';
    }
  };

  // Stats calculations
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o: any) => o.status === 'completed').length;
  const totalRevenue = orders.filter((o: any) => o.status === 'completed').reduce((sum: number, o: any) => sum + (o.value || 0), 0);
  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;

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

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Đơn Hàng</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">📦</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đơn Hoàn Thành</p>
                <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
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
                <p className="text-sm font-medium text-gray-600">Doanh Thu</p>
                <p className="text-2xl font-bold text-purple-600">{formatCompactCurrency(totalRevenue)}</p>
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
                <p className="text-sm font-medium text-gray-600">Chờ Xử Lý</p>
                <p className="text-2xl font-bold text-orange-600">{pendingOrders}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-sm">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm đơn hàng..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <div>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ Xử Lý</option>
                <option value="processing">Đang Xử Lý</option>
                <option value="shipped">Đã Giao Hàng</option>
                <option value="completed">Hoàn Thành</option>
                <option value="cancelled">Đã Hủy</option>
              </select>
            </div>
            
            <div></div>
            
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </Button>
              <Button className="flex-1" onClick={() => setShowOrderForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo đơn hàng
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-left w-10">
                    <Checkbox
                      checked={selectedOrders.length === orders.length && orders.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Mã Đơn Hàng
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Khách Hàng
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    Sản Phẩm
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Giá Trị
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Trạng Thái
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Ngày Tạo
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Ngày Cập Nhật
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Ghi Chú
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-2 py-4">
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                      />
                    </td>
                    <td className="px-3 py-4">
                      <span className="text-sm font-medium text-gray-900">{order.order_number}</span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center">
                        <Avatar className="w-8 h-8 mr-3">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            KH
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-900">Khách hàng #{order.customer_id}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span className="text-sm text-gray-900 truncate max-w-48" title={getProductNames(order.items)}>
                        {getProductNames(order.items).length > 40 ? getProductNames(order.items).substring(0, 40) + "..." : getProductNames(order.items)}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span className="text-sm font-medium text-green-600">
                        {formatCompactCurrency(order.value)}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {formatDate(order.updated_at)}
                    </td>
                    <td className="px-3 py-4">
                      <span className="text-sm text-gray-500 truncate max-w-32" title={order.notes}>
                        {order.notes ? (order.notes.length > 30 ? order.notes.substring(0, 30) + "..." : order.notes) : "-"}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" title="Xem chi tiết">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Xem sản phẩm">
                          <Package className="w-4 h-4" />
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

      {orders.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Chưa có đơn hàng nào</p>
          <p className="text-gray-400">Tạo đơn hàng đầu tiên để bắt đầu</p>
        </div>
      )}

      {/* Order Form Modal */}
      <OrderForm 
        open={showOrderForm}
        onClose={() => setShowOrderForm(false)}
      />
    </div>
  );
}