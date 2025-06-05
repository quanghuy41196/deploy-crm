import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Search, Settings, Star, Users, Calendar as CalendarIcon } from "lucide-react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCompanyEvents, setShowCompanyEvents] = useState(true);
  const [showHolidays, setShowHolidays] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    type: "meeting",
    isCompany: false
  });

  // Lấy thông tin tháng hiện tại
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = [
    "tháng 1", "tháng 2", "tháng 3", "tháng 4", "tháng 5", "tháng 6",
    "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12"
  ];

  // Tính toán ngày đầu tiên của tháng và số ngày
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Tạo mảng các ngày để hiển thị
  const days = [];
  
  // Thêm các ngày trống cho những ngày đầu tuần
  for (let i = 0; i < firstDayWeekday; i++) {
    days.push(null);
  }
  
  // Thêm các ngày trong tháng
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // Dữ liệu ngày lễ và kỷ niệm Việt Nam
  const holidays = {
    1: [{ title: "Tết Dương lịch", type: "holiday", lunar: false }],
    10: [{ title: "Tết Nguyên đán", type: "holiday", lunar: true }], // Mùng 1 Tết (ước tính)
    30: [{ title: "Giỗ tổ Hùng Vương", type: "memorial", lunar: true }],
  };

  // Dữ liệu sự kiện công ty
  const companyEvents = {
    5: [{ title: "Họp Ban Giám đốc", time: "09:00", type: "company", isCompany: true }],
    15: [{ title: "Training toàn công ty", time: "14:00", type: "company", isCompany: true }],
    25: [{ title: "Team Building Q1", time: "08:00", type: "company", isCompany: true }],
  };

  // Dữ liệu sự kiện cá nhân
  const personalEvents = {
    3: [{ title: "Meeting với khách hàng ABC", time: "14:00", type: "meeting", isCompany: false }],
    8: [{ title: "Gọi lead mới", time: "10:00", type: "call", isCompany: false }],
    12: [{ title: "Demo sản phẩm", time: "15:30", type: "demo", isCompany: false }],
    27: [{ title: "Họp team sales", time: "09:00", type: "meeting", isCompany: false }],
  };

  // Kết hợp tất cả events
  const getAllEvents = (day: number) => {
    const allEvents = [];
    
    if (showHolidays && holidays[day as keyof typeof holidays]) {
      allEvents.push(...holidays[day as keyof typeof holidays]);
    }
    
    if (showCompanyEvents && companyEvents[day as keyof typeof companyEvents]) {
      allEvents.push(...companyEvents[day as keyof typeof companyEvents]);
    }
    
    if (personalEvents[day as keyof typeof personalEvents]) {
      allEvents.push(...personalEvents[day as keyof typeof personalEvents]);
    }
    
    return allEvents;
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-2 text-sm">
              <Button variant="outline" size="sm" className="text-gray-600 hover:bg-gray-50">
                Ngày
              </Button>
              <Button variant="outline" size="sm" className="text-gray-600 hover:bg-gray-50">
                Tuần
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Tháng
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="h-4 w-4 mr-1" />
                  Tạo sự kiện
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Tạo sự kiện mới</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Tiêu đề</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      className="col-span-3"
                      placeholder="Nhập tiêu đề sự kiện"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Ngày</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">Giờ</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Loại</Label>
                    <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Họp</SelectItem>
                        <SelectItem value="call">Cuộc gọi</SelectItem>
                        <SelectItem value="demo">Demo</SelectItem>
                        <SelectItem value="training">Đào tạo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">Toàn công ty</Label>
                    <input
                      id="company"
                      type="checkbox"
                      checked={newEvent.isCompany}
                      onChange={(e) => setNewEvent({...newEvent, isCompany: e.target.checked})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Mô tả</Label>
                    <Textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      className="col-span-3"
                      placeholder="Mô tả chi tiết sự kiện"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateEvent(false)}>
                    Hủy
                  </Button>
                  <Button onClick={() => {
                    // TODO: Lưu sự kiện
                    setShowCreateEvent(false);
                    setNewEvent({title: "", date: "", time: "", description: "", type: "meeting", isCompany: false});
                  }}>
                    Tạo sự kiện
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant={showCompanyEvents ? "default" : "outline"} 
              size="sm" 
              onClick={() => setShowCompanyEvents(!showCompanyEvents)}
              className={`${showCompanyEvents 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500' 
                : 'text-gray-600 hover:bg-yellow-50 border-yellow-200 hover:border-yellow-300'
              }`}
            >
              <Star className="h-4 w-4 mr-1" />
              Lịch công ty
            </Button>
            
            <Button 
              variant={showHolidays ? "default" : "outline"} 
              size="sm" 
              onClick={() => setShowHolidays(!showHolidays)}
              className={`${showHolidays 
                ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
                : 'text-gray-600 hover:bg-red-50 border-red-200 hover:border-red-300'
              }`}
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Ngày lễ & âm lịch
            </Button>
            
            <Button variant="outline" size="sm" className="text-gray-600 hover:bg-gray-50">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm sự kiện hoặc lịch hẹn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(-1)}
                className="text-gray-600 hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold min-w-[140px] text-center text-gray-900">
                {monthNames[month]}, {year}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(1)}
                className="text-gray-600 hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="text-gray-600 hover:bg-gray-50"
            >
              Hôm nay
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"].map((day) => (
            <div key={day} className="p-4 text-center text-sm font-semibold text-gray-700 bg-gray-50 first:rounded-tl-xl last:rounded-tr-xl">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <div
              key={index}
              className={`border-r border-b border-gray-200 p-3 min-h-[120px] transition-colors duration-200 ${
                day ? 'hover:bg-gray-50 cursor-pointer' : ''
              } ${isToday(day || 0) ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              {day && (
                <>
                  <div className={`text-sm font-semibold mb-2 flex items-center ${
                    isToday(day) ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {day}
                    {isToday(day) && (
                      <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  
                  {/* Events for this day */}
                  {getAllEvents(day).length > 0 && (
                    <div className="space-y-1">
                      {getAllEvents(day).map((event: any, eventIndex: number) => (
                        <div
                          key={eventIndex}
                          className={`text-xs p-2 rounded-lg truncate cursor-pointer hover:shadow-sm transition-all duration-200 ${
                            event.type === 'meeting' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                            event.type === 'call' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                            event.type === 'demo' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' :
                            event.type === 'training' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' :
                            event.type === 'company' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                            event.type === 'holiday' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                            event.type === 'memorial' ? 'bg-pink-100 text-pink-700 hover:bg-pink-200' :
                            'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-semibold">
                              {event.time ? event.time : ''}
                              {event.isCompany && <Star className="inline w-3 h-3 ml-1 text-yellow-600" />}
                              {event.lunar && <span className="text-xs ml-1">(âm)</span>}
                            </div>
                          </div>
                          <div className="truncate">{event.title}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}