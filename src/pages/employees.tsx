import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Mail,
  Phone,
  Calendar,
  MapPin,
  UserCheck,
  UserX,
  Eye,
  Download,
  Upload
} from "lucide-react";
import { formatDate, formatPhone } from "@/lib/formatters";
import { apiRequest } from "@/lib/queryClient";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  startDate: string;
  status: "active" | "inactive" | "on_leave";
  salary?: number;
  manager?: string;
  avatar?: string;
}

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Sample employee data
  const employees: Employee[] = [
    {
      id: "EMP001",
      firstName: "Nguyễn",
      lastName: "Văn A",
      email: "nguyen.van.a@vilead.com",
      phone: "0901234567",
      position: "Trưởng phòng Kinh doanh",
      department: "Kinh doanh",
      startDate: "2023-01-15",
      status: "active",
      salary: 25000000,
      manager: "Giám đốc"
    },
    {
      id: "EMP002", 
      firstName: "Trần",
      lastName: "Thị B",
      email: "tran.thi.b@vilead.com",
      phone: "0907654321",
      position: "Chuyên viên Marketing",
      department: "Marketing",
      startDate: "2023-03-10",
      status: "active",
      salary: 15000000,
      manager: "Nguyễn Văn A"
    },
    {
      id: "EMP003",
      firstName: "Lê",
      lastName: "Văn C", 
      email: "le.van.c@vilead.com",
      phone: "0912345678",
      position: "Chuyên viên Hỗ trợ",
      department: "Hỗ trợ khách hàng",
      startDate: "2023-02-20",
      status: "active", 
      salary: 12000000,
      manager: "Nguyễn Văn A"
    },
    {
      id: "EMP004",
      firstName: "Phạm",
      lastName: "Thị D",
      email: "pham.thi.d@vilead.com",
      phone: "0923456789",
      position: "Nhân viên Kinh doanh",
      department: "Kinh doanh",
      startDate: "2023-05-01",
      status: "on_leave",
      salary: 18000000,
      manager: "Nguyễn Văn A"
    },
    {
      id: "EMP005",
      firstName: "Hoàng",
      lastName: "Văn E",
      email: "hoang.van.e@vilead.com", 
      phone: "0934567890",
      position: "Chuyên viên IT",
      department: "Công nghệ",
      startDate: "2023-04-15",
      status: "active",
      salary: 20000000,
      manager: "Giám đốc"
    }
  ];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Đang làm việc</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Nghỉ việc</Badge>;
      case "on_leave":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Đang nghỉ</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Kinh doanh":
        return "text-blue-600 bg-blue-50";
      case "Marketing":
        return "text-purple-600 bg-purple-50";
      case "Hỗ trợ khách hàng":
        return "text-green-600 bg-green-50";
      case "Công nghệ":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditing(true);
    setShowEmployeeModal(true);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsEditing(false);
    setShowEmployeeModal(true);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Nhân viên</h1>
          <p className="text-gray-600">Quản lý thông tin và hiệu suất nhân viên trong công ty</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Nhập dữ liệu</span>
          </Button>
          <Button onClick={handleAddEmployee} className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Thêm Nhân viên</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang làm việc</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(e => e.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang nghỉ</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(e => e.status === "on_leave").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nghỉ việc</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(e => e.status === "inactive").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả phòng ban</option>
              <option value="Kinh doanh">Kinh doanh</option>
              <option value="Marketing">Marketing</option>
              <option value="Hỗ trợ khách hàng">Hỗ trợ khách hàng</option>
              <option value="Công nghệ">Công nghệ</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang làm việc</option>
              <option value="on_leave">Đang nghỉ</option>
              <option value="inactive">Nghỉ việc</option>
            </select>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Bộ lọc nâng cao</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Danh sách Nhân viên ({filteredEmployees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700">Nhân viên</th>
                  <th className="text-left p-3 font-medium text-gray-700">Liên hệ</th>
                  <th className="text-left p-3 font-medium text-gray-700">Chức vụ</th>
                  <th className="text-left p-3 font-medium text-gray-700">Phòng ban</th>
                  <th className="text-center p-3 font-medium text-gray-700">Ngày vào</th>
                  <th className="text-center p-3 font-medium text-gray-700">Trạng thái</th>
                  <th className="text-center p-3 font-medium text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {employee.firstName[0]}{employee.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-gray-500">ID: {employee.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {employee.email}
                        </div>
                        {employee.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {formatPhone(employee.phone)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{employee.position}</div>
                      {employee.manager && (
                        <div className="text-sm text-gray-500">Quản lý: {employee.manager}</div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(employee.department)}`}>
                        {employee.department}
                      </span>
                    </td>
                    <td className="text-center p-3">
                      <div className="text-sm text-gray-900">{formatDate(employee.startDate)}</div>
                    </td>
                    <td className="text-center p-3">
                      {getStatusBadge(employee.status)}
                    </td>
                    <td className="text-center p-3">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEmployee(employee)}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Employee Modal */}
      <Dialog open={showEmployeeModal} onOpenChange={setShowEmployeeModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Chỉnh sửa thông tin nhân viên" : "Thêm nhân viên mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Họ</Label>
                <Input id="firstName" placeholder="Nhập họ..." />
              </div>
              <div>
                <Label htmlFor="lastName">Tên</Label>
                <Input id="lastName" placeholder="Nhập tên..." />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Nhập email..." />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" placeholder="Nhập số điện thoại..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Chức vụ</Label>
                <Input id="position" placeholder="Nhập chức vụ..." />
              </div>
              <div>
                <Label htmlFor="department">Phòng ban</Label>
                <select id="department" className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="">Chọn phòng ban</option>
                  <option value="Kinh doanh">Kinh doanh</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Hỗ trợ khách hàng">Hỗ trợ khách hàng</option>
                  <option value="Công nghệ">Công nghệ</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Ngày vào làm</Label>
                <Input id="startDate" type="date" />
              </div>
              <div>
                <Label htmlFor="status">Trạng thái</Label>
                <select id="status" className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="active">Đang làm việc</option>
                  <option value="on_leave">Đang nghỉ</option>
                  <option value="inactive">Nghỉ việc</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="manager">Quản lý trực tiếp</Label>
              <Input id="manager" placeholder="Nhập tên quản lý..." />
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowEmployeeModal(false)}>
                Hủy
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {isEditing ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}