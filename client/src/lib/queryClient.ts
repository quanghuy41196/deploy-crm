import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });

      // Handle authentication redirects (302)
      if (res.status === 302) {
        if (unauthorizedBehavior === "returnNull") {
          return null;
        }
        return null;
      }

      if (res.status === 401) {
        if (unauthorizedBehavior === "returnNull") {
          return null;
        }
        return null;
      }

      if (!res.ok) {
        if (unauthorizedBehavior === "returnNull") {
          return null;
        }
        return null;
      }

      return await res.json();
    } catch (error) {
      // Silently handle network errors without console warnings
      if (unauthorizedBehavior === "returnNull") {
        return null;
      }
      return null;
    }
  };

// Demo data for Leader role - Team A
const demoData: { [key: string]: any } = {
  '/api/dashboard/stats': {
    monthlyRevenue: 180000000,
    newLeads: 85,
    orders: 32,
    conversionRate: 9.2,
    pipeline: {
      reception: 25,
      consulting: 18,
      quoted: 12,
      negotiating: 8,
      closed: 15
    }
  },
  '/api/dashboard/top-sales': [
    { user: { firstName: "Nguyễn Văn", lastName: "Anh" }, deals: 15, revenue: 60000000 },
    { user: { firstName: "Trần Thị", lastName: "Bình" }, deals: 12, revenue: 48000000 },
    { user: { firstName: "Lê Văn", lastName: "Cường" }, deals: 10, revenue: 40000000 },
    { user: { firstName: "Phạm Thị", lastName: "Dung" }, deals: 8, revenue: 32000000 }
  ],
  '/api/dashboard/lead-sources': [
    { source: "Facebook", count: 35, conversionRate: 12.5 },
    { source: "Zalo", count: 28, conversionRate: 15.2 },
    { source: "Google Ads", count: 22, conversionRate: 8.7 }
  ],
  '/api/auth/user': {
    id: "leader_a",
    firstName: "Nguyễn Văn",
    lastName: "Anh",
    email: "leader.a@company.com",
    role: "leader"
  },
  '/api/leads': { 
    leads: [
      {
        id: 1,
        name: "Nguyễn Văn A",
        phone: "0901234567",
        email: "nguyenvana@email.com",
        source: "facebook",
        region: "ha_noi",
        product: "Website",
        status: "new",
        stage: "reception",
        value: "15000000",
        notes: "Quan tâm thiết kế website bán hàng",
        assignedTo: "sale_a1",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: "Trần Thị B",
        phone: "0912345678",
        email: "tranthib@email.com",
        source: "zalo",
        region: "ho_chi_minh",
        product: "Marketing",
        status: "contacted",
        stage: "consulting",
        value: "8000000",
        notes: "Cần hỗ trợ quảng cáo Facebook",
        assignedTo: "sale_a2",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], 
    total: 2 
  },
  '/api/customers': { 
    customers: [
      {
        id: 1,
        name: "Công ty TNHH ABC",
        phone: "0281234567",
        email: "contact@abc.com",
        address: "123 Nguyễn Huệ, Q1, TP.HCM",
        type: "company",
        assignedTo: "sale_a1",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], 
    total: 1 
  },
  '/api/orders': { 
    orders: [
      {
        id: 1,
        orderNumber: "ORD001",
        value: "15000000",
        status: "completed",
        customerId: 1,
        createdBy: "sale_a1",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], 
    total: 1 
  },
  '/api/tasks': { 
    tasks: [
      {
        id: 1,
        title: "Gọi điện cho khách hàng ABC",
        description: "Tư vấn về gói dịch vụ website",
        type: "call",
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        priority: "high",
        status: "pending",
        assignedTo: "sale_a1",
        createdBy: "leader_a",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], 
    total: 1 
  },
  '/api/products': { 
    products: [
      {
        id: 1,
        name: "Website bán hàng",
        description: "Thiết kế website bán hàng chuyên nghiệp",
        price: "15000000",
        category: "website",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], 
    total: 1 
  }
};

// Function to get user role from localStorage or default to leader
const getCurrentUserRole = () => {
  return localStorage.getItem('userRole') || 'leader';
};

// Function to filter data based on user role
const getFilteredData = (endpoint: string, role: string) => {
  const baseData = demoData[endpoint] || {};
  
  // For dashboard stats, adjust numbers based on role
  if (endpoint === '/api/dashboard/stats') {
    if (role === 'admin') {
      return {
        ...baseData,
        monthlyRevenue: 450000000, // All teams
        newLeads: 285,
        orders: 95,
        conversionRate: 11.8,
        pipeline: {
          reception: 85,
          consulting: 68,
          quoted: 42,
          negotiating: 28,
          closed: 62
        }
      };
    } else if (role === 'ceo') {
      return {
        ...baseData,
        monthlyRevenue: 450000000,
        newLeads: 285,
        orders: 95,
        conversionRate: 11.8,
        pipeline: {
          reception: 85,
          consulting: 68,
          quoted: 42,
          negotiating: 28,
          closed: 62
        }
      };
    } else if (role === 'leader') {
      return {
        ...baseData,
        monthlyRevenue: 180000000, // Team A only
        newLeads: 85,
        orders: 32,
        conversionRate: 9.2,
        pipeline: {
          reception: 25,
          consulting: 18,
          quoted: 12,
          negotiating: 8,
          closed: 15
        }
      };
    } else { // sale role
      return {
        ...baseData,
        monthlyRevenue: 45000000, // Personal only
        newLeads: 12,
        orders: 8,
        conversionRate: 8.5,
        pipeline: {
          reception: 8,
          consulting: 3,
          quoted: 1,
          negotiating: 0,
          closed: 2
        }
      };
    }
  }
  
  // For top sales, filter based on role
  if (endpoint === '/api/dashboard/top-sales') {
    if (role === 'admin' || role === 'ceo') {
      // Show all teams
      return [
        { user: { firstName: "Nguyễn Văn", lastName: "Anh" }, deals: 15, revenue: 60000000, team: "Nhóm A" },
        { user: { firstName: "Trần Thị", lastName: "Bình" }, deals: 12, revenue: 48000000, team: "Nhóm A" },
        { user: { firstName: "Lê Văn", lastName: "Cường" }, deals: 10, revenue: 40000000, team: "Nhóm A" },
        { user: { firstName: "Võ Thị", lastName: "Hoa" }, deals: 18, revenue: 72000000, team: "Nhóm B" },
        { user: { firstName: "Đặng Văn", lastName: "Minh" }, deals: 14, revenue: 56000000, team: "Nhóm B" }
      ];
    } else if (role === 'leader') {
      // Show only team members
      return baseData;
    } else {
      // Show only personal stats
      return [
        { user: { firstName: "Bạn", lastName: "" }, deals: 8, revenue: 32000000, team: "Cá nhân" }
      ];
    }
  }
  
  // For leads, filter based on role
  if (endpoint === '/api/leads') {
    if (role === 'admin' || role === 'ceo') {
      // Show more leads from all teams
      return {
        leads: [
          ...baseData.leads,
          {
            id: 3,
            name: "Võ Thị Hoa",
            phone: "0956789012",
            email: "vothihoa@email.com",
            source: "google_ads",
            region: "can_tho",
            product: "SEO",
            status: "potential",
            stage: "negotiating",
            value: "18000000",
            notes: "Quan tâm dịch vụ SEO cho website",
            assignedTo: "sale_b1",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        total: 3
      };
    } else if (role === 'leader') {
      return baseData;
    } else {
      // Show only personal leads
      return {
        leads: baseData.leads.filter((lead: any) => lead.assignedTo === 'sale_a1'),
        total: 1
      };
    }
  }
  
  return baseData;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const endpoint = queryKey[0] as string;
        const userRole = getCurrentUserRole();
        return getFilteredData(endpoint, userRole);
      },
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
