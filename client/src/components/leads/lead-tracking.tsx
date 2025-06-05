import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Phone, Mail, MessageSquare, Calendar, Clock, Star, TrendingUp, 
  Activity, FileText, User, DollarSign, MapPin, Tag, Eye, Edit, 
  Plus, History, Target, CheckCircle, AlertCircle 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate, formatTime, formatPhone } from "@/lib/formatters";

interface LeadTrackingProps {
  leadId: number;
  onClose: () => void;
}

export default function LeadTracking({ leadId, onClose }: LeadTrackingProps) {
  const [newNote, setNewNote] = useState("");
  const [newTask, setNewTask] = useState("");
  const [showAddActivity, setShowAddActivity] = useState(false);

  const queryClient = useQueryClient();

  const { data: leadData, isLoading } = useQuery({
    queryKey: ["/api/leads", leadId, "tracking"],
  });

  // Dữ liệu mẫu cho lead tracking
  const sampleLeadData = {
    id: leadId,
    name: "Công ty TNHH Technology Solutions",
    contactPerson: "Nguyễn Văn Dũng",
    title: "Giám đốc IT",
    email: "dung.nguyen@techsolutions.vn",
    phone: "0901234567",
    company: "Technology Solutions Ltd",
    source: "Website",
    region: "Hà Nội",
    status: "Quan tâm",
    stage: "Tư vấn",
    value: 85000000,
    assignedTo: "Nguyễn Văn A",
    tags: ["Hot Lead", "Enterprise", "Ưu tiên cao"],
    createdAt: "2024-05-20T09:00:00Z",
    lastContact: "2024-05-27T14:30:00Z",
    nextFollowUp: "2024-05-28T10:00:00Z",
    score: 85,
    
    // Tracking data
    timeline: [
      {
        id: 1,
        type: "lead_created",
        title: "Lead được tạo",
        description: "Lead mới từ form website",
        user: "System",
        timestamp: "2024-05-20T09:00:00Z",
        icon: "plus",
        color: "blue"
      },
      {
        id: 2,
        type: "contact_call",
        title: "Cuộc gọi đầu tiên",
        description: "Gọi điện giới thiệu dịch vụ CRM, khách hàng quan tâm",
        user: "Nguyễn Văn A",
        timestamp: "2024-05-20T14:30:00Z",
        icon: "phone",
        color: "green",
        duration: 15,
        outcome: "Tích cực"
      },
      {
        id: 3,
        type: "email_sent",
        title: "Gửi email thông tin",
        description: "Gửi brochure và bảng giá CRM Premium",
        user: "Nguyễn Văn A",
        timestamp: "2024-05-21T10:15:00Z",
        icon: "mail",
        color: "purple"
      },
      {
        id: 4,
        type: "meeting_scheduled",
        title: "Hẹn demo sản phẩm",
        description: "Lên lịch demo CRM cho ngày 28/05 lúc 14:00",
        user: "Nguyễn Văn A",
        timestamp: "2024-05-22T16:45:00Z",
        icon: "calendar",
        color: "orange"
      },
      {
        id: 5,
        type: "stage_changed",
        title: "Chuyển sang giai đoạn Tư vấn",
        description: "Lead đã xem demo và yêu cầu báo giá chi tiết",
        user: "Nguyễn Văn A",
        timestamp: "2024-05-25T11:20:00Z",
        icon: "target",
        color: "blue"
      },
      {
        id: 6,
        type: "note_added",
        title: "Ghi chú quan trọng",
        description: "Khách hàng quan tâm tích hợp với hệ thống ERP hiện tại. Cần báo giá custom API.",
        user: "Nguyễn Văn A",
        timestamp: "2024-05-27T14:30:00Z",
        icon: "edit",
        color: "gray"
      }
    ],

    tasks: [
      {
        id: 1,
        title: "Chuẩn bị demo CRM",
        description: "Tạo demo scenario phù hợp với ngành công nghệ",
        dueDate: "2024-05-28T14:00:00Z",
        status: "Chờ xử lý",
        priority: "Cao",
        assignedTo: "Nguyễn Văn A"
      },
      {
        id: 2,
        title: "Lập báo giá tích hợp API",
        description: "Báo giá cho tính năng tích hợp với ERP",
        dueDate: "2024-05-29T17:00:00Z",
        status: "Chờ xử lý",
        priority: "Cao",
        assignedTo: "Nguyễn Văn A"
      },
      {
        id: 3,
        title: "Follow up sau demo",
        description: "Gọi điện xác nhận sau buổi demo",
        dueDate: "2024-05-28T16:00:00Z",
        status: "Chờ xử lý",
        priority: "Trung bình",
        assignedTo: "Nguyễn Văn A"
      }
    ],

    communications: [
      {
        id: 1,
        type: "call",
        direction: "outbound",
        subject: "Cuộc gọi giới thiệu dịch vụ",
        content: "Gọi điện giới thiệu CRM ViLead, khách hàng quan tâm và yêu cầu xem demo",
        timestamp: "2024-05-20T14:30:00Z",
        duration: 15,
        outcome: "Tích cực"
      },
      {
        id: 2,
        type: "email",
        direction: "outbound",
        subject: "Thông tin CRM ViLead và Bảng giá",
        content: "Gửi brochure, case study và bảng giá các gói CRM",
        timestamp: "2024-05-21T10:15:00Z",
        opened: true,
        clicked: true
      },
      {
        id: 3,
        type: "meeting",
        direction: "scheduled",
        subject: "Demo CRM ViLead",
        content: "Lên lịch demo sản phẩm cho ngày 28/05/2024",
        timestamp: "2024-05-22T16:45:00Z",
        location: "Online - Google Meet"
      }
    ],

    analytics: {
      totalTouchpoints: 6,
      lastActivity: "2024-05-27T14:30:00Z",
      daysSinceCreated: 7,
      daysSinceLastContact: 0,
      responseRate: 100,
      engagementScore: 85
    }
  };

  const lead = leadData || sampleLeadData;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lead_created": return <Plus className="w-4 h-4" />;
      case "contact_call": return <Phone className="w-4 h-4" />;
      case "email_sent": return <Mail className="w-4 h-4" />;
      case "meeting_scheduled": return <Calendar className="w-4 h-4" />;
      case "stage_changed": return <Target className="w-4 h-4" />;
      case "note_added": return <FileText className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-100 text-blue-600";
      case "green": return "bg-green-100 text-green-600";
      case "purple": return "bg-purple-100 text-purple-600";
      case "orange": return "bg-orange-100 text-orange-600";
      case "gray": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Cao": return "bg-red-100 text-red-800";
      case "Trung bình": return "bg-yellow-100 text-yellow-800";
      case "Thấp": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chờ xử lý": return "bg-yellow-100 text-yellow-800";
      case "Đang thực hiện": return "bg-blue-100 text-blue-800";
      case "Hoàn thành": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${lead.score >= 80 ? 'bg-green-500' : lead.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <Badge variant="outline">Score: {lead.score}</Badge>
            </div>
            <div>
              <h2 className="text-xl font-bold">{lead.name}</h2>
              <p className="text-gray-600">{lead.contactPerson} • {lead.title}</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">{lead.stage}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6">
          {/* Lead Info Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin Lead</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {lead.contactPerson.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{lead.contactPerson}</p>
                    <p className="text-sm text-gray-500">{lead.title}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{formatPhone(lead.phone)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{lead.region}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{formatCurrency(lead.value)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Sales: {lead.assignedTo}</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {lead.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thống kê nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Touchpoints</span>
                  <span className="font-medium">{lead.analytics.totalTouchpoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Ngày tạo</span>
                  <span className="font-medium">{lead.analytics.daysSinceCreated} ngày</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Liên hệ cuối</span>
                  <span className="font-medium">{lead.analytics.daysSinceLastContact} ngày</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Response Rate</span>
                  <span className="font-medium text-green-600">{lead.analytics.responseRate}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hành động nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button size="sm" className="w-full" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Gọi điện
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Gửi email
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Đặt lịch hẹn
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Tạo báo giá
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-2">
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="tasks">Công việc</TabsTrigger>
                <TabsTrigger value="communications">Liên lạc</TabsTrigger>
                <TabsTrigger value="analytics">Phân tích</TabsTrigger>
              </TabsList>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Lịch sử hoạt động</h3>
                  <Button size="sm" onClick={() => setShowAddActivity(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm hoạt động
                  </Button>
                </div>

                <div className="space-y-4">
                  {lead.timeline.map((activity: any) => (
                    <div key={activity.id} className="flex space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.color)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="bg-white border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{activity.title}</h4>
                            <span className="text-xs text-gray-500">
                              {formatDate(activity.timestamp)} {formatTime(activity.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Bởi: {activity.user}</span>
                            {activity.duration && (
                              <span>Thời lượng: {activity.duration} phút</span>
                            )}
                            {activity.outcome && (
                              <Badge variant="outline" className="text-xs">
                                {activity.outcome}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Note Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Thêm ghi chú</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      placeholder="Nhập ghi chú về cuộc trao đổi, tình hình lead..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Thêm ghi chú
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Công việc liên quan</h3>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo công việc
                  </Button>
                </div>

                <div className="space-y-3">
                  {lead.tasks.map((task: any) => (
                    <Card key={task.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{task.title}</h4>
                          <div className="flex space-x-2">
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>Hạn: {formatDate(task.dueDate)}</span>
                          <span>Phụ trách: {task.assignedTo}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Communications Tab */}
              <TabsContent value="communications" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Lịch sử liên lạc</h3>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ghi nhận liên lạc
                  </Button>
                </div>

                <div className="space-y-3">
                  {lead.communications.map((comm: any) => (
                    <Card key={comm.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            {comm.type === 'call' && <Phone className="w-4 h-4 text-green-600" />}
                            {comm.type === 'email' && <Mail className="w-4 h-4 text-purple-600" />}
                            {comm.type === 'meeting' && <Calendar className="w-4 h-4 text-blue-600" />}
                            <h4 className="font-medium">{comm.subject}</h4>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(comm.timestamp)} {formatTime(comm.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{comm.content}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="capitalize">{comm.direction}</span>
                          <div className="flex space-x-2">
                            {comm.duration && <span>Thời lượng: {comm.duration} phút</span>}
                            {comm.opened && <Badge variant="outline" className="text-xs">Đã mở</Badge>}
                            {comm.clicked && <Badge variant="outline" className="text-xs">Đã click</Badge>}
                            {comm.outcome && <Badge variant="outline" className="text-xs">{comm.outcome}</Badge>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-4">
                <h3 className="text-lg font-semibold">Phân tích Lead</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Lead Score</p>
                          <p className="text-2xl font-bold">{lead.score}/100</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${lead.score >= 80 ? 'bg-green-100' : lead.score >= 60 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                          <Star className={`w-6 h-6 ${lead.score >= 80 ? 'text-green-600' : lead.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Engagement</p>
                          <p className="text-2xl font-bold">{lead.analytics.engagementScore}%</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Touchpoints</p>
                          <p className="text-2xl font-bold">{lead.analytics.totalTouchpoints}</p>
                        </div>
                        <Activity className="w-8 h-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Response Rate</p>
                          <p className="text-2xl font-bold">{lead.analytics.responseRate}%</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Đánh giá Lead</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Khả năng chuyển đổi</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                          <span className="text-sm font-medium">85%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Mức độ quan tâm</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                          </div>
                          <span className="text-sm font-medium">90%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Khả năng thanh toán</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <span className="text-sm font-medium">75%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}