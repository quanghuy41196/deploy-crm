import { UserPlus, ShoppingBag, Phone, FileText, DollarSign, Calendar, MessageSquare, Mail, CheckCircle, Users, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function RecentActivity() {
  // Dữ liệu hoạt động mẫu
  const sampleActivities = [
    {
      id: 1,
      type: 'lead_created',
      description: 'Thêm mới lead từ Facebook Ads',
      subtext: 'Công ty ABC Technology - Gói Enterprise',
      createdAt: new Date(Date.now() - 2 * 60 * 1000),
      icon: UserPlus,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 2,
      type: 'order_created',
      description: 'Tạo đơn hàng mới',
      subtext: 'Gói Premium - 50 triệu/năm',
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
      icon: ShoppingBag,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 3,
      type: 'call_scheduled',
      description: 'Lịch hẹn demo sản phẩm',
      subtext: 'Công ty XYZ Corp - 15:00 chiều nay',
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
      icon: Phone,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      id: 4,
      type: 'quote_sent',
      description: 'Gửi báo giá cho khách hàng',
      subtext: 'Gói Basic & Premium - Công ty DEF',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: FileText,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 5,
      type: 'payment_received',
      description: 'Nhận thanh toán từ khách hàng',
      subtext: 'Gói Enterprise - 120 triệu',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      id: 6,
      type: 'meeting_scheduled',
      description: 'Cuộc họp với khách hàng',
      subtext: 'Review Q2/2024 - Công ty MNO',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      icon: Calendar,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 7,
      type: 'message_sent',
      description: 'Gửi tin nhắn follow-up',
      subtext: '5 leads từ chiến dịch Q1/2024',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      icon: MessageSquare,
      iconColor: 'text-cyan-600',
      bgColor: 'bg-cyan-100'
    },
    {
      id: 8,
      type: 'email_campaign',
      description: 'Gửi email marketing',
      subtext: 'Chiến dịch ra mắt tính năng mới',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      icon: Mail,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 9,
      type: 'task_completed',
      description: 'Hoàn thành nhiệm vụ',
      subtext: 'Khảo sát nhu cầu 20 khách hàng',
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      icon: CheckCircle,
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      id: 10,
      type: 'team_meeting',
      description: 'Họp team Sales',
      subtext: 'Review KPIs tháng 3/2024',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      icon: Users,
      iconColor: 'text-violet-600',
      bgColor: 'bg-violet-100'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Hoạt động gần đây</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Xem tất cả
        </button>
      </div>
      <div className="space-y-4">
        {sampleActivities.slice(0, 6).map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${activity.bgColor} flex items-center justify-center`}>
              {<activity.icon className={`w-4 h-4 ${activity.iconColor}`} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-0.5">{activity.subtext}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDistanceToNow(activity.createdAt, { 
                  addSuffix: true,
                  locale: vi 
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
