import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Menu, Search, Bell, Plus, User, Settings, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface HeaderProps {
  onMenuClick: () => void;
}

const pageTitles = {
  "/": "Tổng quan",
  "/leads": "Danh sách Leads", 
  "/sales-pipeline": "Theo dõi Leads",
  "/orders": "Đơn hàng",
  "/customers": "Khách hàng",
  "/tasks": "Nhiệm vụ",
  "/reports": "Báo cáo",
  "/automation": "Tự động hóa",
  "/marketing": "Marketing",
  "/integrations": "Tích hợp",
  "/settings": "Cài đặt",
};

// Sample notifications data
const notifications = [
  {
    id: 1,
    type: "urgent",
    message: "Lead Nguyễn Văn A không tương tác 3 ngày",
    time: "10 phút trước",
    read: false,
  },
  {
    id: 2,
    type: "important", 
    message: "Đơn #123 Chưa thanh toán 3 ngày",
    time: "1 giờ trước",
    read: false,
  },
  {
    id: 3,
    type: "normal",
    message: "Lead Trần Thị B từ Fanpage",
    time: "30 phút trước",
    read: true,
  },
];

export default function Header({ onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location] = useLocation();
  const { user } = useAuth();
  
  const currentTitle = pageTitles[location as keyof typeof pageTitles] || "ViLead CRM";
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return "🔴";
      case "important":
        return "🟡";
      default:
        return "🟢";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-900">{currentTitle}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Tìm kiếm leads, đơn hàng, khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10"
            />
          </form>

          {/* Add Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="sm"
                style={{ backgroundColor: "#0052CC" }}
                className="text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tạo mới
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Tạo Leads</DropdownMenuItem>
              <DropdownMenuItem>Tạo Đơn bán</DropdownMenuItem>
              <DropdownMenuItem>Tạo Khách hàng</DropdownMenuItem>
              <DropdownMenuItem>Tạo Task</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" style={{ color: "#666666" }} />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-semibold text-lg" style={{ color: "#333333" }}>Thông báo</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      🔽 Lọc
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Đánh dấu đã đọc
                    </Button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded">
                  <Button variant="ghost" size="sm" className="flex-1 text-xs bg-white shadow-sm">
                    Tất cả ({notifications.length})
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-xs">
                    Khẩn cấp ({notifications.filter(n => n.type === 'urgent').length})
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-xs">
                    Quan trọng ({notifications.filter(n => n.type === 'important').length})
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {/* Urgent Notifications */}
                  {notifications.filter(n => n.type === 'urgent').length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-red-600 mb-2 flex items-center">
                        🔴 Khẩn cấp
                      </h4>
                      {notifications.filter(n => n.type === 'urgent').map((notification) => (
                        <div key={notification.id} className="p-3 rounded border-l-4 border-l-red-500 bg-red-50 mb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            <Button size="sm" variant="outline" className="ml-2 text-xs" style={{ color: "#0052CC", borderColor: "#0052CC" }}>
                              Xem
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Important Notifications */}
                  {notifications.filter(n => n.type === 'important').length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-yellow-600 mb-2 flex items-center">
                        🟡 Quan trọng
                      </h4>
                      {notifications.filter(n => n.type === 'important').map((notification) => (
                        <div key={notification.id} className="p-3 rounded border-l-4 border-l-yellow-500 bg-yellow-50 mb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            <Button size="sm" variant="outline" className="ml-2 text-xs" style={{ color: "#0052CC", borderColor: "#0052CC" }}>
                              Xem
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Normal Notifications */}
                  {notifications.filter(n => n.type === 'normal').length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-blue-600 mb-2 flex items-center">
                        🟢 Thông thường
                      </h4>
                      {notifications.filter(n => n.type === 'normal').map((notification) => (
                        <div key={notification.id} className="p-3 rounded border-l-4 border-l-blue-500 bg-blue-50 mb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            <Button size="sm" variant="outline" className="ml-2 text-xs" style={{ color: "#0052CC", borderColor: "#0052CC" }}>
                              Xem
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-3">
                  <Button variant="ghost" size="sm" className="w-full text-sm" style={{ color: "#0052CC" }}>
                    Xem tất cả thông báo →
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName || "Nguyễn"} {user?.lastName || "Văn An"}
                  </p>
                  <p className="text-xs text-gray-500">Sales Manager</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Hồ sơ cá nhân
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Cài đặt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a href="/api/logout" className="flex items-center w-full">
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
