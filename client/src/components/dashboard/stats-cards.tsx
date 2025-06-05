import { DollarSign, Users, ShoppingCart, Target, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { usePermissions } from "@/hooks/usePermissions";

interface StatsCardsProps {
  stats?: {
    monthlyRevenue: number;
    newLeads: number;
    orders: number;
    conversionRate: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const { userRole } = usePermissions();
  
  // Role-based data
  const roleBasedData = {
    admin: {
      revenue: "1.25 tỷ đ",
      customers: "254",
      conversion: "24.5%",
      opportunities: "42",
      changeRevenue: "+12.5%",
      changeCustomers: "+18.2%", 
      changeConversion: "+3.8%",
      changeOpportunities: "-2.4%"
    },
    ceo: {
      revenue: "1.25 tỷ đ",
      customers: "254", 
      conversion: "24.5%",
      opportunities: "42",
      changeRevenue: "+12.5%",
      changeCustomers: "+18.2%",
      changeConversion: "+3.8%", 
      changeOpportunities: "-2.4%"
    },
    leader: {
      revenue: "420.5 triệu đ",
      customers: "85",
      conversion: "22.3%",
      opportunities: "15",
      changeRevenue: "+8.7%",
      changeCustomers: "+12.4%",
      changeConversion: "+2.1%",
      changeOpportunities: "-1.8%"
    },
    sale: {
      revenue: "125.2 triệu đ", 
      customers: "28",
      conversion: "18.5%",
      opportunities: "8",
      changeRevenue: "+5.2%",
      changeCustomers: "+9.1%",
      changeConversion: "+1.5%",
      changeOpportunities: "-0.5%"
    }
  };

  const currentData = roleBasedData[userRole] || roleBasedData.sale;

  const statCards = [
    {
      title: "Tổng doanh thu",
      value: currentData.revenue,
      change: currentData.changeRevenue,
      icon: "fa-dollar-sign",
      color: "bg-blue-500",
      negative: false,
    },
    {
      title: "Khách hàng mới", 
      value: currentData.customers,
      change: currentData.changeCustomers,
      icon: "fa-users",
      color: "bg-green-500", 
      negative: false,
    },
    {
      title: "Tỷ lệ chuyển đổi",
      value: currentData.conversion,
      change: currentData.changeConversion,
      icon: "fa-chart-line",
      color: "bg-purple-500",
      negative: false,
    },
    {
      title: "Cơ hội mở",
      value: currentData.opportunities,
      change: currentData.changeOpportunities,
      icon: "fa-handshake", 
      color: "bg-orange-500",
      negative: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {stat.title}
              </p>
              <h3 className="text-xl font-bold mt-1">{stat.value}</h3>
              <div
                className={`flex items-center mt-2 ${stat.negative ? "text-red-500" : "text-green-500"}`}
              >
                <i
                  className={`fas ${stat.negative ? "fa-arrow-down" : "fa-arrow-up"} mr-1 text-xs`}
                ></i>
                <span className="text-sm font-medium">{stat.change}</span>
                <span className="text-xs text-gray-500 ml-1">
                  so với tháng trước
                </span>
              </div>
            </div>
            <div
              className={`p-2.5 rounded-full ${stat.color} text-white`}
            >
              <i className={`fas ${stat.icon} text-base`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
