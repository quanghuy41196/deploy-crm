export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  contactPerson: string;
  title: string;
  email: string;
  phone: string;
  region: string;
  value: number;
  stage: string;
  assignedTo: string;
  tags: string[];
  score: number;
  analytics: {
    views: number;
    interactions: number;
    conversions: number;
    lastContact: string;
  };
  timeline: Array<{
    id: string;
    type: string;
    date: string;
    description: string;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    dueDate: string;
    status: string;
  }>;
  communications: Array<{
    id: string;
    type: string;
    date: string;
    content: string;
  }>;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  status: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  totalOrders: number;
  totalSpent: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
  assignedTo: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  analytics: {
    reach: number;
    engagement: number;
    conversions: number;
    roi: number;
  };
}

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  status: string;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  date: string;
  data: any;
}

export interface KPI {
  monthlyRevenue: number;
  orders: number;
  newLeads: number;
  conversionRate: number;
  salesMetrics: {
    deals_closed: number;
    revenue: number;
    conversion_rate: number;
    customer_acquisition: number;
    sales_cycle: number;
    satisfaction_score: number;
  };
  marketingMetrics: {
    leads_generated: number;
    cost_per_lead: number;
    campaign_roi: number;
    customer_acquisition: number;
    revenue_growth: number;
    pipeline_velocity: number;
  };
  supportMetrics: {
    satisfaction_score: number;
    retention_rate: number;
    support_tickets: number;
    team_productivity: number;
    response_time: number;
    resolution_rate: number;
  };
}