import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download, Eye, Edit, Trash2, CheckCircle, Clock, Grid3x3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/formatters";

export default function Tasks() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    page: 1,
  });
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ["/api/tasks", filters],
  });

  const tasks = tasksData?.tasks || [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(tasks.map((task: any) => task.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleSelectTask = (taskId: number, checked: boolean) => {
    if (checked) {
      setSelectedTasks(prev => [...prev, taskId]);
    } else {
      setSelectedTasks(prev => prev.filter(id => id !== taskId));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      'pending': { label: 'Chờ Xử Lý', color: 'bg-yellow-100 text-yellow-800' },
      'in_progress': { label: 'Đang Xử Lý', color: 'bg-blue-100 text-blue-800' },
      'completed': { label: 'Hoàn Thành', color: 'bg-green-100 text-green-800' },
      'cancelled': { label: 'Đã Hủy', color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, { label: string; color: string }> = {
      'low': { label: 'Thấp', color: 'bg-gray-100 text-gray-800' },
      'medium': { label: 'Trung Bình', color: 'bg-blue-100 text-blue-800' },
      'high': { label: 'Cao', color: 'bg-orange-100 text-orange-800' },
      'urgent': { label: 'Khẩn Cấp', color: 'bg-red-100 text-red-800' }
    };

    const config = priorityConfig[priority] || { label: priority, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Stats calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t: any) => t.status === 'in_progress').length;
  const pendingTasks = tasks.filter((t: any) => t.status === 'pending').length;

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
                <p className="text-sm font-medium text-gray-600">Tổng Công Việc</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">📋</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoàn Thành</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang Xử Lý</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressTasks}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ Xử Lý</p>
                <p className="text-2xl font-bold text-orange-600">{pendingTasks}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-sm">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-1">
              <Button 
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="flex items-center space-x-2"
              >
                <List className="w-4 h-4" />
                <span>Bảng</span>
              </Button>
              <Button 
                variant={viewMode === 'kanban' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="flex items-center space-x-2"
              >
                <Grid3x3 className="w-4 h-4" />
                <span>Kanban</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm công việc..."
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
                <option value="in_progress">Đang Xử Lý</option>
                <option value="completed">Hoàn Thành</option>
                <option value="cancelled">Đã Hủy</option>
              </select>
            </div>
            
            <div>
              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả mức độ</option>
                <option value="low">Thấp</option>
                <option value="medium">Trung Bình</option>
                <option value="high">Cao</option>
                <option value="urgent">Khẩn Cấp</option>
              </select>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </Button>
              <Button className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Tạo công việc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Display - Table or Kanban */}
      {viewMode === 'table' ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-left w-10">
                    <Checkbox
                      checked={selectedTasks.length === tasks.length && tasks.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                    Tiêu Đề Công Việc
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Loại Công Việc
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Mức Độ
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Trạng Thái
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Người Phụ Trách
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Hạn Hoàn Thành
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Ngày Tạo
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task: any) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-2 py-4">
                      <Checkbox
                        checked={selectedTasks.includes(task.id)}
                        onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                      />
                    </td>
                    <td className="px-3 py-4">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{task.title}</span>
                        {task.description && (
                          <p className="text-xs text-gray-500 truncate max-w-48" title={task.description}>
                            {task.description.length > 50 ? task.description.substring(0, 50) + "..." : task.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <Badge variant="outline" className="text-xs">
                        {task.type || "Công việc"}
                      </Badge>
                    </td>
                    <td className="px-3 py-4">
                      {getPriorityBadge(task.priority)}
                    </td>
                    <td className="px-3 py-4">
                      {getStatusBadge(task.status)}
                    </td>
                    <td className="px-3 py-4">
                      {task.assigned_to ? (
                        <div className="flex items-center">
                          <Avatar className="w-6 h-6 mr-2">
                            <AvatarFallback className="text-xs">
                              {task.assigned_to.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-900">Nhân viên</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Chưa phân bổ</span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {task.due_date ? formatDate(task.due_date) : "-"}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {formatDate(task.created_at)}
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" title="Xem chi tiết">
                          <Eye className="w-4 h-4" />
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
      ) : (
        // Kanban View
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Chờ Xử Lý */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Chờ Xử Lý</h3>
              <Badge variant="secondary">{tasks.filter((t: any) => t.status === 'pending').length}</Badge>
            </div>
            <div className="space-y-3">
              {tasks.filter((t: any) => t.status === 'pending').map((task: any) => (
                <Card key={task.id} className="p-3 hover:shadow-md cursor-pointer">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      {getPriorityBadge(task.priority)}
                      {task.due_date && (
                        <span className="text-xs text-gray-500">{formatDate(task.due_date)}</span>
                      )}
                    </div>
                    {task.assigned_to && (
                      <div className="flex items-center">
                        <Avatar className="w-5 h-5 mr-2">
                          <AvatarFallback className="text-xs">
                            {task.assigned_to.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600">Nhân viên</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Đang Xử Lý */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Đang Xử Lý</h3>
              <Badge variant="secondary">{tasks.filter((t: any) => t.status === 'in_progress').length}</Badge>
            </div>
            <div className="space-y-3">
              {tasks.filter((t: any) => t.status === 'in_progress').map((task: any) => (
                <Card key={task.id} className="p-3 hover:shadow-md cursor-pointer">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      {getPriorityBadge(task.priority)}
                      {task.due_date && (
                        <span className="text-xs text-gray-500">{formatDate(task.due_date)}</span>
                      )}
                    </div>
                    {task.assigned_to && (
                      <div className="flex items-center">
                        <Avatar className="w-5 h-5 mr-2">
                          <AvatarFallback className="text-xs">
                            {task.assigned_to.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600">Nhân viên</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Hoàn Thành */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Hoàn Thành</h3>
              <Badge variant="secondary">{tasks.filter((t: any) => t.status === 'completed').length}</Badge>
            </div>
            <div className="space-y-3">
              {tasks.filter((t: any) => t.status === 'completed').map((task: any) => (
                <Card key={task.id} className="p-3 hover:shadow-md cursor-pointer">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      {getPriorityBadge(task.priority)}
                      {task.due_date && (
                        <span className="text-xs text-gray-500">{formatDate(task.due_date)}</span>
                      )}
                    </div>
                    {task.assigned_to && (
                      <div className="flex items-center">
                        <Avatar className="w-5 h-5 mr-2">
                          <AvatarFallback className="text-xs">
                            {task.assigned_to.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600">Nhân viên</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Đã Hủy */}
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Đã Hủy</h3>
              <Badge variant="secondary">{tasks.filter((t: any) => t.status === 'cancelled').length}</Badge>
            </div>
            <div className="space-y-3">
              {tasks.filter((t: any) => t.status === 'cancelled').map((task: any) => (
                <Card key={task.id} className="p-3 hover:shadow-md cursor-pointer">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      {getPriorityBadge(task.priority)}
                      {task.due_date && (
                        <span className="text-xs text-gray-500">{formatDate(task.due_date)}</span>
                      )}
                    </div>
                    {task.assigned_to && (
                      <div className="flex items-center">
                        <Avatar className="w-5 h-5 mr-2">
                          <AvatarFallback className="text-xs">
                            {task.assigned_to.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600">Nhân viên</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {tasks.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Chưa có công việc nào</p>
          <p className="text-gray-400">Tạo công việc đầu tiên để bắt đầu</p>
        </div>
      )}
    </div>
  );
}