import React, { useState, useRef, useEffect } from 'react';
import SalesFunnel from '@/components/dashboard/sales-funnel';
import { useUserRole, UserRole } from '../hooks/useUserRole';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData
} from 'chart.js';
import { UserPlusIcon, PhoneIcon, CalendarIcon, DocumentTextIcon, ExclamationCircleIcon, ClockIcon, BellIcon } from '@heroicons/react/24/outline';
import { useLocation } from 'wouter';
import TopSalesTable from "@/components/dashboard/top-sales-table";
import KPITargets from "@/components/dashboard/kpi-targets";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FilterOption {
  id: string;
  name: string;
  type: 'all' | 'team' | 'individual';
}

const filterOptions: FilterOption[] = [
  { id: 'all', name: 'Toàn bộ công ty', type: 'all' },
  { id: 'team_sales', name: 'Team Sales', type: 'team' },
  { id: 'team_marketing', name: 'Team Marketing', type: 'team' },
  { id: 'team_support', name: 'Team Support', type: 'team' },
  { id: 'nguyen_van_a', name: 'Nguyễn Văn A', type: 'individual' },
  { id: 'tran_thi_b', name: 'Trần Thị B', type: 'individual' },
  { id: 'le_van_c', name: 'Lê Văn C', type: 'individual' },
];

interface DashboardData {
  revenue: {
    current: number;
    previous: number;
    kpi: number;
    kpiPercentage: number;
  };
  customers: {
    current: number;
    previous: number;
    kpi: number;
    kpiPercentage: number;
  };
  deals: {
    current: number;
    previous: number;
    kpi: number;
    kpiPercentage: number;
  };
  conversion: {
    current: number;
    previous: number;
    kpi: number;
    kpiPercentage: number;
  };
  sources: {
    facebook: number;
    google: number;
    zalo: number;
    other: number;
  };
}

// Role-based data với logic phù hợp cho từng role
const roleBasedData: Record<UserRole, DashboardData> = {
  // CEO - Xem toàn bộ công ty
  CEO: {
    revenue: {
      current: 25.5,
      previous: 22.2,
      kpi: 30,
      kpiPercentage: 85
    },
    customers: {
      current: 1234,
      previous: 1140,
      kpi: 1340,
      kpiPercentage: 92
    },
    deals: {
      current: 156,
      previous: 163,
      kpi: 200,
      kpiPercentage: 78
    },
    conversion: {
      current: 16.5,
      previous: 14.2,
      kpi: 17.5,
      kpiPercentage: 95
    },
    sources: {
      facebook: 24.5,
      google: 18.2,
      zalo: 15.3,
      other: 8.7
    }
  },
  // Leader - Xem theo team
  Leader: {
    revenue: {
      current: 8.5,
      previous: 7.8,
      kpi: 10,
      kpiPercentage: 85
    },
    customers: {
      current: 420,
      previous: 380,
      kpi: 450,
      kpiPercentage: 93
    },
    deals: {
      current: 52,
      previous: 48,
      kpi: 65,
      kpiPercentage: 80
    },
    conversion: {
      current: 15.8,
      previous: 14.0,
      kpi: 16.5,
      kpiPercentage: 96
    },
    sources: {
      facebook: 22.5,
      google: 19.2,
      zalo: 16.3,
      other: 7.7
    }
  },
  // Sale - Chỉ xem cá nhân
  Sale: {
    revenue: {
      current: 2.8,
      previous: 2.5,
      kpi: 3.3,
      kpiPercentage: 85
    },
    customers: {
      current: 145,
      previous: 128,
      kpi: 150,
      kpiPercentage: 97
    },
    deals: {
      current: 18,
      previous: 16,
      kpi: 22,
      kpiPercentage: 82
    },
    conversion: {
      current: 14.8,
      previous: 13.5,
      kpi: 15.5,
      kpiPercentage: 95
    },
    sources: {
      facebook: 25.5,
      google: 17.2,
      zalo: 14.3,
      other: 9.7
    }
  },
  // Admin - Xem toàn bộ nhưng tập trung vào quản trị
  Admin: {
    revenue: {
      current: 25.5,
      previous: 22.2,
      kpi: 30,
      kpiPercentage: 85
    },
    customers: {
      current: 1234,
      previous: 1140,
      kpi: 1340,
      kpiPercentage: 92
    },
    deals: {
      current: 156,
      previous: 163,
      kpi: 200,
      kpiPercentage: 78
    },
    conversion: {
      current: 16.5,
      previous: 14.2,
      kpi: 17.5,
      kpiPercentage: 95
    },
    sources: {
      facebook: 24.5,
      google: 18.2,
      zalo: 15.3,
      other: 8.7
    }
  }
};

const sampleFunnelData = {
  leadSources: [
    {
      name: "Facebook",
      count: "125",
      rate: "24.5%",
      responseRate: "85%",
      avgValue: "2.5tr",
      icon: "fab fa-facebook",
      color: "bg-blue-600"
    },
    {
      name: "Google",
      count: "98",
      rate: "18.2%",
      responseRate: "85%",
      avgValue: "2.5tr",
      icon: "fab fa-google",
      color: "bg-red-500"
    },
    {
      name: "Zalo",
      count: "76",
      rate: "15.3%",
      responseRate: "85%",
      avgValue: "2.5tr",
      icon: "fas fa-comment-alt",
      color: "bg-blue-500"
    },
    {
      name: "Khác",
      count: "42",
      rate: "8.7%",
      responseRate: "85%",
      avgValue: "2.5tr",
      icon: "fas fa-globe",
      color: "bg-gray-500"
    }
  ],
  funnelStages: [
    { name: "Tiềm năng", count: 254, rate: "100%" },
    { name: "Liên hệ", count: 186, rate: "73.2%" },
    { name: "Đàm phán", count: 124, rate: "48.8%" },
    { name: "Đề xuất", count: 68, rate: "26.8%" },
    { name: "Chốt", count: 42, rate: "16.5%" }
  ],
  conversionRate: {
    value: "16.5%",
    change: "+2.3%",
    successCount: "42",
    totalCount: "254"
  }
};

const sampleTopSalesData = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    position: "Sales Executive",
    revenue: 1250000000,
    deals: 12,
    conversionRate: 65
  },
  {
    id: 2,
    name: "Trần Thị B",
    position: "Senior Sales",
    revenue: 980000000,
    deals: 9,
    conversionRate: 48
  },
  {
    id: 3,
    name: "Lê Văn C",
    position: "Sales Executive",
    revenue: 850000000,
    deals: 8,
    conversionRate: 42
  },
  {
    id: 4,
    name: "Phạm Thị D",
    position: "Sales Executive",
    revenue: 720000000,
    deals: 7,
    conversionRate: 35
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    position: "Junior Sales",
    revenue: 580000000,
    deals: 5,
    conversionRate: 28
  }
];

const sampleKPIData = [
  {
    name: "Doanh số tháng",
    current: 3850000000,
    target: 5000000000,
    unit: "",
    type: "currency" as const
  },
  {
    name: "Số leads mới",
    current: 285,
    target: 300,
    unit: " leads",
    type: "number" as const
  },
  {
    name: "Tỷ lệ chuyển đổi",
    current: 35,
    target: 40,
    unit: "%",
    type: "percentage" as const
  },
  {
    name: "Giá trị trung bình/deal",
    current: 125000000,
    target: 150000000,
    unit: "",
    type: "currency" as const
  }
];

const Dashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('today');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [hoverValue, setHoverValue] = useState<{ [key: string]: string }>({
    revenue: '',
    customers: '',
    deals: '',
    conversion: ''
  });
  const [chartView, setChartView] = useState<'day' | 'month' | 'year'>('month');
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  const userRole = useUserRole();
  const currentData = roleBasedData[userRole];

  const [, setLocation] = useLocation();

  // Tạo danh sách tháng và năm để chọn
  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  
  const years = Array.from({ length: 10 }, (_, i) => selectedYear - 5 + i);

  // Format số thành chuỗi có đơn vị
  const formatNumber = (value: number, type: 'revenue' | 'customers' | 'deals' | 'conversion') => {
    switch (type) {
      case 'revenue':
        return `${value} tỷ`;
      case 'conversion':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  // Tính % thay đổi
  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isIncrease: change > 0
    };
  };

  const handleProgressHover = (
    event: React.MouseEvent<HTMLDivElement>,
    total: number,
    id: string,
    unit: string = ''
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const percentage = (x / width) * 100;
    const value = (total * percentage) / 100;
    setHoverValue({
      ...hoverValue,
      [id]: `${value.toFixed(1)}${unit} / ${total}${unit}`
    });
  };

  const handleProgressLeave = (id: string) => {
    setHoverValue({
      ...hoverValue,
      [id]: ''
    });
  };

  // Data cho biểu đồ doanh thu - điều chỉnh theo role
  const getChartDataByRole = () => {
    const baseRevenue = currentData.revenue.current;
    const monthlyGrowth = 0.05;

    if (chartView === 'day') {
      // Dữ liệu theo ngày của tháng đã chọn
      const dailyGrowth = 0.002;
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      
      const revenueData = Array(daysInMonth).fill(0).map((_, index) => {
        const daysAgo = daysInMonth - 1 - index;
        return +(baseRevenue / Math.pow(1 + dailyGrowth, daysAgo)).toFixed(1);
      });

      const kpiData = Array(daysInMonth).fill(0).map((_, index) => {
        const daysAgo = daysInMonth - 1 - index;
        return +(currentData.revenue.kpi / Math.pow(1 + dailyGrowth, daysAgo)).toFixed(1);
      });

      return {
        labels: Array(daysInMonth).fill(0).map((_, index) => `Ngày ${index + 1}`),
        datasets: [
          {
            label: 'Doanh thu thực tế',
            data: revenueData,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Mục tiêu',
            data: kpiData,
            borderColor: 'rgb(234, 179, 8)',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.4,
            fill: false
          }
        ]
      };
    } else if (chartView === 'month') {
      // Dữ liệu theo tháng của năm đã chọn
      const revenueData = Array(12).fill(0).map((_, index) => {
        const monthsAgo = 11 - index;
        return +(baseRevenue / Math.pow(1 + monthlyGrowth, monthsAgo)).toFixed(1);
      });

      const kpiData = Array(12).fill(0).map((_, index) => {
        const monthsAgo = 11 - index;
        return +(currentData.revenue.kpi / Math.pow(1 + monthlyGrowth, monthsAgo)).toFixed(1);
      });

      return {
        labels: months,
        datasets: [
          {
            label: 'Doanh thu thực tế',
            data: revenueData,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Mục tiêu',
            data: kpiData,
            borderColor: 'rgb(234, 179, 8)',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.4,
            fill: false
          }
        ]
      };
    } else {
      // Dữ liệu 5 năm gần đây tính từ năm đã chọn
      const yearlyGrowth = 0.15;
      const startYear = selectedYear - 4;
      
      const revenueData = Array(5).fill(0).map((_, index) => {
        const yearsAgo = 4 - index;
        return +(baseRevenue / Math.pow(1 + yearlyGrowth, yearsAgo)).toFixed(1);
      });

      const kpiData = Array(5).fill(0).map((_, index) => {
        const yearsAgo = 4 - index;
        return +(currentData.revenue.kpi / Math.pow(1 + yearlyGrowth, yearsAgo)).toFixed(1);
      });

      return {
        labels: Array(5).fill(0).map((_, index) => `Năm ${startYear + index}`),
        datasets: [
          {
            label: 'Doanh thu thực tế',
            data: revenueData,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Mục tiêu',
            data: kpiData,
            borderColor: 'rgb(234, 179, 8)',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.4,
            fill: false
          }
        ]
      };
    }
  };

  const revenueChartData: ChartData<'line'> = getChartDataByRole();

  // Cập nhật chart options để hiển thị tooltip và grid phù hợp với từng chế độ xem
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1) + ' tỷ';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: chartView === 'day', // Chỉ hiển thị grid cho chế độ xem theo ngày
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          maxRotation: chartView === 'day' ? 0 : 0,
          autoSkip: true,
          maxTicksLimit: chartView === 'day' ? 15 : (chartView === 'month' ? 12 : 5)
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + ' tỷ';
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        min: Math.floor(Math.min(...revenueChartData.datasets[0].data.filter((val): val is number => val !== null)) * 0.8),
        max: Math.ceil(Math.max(...revenueChartData.datasets[1].data.filter((val): val is number => val !== null)) * 1.2)
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="p-6">
        {/* Filter Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            {/* Time Filter */}
              <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Thời gian:</label>
              <div className="relative">
                <select 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-1.5 px-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="today">Hôm nay</option>
                  <option value="yesterday">Hôm qua</option>
                  <option value="last7days">7 ngày qua</option>
                  <option value="thisMonth">Tháng này</option>
                  <option value="lastMonth">Tháng trước</option>
                  <option value="thisQuarter">Quý này</option>
                  <option value="thisYear">Năm nay</option>
                  <option value="custom">Tùy chọn</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <i className="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
              </div>

            {/* Custom Date Range */}
            {timeFilter === 'custom' && (
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  className="bg-gray-50 border border-gray-300 text-gray-700 py-1.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <span className="text-gray-500">đến</span>
                <input
                  type="date"
                  className="bg-gray-50 border border-gray-300 text-gray-700 py-1.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            )}

            {/* Dropdown nhóm */}
            <div className="flex items-center gap-2">
                <i className="fas fa-users text-gray-400 text-sm"></i>
              <select className="border border-gray-300 rounded px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Toàn bộ</option>
                <option value="nhom_a">Nhóm A</option>
                <option value="nhom_b">Nhóm B</option>
                <option value="nhom_c">Nhóm C</option>
                </select>
              </div>

              {/* Dropdown sản phẩm */}
            <div className="flex items-center gap-2">
                <i className="fas fa-box text-gray-400 text-sm"></i>
              <select className="border border-gray-300 rounded px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Tất cả sản phẩm</option>
                  <option value="product1">Sản phẩm A</option>
                  <option value="product2">Sản phẩm B</option>
                  <option value="product3">Sản phẩm C</option>
                </select>
              </div>

              {/* Button lọc nâng cao */}
              <button 
                onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium transition-colors"
              >
                <i className="fas fa-filter text-sm"></i>
                <span>Lọc nâng cao</span>
              </button>
            </div>

            {/* Thông tin cập nhật */}
            <div className="text-sm text-gray-500">
              Cập nhật: 11:16:45 4/6/2025
            </div>
          </div>
        </div>

        {/* Advanced Filter Dialog */}
        {showAdvancedFilter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold">Lọc nâng cao</h3>
                <button
                  onClick={() => setShowAdvancedFilter(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="space-y-4">
                {/* Custom Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Từ ngày</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Đến ngày</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                {/* Region */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Khu vực</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Tất cả khu vực</option>
                    <option value="hanoi">Hà Nội</option>
                    <option value="hcm">TP.HCM</option>
                    <option value="danang">Đà Nẵng</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                {/* Lead Source */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nguồn lead</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Tất cả nguồn</option>
                    <option value="facebook">Facebook</option>
                    <option value="website">Website</option>
                    <option value="referral">Giới thiệu</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                {/* Value Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá trị từ</label>
                  <input type="number" placeholder="VND" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá trị đến</label>
                  <input type="number" placeholder="VND" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                {/* Sales Person */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nhân viên sales</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Tất cả nhân viên</option>
                    <option value="nguyen-thanh">Nguyễn Thành</option>
                    <option value="tran-minh">Trần Minh</option>
                    <option value="le-huong">Lê Hương</option>
                    <option value="pham-anh">Phạm Anh</option>
                  </select>
                </div>
              </div>
            <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAdvancedFilter(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Dashboard Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main Content - 8 cột */}
        <div className="col-span-8 space-y-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            {/* Doanh thu */}
            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <i className="fas fa-dollar-sign text-blue-600"></i>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Doanh thu</h3>
              </div>
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className="text-2xl font-semibold text-gray-900">{formatNumber(currentData.revenue.current, 'revenue')}</h2>
                  <div className="group relative">
                    <div className="flex items-center text-sm font-medium">
                      <span className="text-green-600">
                        <i className="fas fa-arrow-up text-xs mr-1"></i>
                        {calculateChange(currentData.revenue.current, currentData.revenue.previous).value}%
                      </span>
                      <span className="text-gray-400 mx-1">|</span>
                      <span className="text-gray-500 text-xs">{formatNumber(currentData.revenue.previous, 'revenue')}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 right-0 bg-gray-900 text-white text-xs p-2 rounded whitespace-nowrap">
                      <div>So với tháng trước:</div>
                      <div className="flex justify-between gap-3">
                        <span>Tháng này:</span>
                        <span className="font-medium">{formatNumber(currentData.revenue.current, 'revenue')}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span>Tháng trước:</span>
                        <span className="font-medium">{formatNumber(currentData.revenue.previous, 'revenue')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500 font-medium">KPI</span>
                    <span className="text-gray-900 font-semibold">{currentData.revenue.kpiPercentage}%</span>
                  </div>
                  <div 
                    className="h-2 w-full bg-gray-100 rounded-full overflow-hidden cursor-pointer"
                    onMouseMove={(e) => handleProgressHover(e, currentData.revenue.kpi, 'revenue', ' tỷ')}
                    onMouseLeave={() => handleProgressLeave('revenue')}
                  >
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-300" 
                      style={{ width: `${currentData.revenue.kpiPercentage}%` }}
                    ></div>
                  </div>
                  {hoverValue.revenue && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                      {hoverValue.revenue}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Khách hàng */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <i className="fas fa-users text-purple-600"></i>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Khách hàng</h3>
              </div>
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className="text-2xl font-semibold text-gray-900">{formatNumber(currentData.customers.current, 'customers')}</h2>
                  <div className="group relative">
                    <div className="flex items-center text-sm font-medium">
                      <span className="text-green-600">
                        <i className="fas fa-arrow-up text-xs mr-1"></i>
                        {calculateChange(currentData.customers.current, currentData.customers.previous).value}%
                      </span>
                      <span className="text-gray-400 mx-1">|</span>
                      <span className="text-gray-500 text-xs">{formatNumber(currentData.customers.previous, 'customers')}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 right-0 bg-gray-900 text-white text-xs p-2 rounded whitespace-nowrap">
                      <div>So với tháng trước:</div>
                      <div className="flex justify-between gap-3">
                        <span>Tháng này:</span>
                        <span className="font-medium">{formatNumber(currentData.customers.current, 'customers')}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span>Tháng trước:</span>
                        <span className="font-medium">{formatNumber(currentData.customers.previous, 'customers')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500 font-medium">KPI</span>
                    <span className="text-gray-900 font-semibold">{currentData.customers.kpiPercentage}%</span>
                  </div>
                  <div 
                    className="h-2 w-full bg-gray-100 rounded-full overflow-hidden cursor-pointer"
                    onMouseMove={(e) => handleProgressHover(e, currentData.customers.kpi, 'customers')}
                    onMouseLeave={() => handleProgressLeave('customers')}
                  >
                    <div 
                      className="h-full bg-purple-600 rounded-full transition-all duration-300" 
                      style={{ width: `${currentData.customers.kpiPercentage}%` }}
                    ></div>
                  </div>
                  {hoverValue.customers && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                      {hoverValue.customers}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Deals */}
            <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <i className="fas fa-handshake text-green-600"></i>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Deals</h3>
          </div>
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className="text-2xl font-semibold text-gray-900">{formatNumber(currentData.deals.current, 'deals')}</h2>
                  <div className="group relative">
                    <div className="flex items-center text-sm font-medium">
                      <span className="text-red-600">
                        <i className="fas fa-arrow-down text-xs mr-1"></i>
                        {calculateChange(currentData.deals.current, currentData.deals.previous).value}%
                      </span>
                      <span className="text-gray-400 mx-1">|</span>
                      <span className="text-gray-500 text-xs">{formatNumber(currentData.deals.previous, 'deals')}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 right-0 bg-gray-900 text-white text-xs p-2 rounded whitespace-nowrap">
                      <div>So với tháng trước:</div>
                      <div className="flex justify-between gap-3">
                        <span>Tháng này:</span>
                        <span className="font-medium">{formatNumber(currentData.deals.current, 'deals')}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span>Tháng trước:</span>
                        <span className="font-medium">{formatNumber(currentData.deals.previous, 'deals')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500 font-medium">KPI</span>
                    <span className="text-gray-900 font-semibold">{currentData.deals.kpiPercentage}%</span>
                  </div>
                  <div 
                    className="h-2 w-full bg-gray-100 rounded-full overflow-hidden cursor-pointer"
                    onMouseMove={(e) => handleProgressHover(e, currentData.deals.kpi, 'deals')}
                    onMouseLeave={() => handleProgressLeave('deals')}
                  >
                    <div 
                      className="h-full bg-green-600 rounded-full transition-all duration-300" 
                      style={{ width: `${currentData.deals.kpiPercentage}%` }}
                    ></div>
                  </div>
                  {hoverValue.deals && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                      {hoverValue.deals}
                    </div>
                  )}
              </div>
              </div>
            </div>

            {/* Tỷ lệ chuyển đổi */}
            <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <i className="fas fa-chart-line text-orange-600"></i>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Tỷ lệ chuyển đổi</h3>
          </div>
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className="text-2xl font-semibold text-gray-900">{formatNumber(currentData.conversion.current, 'conversion')}</h2>
                  <div className="group relative">
                    <div className="flex items-center text-sm font-medium">
                      <span className="text-green-600">
                        <i className="fas fa-arrow-up text-xs mr-1"></i>
                        {calculateChange(currentData.conversion.current, currentData.conversion.previous).value}%
                      </span>
                      <span className="text-gray-400 mx-1">|</span>
                      <span className="text-gray-500 text-xs">{formatNumber(currentData.conversion.previous, 'conversion')}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 right-0 bg-gray-900 text-white text-xs p-2 rounded whitespace-nowrap">
                      <div>So với tháng trước:</div>
                      <div className="flex justify-between gap-3">
                        <span>Tháng này:</span>
                        <span className="font-medium">{formatNumber(currentData.conversion.current, 'conversion')}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span>Tháng trước:</span>
                        <span className="font-medium">{formatNumber(currentData.conversion.previous, 'conversion')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500 font-medium">KPI</span>
                    <span className="text-gray-900 font-semibold">{currentData.conversion.kpiPercentage}%</span>
                  </div>
                  <div 
                    className="h-2 w-full bg-gray-100 rounded-full overflow-hidden cursor-pointer"
                    onMouseMove={(e) => handleProgressHover(e, currentData.conversion.kpi, 'conversion', '%')}
                    onMouseLeave={() => handleProgressLeave('conversion')}
                  >
                    <div 
                      className="h-full bg-orange-600 rounded-full transition-all duration-300" 
                      style={{ width: `${currentData.conversion.kpiPercentage}%` }}
                    ></div>
                  </div>
                  {hoverValue.conversion && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                      {hoverValue.conversion}
                    </div>
                  )}
              </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart Section */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Biểu đồ doanh thu</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {/* Dropdown chọn tháng/năm */}
                  {chartView === 'day' && (
                    <>
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {months.map((month, index) => (
                          <option key={index} value={index}>{month}</option>
                        ))}
                      </select>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>Năm {year}</option>
                        ))}
                      </select>
                    </>
                  )}
                  {chartView === 'month' && (
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>Năm {year}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setChartView('day')}
                    className={`px-3 py-1 rounded ${
                      chartView === 'day'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Ngày
                  </button>
                  <button
                    onClick={() => setChartView('month')}
                    className={`px-3 py-1 rounded ${
                      chartView === 'month'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tháng
                  </button>
                  <button
                    onClick={() => setChartView('year')}
                    className={`px-3 py-1 rounded ${
                      chartView === 'year'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Năm
                  </button>
              </div>
              </div>
            </div>
            <div className="h-[400px]">
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </div>

          {/* Sales Pipeline Section */}
          <div className="bg-white p-4 rounded-lg shadow">
            <SalesFunnel data={sampleFunnelData} />
          </div>

          {/* Leads Trend and KPI Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-3">
              <KPITargets data={sampleKPIData} />
            </div>
          </div>
        </div>

        {/* Right Sidebar - 4 cột */}
        <div className="col-span-4 space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Thao tác nhanh</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Xem tất cả
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                <i className="fas fa-plus-circle"></i>
                <span className="text-sm font-medium">Thêm Lead</span>
              </button>
              <button className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                <i className="fas fa-phone"></i>
                <span className="text-sm font-medium">Gọi điện</span>
              </button>
              <button className="flex items-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                <i className="fas fa-calendar-plus"></i>
                <span className="text-sm font-medium">Lịch hẹn</span>
              </button>
              <button className="flex items-center gap-2 p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                <i className="fas fa-tasks"></i>
                <span className="text-sm font-medium">Tạo task</span>
              </button>
            </div>
          </div>

          {/* Important Notifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Thông báo quan trọng</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Xem tất cả
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div 
                onClick={() => setLocation('/contracts/renewal')}
                className="bg-red-50 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-red-100 hover:shadow-md hover:transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <i className="fas fa-file-contract text-red-600"></i>
                  <div>
                    <p className="text-sm font-medium text-red-900">Gia hạn hợp đồng</p>
                    <p className="text-xs text-red-700">5 hợp đồng</p>
                  </div>
                </div>
              </div>
              <div 
                onClick={() => setLocation('/reports/pending')}
                className="bg-yellow-50 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-yellow-100 hover:shadow-md hover:transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <i className="fas fa-file-alt text-yellow-600"></i>
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Duyệt báo cáo</p>
                    <p className="text-xs text-yellow-700">3 báo cáo</p>
                  </div>
                </div>
              </div>
              <div 
                onClick={() => setLocation('/meetings/schedule')}
                className="bg-blue-50 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-100 hover:shadow-md hover:transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <i className="fas fa-users text-blue-600"></i>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Họp team</p>
                    <p className="text-xs text-blue-700">2:00 PM</p>
                  </div>
                </div>
              </div>
              <div 
                onClick={() => setLocation('/leads/distribution')}
                className="bg-green-50 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-green-100 hover:shadow-md hover:transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-2">
                  <i className="fas fa-user-plus text-green-600"></i>
                  <div>
                    <p className="text-sm font-medium text-green-900">Phân lead</p>
                    <p className="text-xs text-green-700">12 lead mới</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Priority Tasks */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Nhiệm vụ ưu tiên</h4>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Gọi điện cho khách hàng ABC</p>
                    <p className="text-xs text-gray-500">Nguyễn Thanh • 06/06/2025</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">Cấp</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Gửi báo giá cho khách hàng XYZ</p>
                    <p className="text-xs text-gray-500">Trần Minh • 05/06/2025</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Trung bình</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Chuẩn bị tài liệu cho cuộc họp</p>
                    <p className="text-xs text-gray-500">Lê Hương • 06/06/2025</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">Cấp</span>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">Thông báo từ AI</h4>
                <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                  Xem tất cả
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <i className="fas fa-user-plus text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Lead mới từ Facebook Ads - Ngành giáo dục</p>
                    <p className="text-xs text-gray-500">2 phút trước</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <i className="fas fa-tasks text-red-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Task quá hạn: Follow up KH Công ty XYZ</p>
                    <p className="text-xs text-gray-500">15 phút trước</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <i className="fas fa-calendar text-purple-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Lịch họp: Demo sản phẩm cho ABC Corp</p>
                    <p className="text-xs text-gray-500">30 phút trước</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <i className="fas fa-exchange-alt text-green-600 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Deal #123 đã chuyển sang giai đoạn Đàm phán</p>
                    <p className="text-xs text-gray-500">1 giờ trước</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Hoạt động gần đây</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Xem tất cả
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: 'Thêm mới lead từ Facebook Ads',
                  subtext: 'Công ty ABC Technology - Gói Enterprise',
                  time: '2 phút trước',
                  icon: 'fa-user-plus',
                  color: 'bg-blue-100 text-blue-600'
                },
                {
                  title: 'Tạo đơn hàng mới',
                  subtext: 'Gói Premium - 50 triệu/năm',
                  time: '15 phút trước',
                  icon: 'fa-shopping-bag',
                  color: 'bg-green-100 text-green-600'
                },
                {
                  title: 'Lịch hẹn demo sản phẩm',
                  subtext: 'Công ty XYZ Corp - 15:00 chiều nay',
                  time: '45 phút trước',
                  icon: 'fa-phone',
                  color: 'bg-indigo-100 text-indigo-600'
                },
                {
                  title: 'Gửi báo giá cho khách hàng',
                  subtext: 'Gói Basic & Premium - Công ty DEF',
                  time: '2 giờ trước',
                  icon: 'fa-file-alt',
                  color: 'bg-yellow-100 text-yellow-600'
                },
                {
                  title: 'Nhận thanh toán từ khách hàng',
                  subtext: 'Gói Enterprise - 120 triệu',
                  time: '3 giờ trước',
                  icon: 'fa-dollar-sign',
                  color: 'bg-emerald-100 text-emerald-600'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full ${activity.color.split(' ')[0]} flex items-center justify-center`}>
                    <i className={`fas ${activity.icon} ${activity.color.split(' ')[1]}`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.subtext}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Sales Table */}
          <div className="mb-6">
            <TopSalesTable data={sampleTopSalesData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;