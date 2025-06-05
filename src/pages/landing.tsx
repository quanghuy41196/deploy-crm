import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, Zap, Facebook, Phone } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">ViLead CRM</span>
            </div>
            <Button onClick={handleLogin} size="lg">
              Đăng nhập
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Hệ thống CRM
            <span className="text-blue-600"> tốt nhất</span>
            <br />
            cho doanh nghiệp Việt Nam
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            ViLead CRM giúp bạn quản lý khách hàng tiềm năng, tối ưu quy trình bán hàng 
            và tăng doanh thu với công nghệ AI và tự động hóa tiên tiến.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleLogin} size="lg" className="text-lg px-8 py-3">
              Bắt đầu miễn phí
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tính năng nổi bật
          </h2>
          <p className="text-lg text-gray-600">
            Được thiết kế đặc biệt cho thị trường Việt Nam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Quản lý Lead thông minh</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Thu thập lead từ Facebook, Zalo, Google Ads. Phân loại tự động và 
                phân bổ cho sales theo quy tắc tùy chỉnh.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Quy trình bán hàng Kanban</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Hiển thị pipeline trực quan với drag & drop. Theo dõi lead qua 
                từng giai đoạn từ tiếp nhận đến chốt deal.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Tự động hóa thông minh</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Email tự động, phân bổ lead, nhắc nhở nhiệm vụ. Tiết kiệm thời gian 
                và tăng hiệu suất bán hàng.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Facebook className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Tích hợp Facebook & Zalo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Kết nối trực tiếp với Facebook Ads và Zalo OA. Thu thập lead 
                tự động từ các kênh phổ biến tại Việt Nam.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Báo cáo chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Dashboard trực quan với biểu đồ doanh số, hiệu suất sales, 
                tỷ lệ chuyển đổi và phân tích ROI.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Mobile-first</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Giao diện tối ưu cho mobile. Quản lý CRM mọi lúc mọi nơi với 
                trải nghiệm mượt mà trên điện thoại.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sẵn sàng tăng doanh thu?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Hàng nghìn doanh nghiệp Việt Nam đã tin tùng ViLead CRM. 
            Đăng ký ngay để trải nghiệm miễn phí.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-3"
          >
            Bắt đầu ngay hôm nay
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">ViLead CRM</span>
            </div>
            <p className="text-gray-400">
              © 2024 ViLead CRM. Hệ thống quản lý khách hàng hàng đầu Việt Nam.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
