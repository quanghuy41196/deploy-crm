import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  UserCheck,
  BarChart3,
  CheckSquare,
  FileText,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  Target,
  TrendingUp,
  ShoppingCart,
  Calendar,
  Package,
  Zap
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { usePermissions } from "@/hooks/usePermissions";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Hàm lấy thời gian hiện tại theo múi giờ Việt Nam
function getCurrentTime() {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  }).format(new Date());
}

// Menu items with role-based access control based on requirements
const getMenuItemsByRole = (userRole: string = 'sale') => {
  const allMenuItems = [
    {
      icon: LayoutDashboard,
      label: "Tổng quan",
      href: "/",
      iconText: "🏠",
      tooltip: "Tổng quan: Dashboard theo vai trò",
      roles: ["admin", "ceo", "leader", "sale"]
    },
    {
      icon: Users,
      label: "Quản lý Leads",
      href: "/leads",
      iconText: "👥",
      tooltip: "Quản lý Leads: Xem và quản lý leads theo quyền",
      roles: ["admin", "ceo", "leader", "sale"]
    },

    {
      icon: UserCheck,
      label: "Quản lý Khách hàng",
      href: "/customers",
      iconText: "👤",
      tooltip: "Quản lý Khách hàng: Thông tin và lịch sử khách hàng",
      roles: ["admin", "ceo", "leader", "sale"]
    },
    {
      icon: ShoppingCart,
      label: "Quản lý Đơn hàng",
      href: "/orders",
      iconText: "🛒",
      tooltip: "Quản lý Đơn hàng: Trạng thái và hóa đơn",
      roles: ["admin", "ceo", "leader", "sale"]
    },
    {
      icon: Package,
      label: "Quản lý Sản phẩm",
      href: "/products",
      iconText: "📦",
      tooltip: "Quản lý Sản phẩm: Danh mục và biến thể",
      roles: ["admin", "ceo", "leader", "sale"]
    },
    {
      icon: CheckSquare,
      label: "Quản lý Công việc",
      href: "/tasks",
      iconText: "✅",
      tooltip: "Quản lý Công việc: Task và tiến độ",
      roles: ["admin", "ceo", "leader", "sale"]
    },
    {
      icon: Calendar,
      label: "Lịch",
      href: "/calendar",
      iconText: "📅",
      tooltip: "Lịch: Lịch công việc và nhắc nhở",
      roles: ["admin", "ceo", "leader", "sale"]
    },
    {
      icon: Users,
      label: "Quản lý Nhân viên",
      href: "/employees",
      iconText: "👨‍💼",
      tooltip: "Quản lý Nhân viên: Hiệu suất và hoạt động",
      roles: ["admin", "ceo", "leader"]
    },
    {
      icon: Target,
      label: "KPIs",
      href: "/kpis",
      iconText: "🎯",
      tooltip: "KPIs: Chỉ số hiệu suất và xếp hạng",
      roles: ["admin", "ceo", "leader"]
    },
    {
      icon: Zap,
      label: "Marketing",
      href: "/marketing",
      iconText: "📢",
      tooltip: "Marketing: Chiến dịch và automation",
      roles: ["admin", "ceo", "leader"]
    },
    {
      icon: FileText,
      label: "Báo cáo",
      href: "/reports",
      iconText: "📊",
      tooltip: "Báo cáo: Doanh số và hiệu suất",
      roles: ["admin", "ceo", "leader", "sale"]
    },
    {
      icon: Settings,
      label: "Cài đặt",
      href: "/settings",
      iconText: "⚙️",
      tooltip: "Cài đặt: Hệ thống và tích hợp",
      roles: ["admin", "ceo"]
    },
  ];

  return allMenuItems.filter(item => item.roles.includes(userRole));
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const { userRole, setRole } = usePermissions();

  const menuItems = getMenuItemsByRole(userRole);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">ViLead CRM</h1>
                  <p className="text-xs text-gray-500">
                    {userRole === 'admin' ? 'Admin Dashboard' : 
                     userRole === 'ceo' ? 'CEO Dashboard' :
                     userRole === 'leader' ? 'Leader Sale Dashboard' : 
                     'Sale Dashboard'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
          
          {/* Collapse button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCollapse}
            className={cn("hidden lg:flex", isCollapsed && "mx-auto")}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Role Switcher */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Quyền truy cập
              </label>
              <Select value={userRole} onValueChange={setRole}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">👑 Admin (Toàn quyền)</SelectItem>
                  <SelectItem value="ceo">🏢 CEO (Xem tất cả)</SelectItem>
                  <SelectItem value="leader">👥 Leader (Nhóm A)</SelectItem>
                  <SelectItem value="sale">👤 Sale (Cá nhân)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group cursor-pointer",
                    isActive 
                      ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100" 
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  title={isCollapsed ? item.tooltip : ""}
                >
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6",
                    isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {!isCollapsed && (
                    <span className="font-medium text-sm truncate flex-1">
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Đang hoạt động</span>
              </div>
              <p className="text-xs text-gray-500">{currentTime}</p>
              

            </div>
          </div>
        )}
      </div>
    </>
  );
}