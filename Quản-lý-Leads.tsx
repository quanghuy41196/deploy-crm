import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';

interface LeadActivity {
  type: string;
  date: string;
  content: string;
  user: string;
}

interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  source: string;
  location: string;
  value: string;
  status: string;
  assignee: string;
  lastContact: string;
  created: string;
  notes: string;
  activities: LeadActivity[];
}

interface SalesTeamMember {
  id: number;
  name: string;
  avatar: string;
  role: string;
  leads: number;
}

interface Role {
  icon: string;
  label: string;
  desc: string;
  menus: string[];
  permissions: string[];
}

const salesTeam: SalesTeamMember[] = [
  { id: 1, name: 'Nguyễn Thành', avatar: 'NT', role: 'Sales Manager', leads: 42 },
  { id: 2, name: 'Trần Minh', avatar: 'TM', role: 'Senior Sales', leads: 38 },
  { id: 3, name: 'Lê Hương', avatar: 'LH', role: 'Sales Executive', leads: 35 },
  { id: 4, name: 'Phạm Anh', avatar: 'PA', role: 'Sales Executive', leads: 25 }
];

const getSourceColor = (source: string): string => {
  switch (source) {
    case 'Zalo OA':
      return 'bg-blue-100 text-blue-800';
    case 'Facebook Ads':
      return 'bg-indigo-100 text-indigo-800';
    case 'Google Ads':
      return 'bg-red-100 text-red-800';
    case 'Thủ công':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getSourceIcon = (source: string): string => {
  switch (source) {
    case 'Zalo OA':
      return 'fas fa-comment-alt';
    case 'Facebook Ads':
      return 'fab fa-facebook';
    case 'Google Ads':
      return 'fab fa-google';
    case 'Thủ công':
      return 'fas fa-user-edit';
    default:
      return 'fas fa-question';
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Tiếp nhận':
      return 'bg-blue-100 text-blue-800';
    case 'Tư vấn':
      return 'bg-purple-100 text-purple-800';
    case 'Báo giá':
      return 'bg-yellow-100 text-yellow-800';
    case 'Đàm phán':
      return 'bg-orange-100 text-orange-800';
    case 'Chốt':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface FormData {
  name: string;
  phone: string;
  email: string;
  source: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  value: string;
  status: string;
  assignee: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  source?: string;
}

const App: React.FC = () => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('leads');
  const [viewMode, setViewMode] = useState('table');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<number | null>(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [leadsData, setLeadsData] = useState<Lead[]>([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      source: 'Zalo OA',
      status: 'Tiếp nhận',
      value: '50.000.000đ',
      assignee: 'Nguyễn Thành',
      phone: '0987654321',
      email: 'nguyenvana@gmail.com',
      location: 'Hà Nội',
      lastContact: '2024-03-15',
      created: '2024-03-14',
      notes: 'Khách hàng quan tâm đến sản phẩm X',
      activities: [
        {
          type: 'call',
          date: '2024-03-15',
          content: 'Đã gọi điện tư vấn sản phẩm',
          user: 'Nguyễn Thành'
        }
      ]
    },
    {
      id: 2,
      name: 'Trần Thị B',
      source: 'Facebook Ads',
      status: 'Tư vấn',
      value: '75.000.000đ',
      assignee: 'Trần Minh',
      phone: '0987654322',
      email: 'tranthib@gmail.com',
      location: 'TP.HCM',
      lastContact: '2024-03-14',
      created: '2024-03-13',
      notes: 'Đã tư vấn qua Facebook',
      activities: [
        {
          type: 'message',
          date: '2024-03-14',
          content: 'Đã gửi báo giá qua email',
          user: 'Trần Minh'
        }
      ]
    }
  ]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    source: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    value: '',
    status: 'Tiếp nhận',
    assignee: '',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const roles = [
    {
      icon: "👑",
      label: "Admin",
      desc: "Toàn quyền",
      menus: [
        "dashboard",
        "leads",
        "customers",
        "orders",
        "products",
        "tasks",
        "calendar",
        "employees",
        "kpis",
        "marketing",
        "reports",
        "settings",
      ],
      permissions: ["view", "edit", "system", "automation", "import_export"],
    },
    {
      label: 'Sales Manager',
      menus: ['dashboard', 'leads', 'customers', 'orders', 'tasks', 'calendar', 'kpis', 'reports']
    },
    {
      label: 'Sales',
      menus: ['leads', 'customers', 'orders', 'tasks', 'calendar']
    }
  ];

  // State for leads data
  const [leads, setLeads] = useState<Lead[]>(leadsData);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(leadsData);
  
  // State for filters
  const [filters, setFilters] = useState({
    status: 'all',
    source: '',
    assignee: '',
    search: ''
  });

  // State for modals and selection
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);

  // Filter leads when filters change
  useEffect(() => {
    let result = [...leads];

    if (filters.status !== 'all') {
      result = result.filter(lead => lead.status === filters.status);
    }

    if (filters.source) {
      result = result.filter(lead => lead.source === filters.source);
    }

    if (filters.assignee) {
      result = result.filter(lead => lead.assignee === filters.assignee);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(lead =>
        lead.name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.phone.includes(searchLower)
      );
    }

    setFilteredLeads(result);
  }, [leads, filters]);

  // Handle lead operations
  const handleAddLead = (newLead: Omit<Lead, 'id' | 'activities' | 'created' | 'lastContact'>) => {
    const lead: Lead = {
      id: Date.now(),
      ...newLead,
      activities: [],
      created: new Date().toLocaleDateString(),
      lastContact: new Date().toLocaleDateString()
    };
    setLeads(prev => [...prev, lead]);
    setShowAddLeadModal(false);
  };

  const handleEditLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
  };

  const handleDeleteLead = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lead này?')) {
      setLeads(prev => prev.filter(lead => lead.id !== id));
      if (selectedLead === id) {
        setSelectedLead(null);
      }
    }
  };

  const handleAssignLead = (leadId: number, assignee: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          assignee,
          activities: [
            ...lead.activities,
            {
              type: 'assign',
              date: new Date().toLocaleDateString(),
              content: `Đã phân công cho ${assignee}`,
              user: 'Admin'
            }
          ]
        };
      }
      return lead;
    }));
    setShowAssignModal(false);
  };

  const handleUpdateLeadStatus = (leadId: number, newStatus: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          status: newStatus,
          activities: [
            ...lead.activities,
            {
              type: 'status',
              date: new Date().toLocaleDateString(),
              content: `Đã cập nhật trạng thái thành ${newStatus}`,
              user: 'Admin'
            }
          ]
        };
      }
      return lead;
    }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập họ và tên';
      isValid = false;
    }

    // Validate phone
    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
      isValid = false;
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.trim())) {
      errors.phone = 'Số điện thoại không hợp lệ';
      isValid = false;
    }

    // Validate email
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Email không hợp lệ';
      isValid = false;
    }

    // Validate source
    if (!formData.source) {
      errors.source = 'Vui lòng chọn nguồn';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      handleAddLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        source: formData.source,
        status: formData.status,
        value: formData.value || '0đ',
        assignee: formData.assignee,
        location: [formData.province, formData.district, formData.ward, formData.address]
          .filter(Boolean)
          .join(', '),
        notes: formData.notes
      });
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        source: '',
        province: '',
        district: '',
        ward: '',
        address: '',
        value: '',
        status: 'Tiếp nhận',
        assignee: '',
        notes: ''
      });
      setFormErrors({});
    }
  };

  // Location data
  const provinces = [
    { id: 1, name: 'Hà Nội' },
    { id: 2, name: 'TP.HCM' },
    { id: 3, name: 'Đà Nẵng' }
  ];

  const districts = {
    'Hà Nội': [
      { id: 1, name: 'Hoàn Kiếm' },
      { id: 2, name: 'Ba Đình' },
      { id: 3, name: 'Đống Đa' }
    ],
    'TP.HCM': [
      { id: 1, name: 'Quận 1' },
      { id: 2, name: 'Quận 2' },
      { id: 3, name: 'Quận 3' }
    ],
    'Đà Nẵng': [
      { id: 1, name: 'Hải Châu' },
      { id: 2, name: 'Thanh Khê' },
      { id: 3, name: 'Sơn Trà' }
    ]
  };

  const wards = {
    'Hoàn Kiếm': [
      { id: 1, name: 'Phường Hàng Trống' },
      { id: 2, name: 'Phường Hàng Bông' },
      { id: 3, name: 'Phường Hàng Gai' }
    ],
    'Quận 1': [
      { id: 1, name: 'Phường Bến Nghé' },
      { id: 2, name: 'Phường Bến Thành' },
      { id: 3, name: 'Phường Đa Kao' }
    ],
    'Hải Châu': [
      { id: 1, name: 'Phường Hải Châu 1' },
      { id: 2, name: 'Phường Hải Châu 2' },
      { id: 3, name: 'Phường Nam Dương' }
    ]
  };

  // Initialize charts
  useEffect(() => {
    // Lead Source Chart
    const leadSourceChart = echarts.init(document.getElementById('leadSourceChart'));
    const leadSourceData = [
      { value: leadsData.filter(lead => lead.source === 'Zalo OA').length, name: 'Zalo OA' },
      { value: leadsData.filter(lead => lead.source === 'Facebook Ads').length, name: 'Facebook Ads' },
      { value: leadsData.filter(lead => lead.source === 'Google Ads').length, name: 'Google Ads' },
      { value: leadsData.filter(lead => lead.source === 'Thủ công').length, name: 'Thủ công' }
    ];

    const leadSourceOption = {
      title: {
        text: 'Phân bố nguồn Leads',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: leadSourceData.map(item => item.name)
      },
      series: [
        {
          name: 'Nguồn Leads',
          type: 'pie',
          radius: '50%',
          data: leadSourceData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    leadSourceChart.setOption(leadSourceOption);

    // Conversion Rate Chart
    const conversionRateChart = echarts.init(document.getElementById('conversionRateChart'));
    const sources = ['Zalo OA', 'Facebook Ads', 'Google Ads', 'Thủ công'];
    const conversionData = sources.map(source => {
      const totalLeads = leadsData.filter(lead => lead.source === source).length;
      const convertedLeads = leadsData.filter(lead => lead.source === source && lead.status === 'Chốt').length;
      return {
        source,
        total: totalLeads,
        converted: convertedLeads,
        rate: totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(1) : 0
      };
    });

    const conversionRateOption = {
      title: {
        text: 'Tỷ lệ chuyển đổi theo nguồn',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          const data = conversionData[params[0].dataIndex];
          return `${data.source}<br/>
            Tổng số leads: ${data.total}<br/>
            Đã chuyển đổi: ${data.converted}<br/>
            Tỷ lệ: ${data.rate}%`;
        }
      },
      legend: {
        data: ['Tổng Leads', 'Chuyển đổi'],
        top: 'bottom'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: sources
      },
      yAxis: {
        type: 'value',
        name: 'Số lượng'
      },
      series: [
        {
          name: 'Tổng Leads',
          type: 'bar',
          data: conversionData.map(item => item.total)
        },
        {
          name: 'Chuyển đổi',
          type: 'bar',
          data: conversionData.map(item => item.converted)
        }
      ]
    };
    conversionRateChart.setOption(conversionRateOption);

    // Handle window resize
    const handleResize = () => {
      leadSourceChart.resize();
      conversionRateChart.resize();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      leadSourceChart.dispose();
      conversionRateChart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [leadsData]);

  return (
    <div className="flex h-screen max-w-[1920px] mx-auto bg-gray-50 text-gray-800 overflow-hidden">
      {/* Sidebar Navigation */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isMenuCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            {!isMenuCollapsed && (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-600 mr-2">V</span>
                <span className="text-xl font-bold text-gray-800">iLead CRM</span>
              </div>
            )}
            {isMenuCollapsed && (
              <span className="text-2xl font-bold text-blue-600">V</span>
            )}
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
              className="hidden md:block p-2 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <i className={`fas ${isMenuCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-gray-500`}></i>
            </button>
          </div>
        </div>

        {/* Role Description */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          {!isMenuCollapsed && (
            <p className="text-sm text-gray-600">Admin Dashboard</p>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4">
          <ul>
            {[
              { id: 'dashboard', name: 'Tổng quan', icon: 'fa-home', emoji: '🏠' },
              { id: 'leads', name: 'Quản lý Leads', icon: 'fa-users', emoji: '👥' },
              { id: 'customers', name: 'Quản lý Khách hàng', icon: 'fa-user', emoji: '👤' },
              { id: 'orders', name: 'Quản lý Đơn hàng', icon: 'fa-shopping-cart', emoji: '🛒' },
              { id: 'products', name: 'Quản lý Sản phẩm', icon: 'fa-box', emoji: '📦' },
              { id: 'tasks', name: 'Quản lý Công việc', icon: 'fa-check-square', emoji: '✅' },
              { id: 'calendar', name: 'Lịch', icon: 'fa-calendar', emoji: '📅' },
              { id: 'employees', name: 'Quản lý Nhân viên', icon: 'fa-user-tie', emoji: '👨‍💼' },
              { id: 'kpis', name: 'KPIs', icon: 'fa-bullseye', emoji: '🎯' },
              { id: 'marketing', name: 'Marketing', icon: 'fa-bullhorn', emoji: '📢' },
              { id: 'reports', name: 'Báo cáo', icon: 'fa-chart-bar', emoji: '📊' },
              { id: 'settings', name: 'Cài đặt', icon: 'fa-cog', emoji: '⚙️' }
            ].filter(item => {
              const currentRole = roles.find(r => r.label === selectedRole);
              return currentRole?.menus.includes(item.id);
            }).map(item => (
              <li key={item.id} className="mb-1">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center w-full px-4 py-3 text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {isMenuCollapsed ? (
                    <span className="text-lg">{item.emoji}</span>
                  ) : (
                    <>
                      <span className="w-6 text-lg">{item.emoji}</span>
                      <span className="ml-3">{item.name}</span>
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 z-10">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">Quản lý Leads</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm lead theo tên, email, số điện thoại..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Quick Add Button */}
            <button
              onClick={() => setShowAddLeadModal(true)}
              className="p-2 text-gray-600 hover:text-blue-600"
            >
              <i className="fas fa-plus-circle text-xl"></i>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 text-gray-600 hover:text-blue-600"
              >
                <i className="fas fa-bell text-xl"></i>
                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                  3
                </span>
              </button>
              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Thông báo</h3>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Đánh dấu tất cả đã đọc
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[
                      {
                        id: 1,
                        type: 'lead',
                        title: 'Lead mới từ Facebook Ads',
                        description: 'Trần Thị B đã đăng ký tư vấn sản phẩm',
                        time: '5 phút trước',
                        unread: true
                      },
                      {
                        id: 2,
                        type: 'task',
                        title: 'Nhắc nhở công việc',
                        description: 'Đến hạn gọi điện follow up khách hàng Nguyễn Văn A',
                        time: '1 giờ trước',
                        unread: true
                      },
                      {
                        id: 3,
                        type: 'system',
                        title: 'Cập nhật hệ thống',
                        description: 'Hệ thống sẽ bảo trì vào 23:00 tối nay',
                        time: '2 giờ trước',
                        unread: true
                      }
                    ].map(notification => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${notification.unread ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            notification.type === 'lead' ? 'bg-blue-100 text-blue-600' :
                            notification.type === 'task' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            <i className={`fas ${
                              notification.type === 'lead' ? 'fa-user-plus' :
                              notification.type === 'task' ? 'fa-tasks' :
                              'fa-bell'
                            } text-sm`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {notification.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <div className="ml-3">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button className="text-sm text-center w-full text-gray-600 hover:text-gray-900">
                      Xem tất cả thông báo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <span className="text-sm font-medium">NT</span>
                </div>
                <span className="text-sm font-medium hidden md:block">Nguyễn Thành</span>
                <i className="fas fa-chevron-down text-xs text-gray-500"></i>
              </button>
              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <span className="text-sm font-medium">NT</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Nguyễn Thành</p>
                        <p className="text-xs text-gray-500">Sales Manager</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    {[
                      { icon: 'fa-user', text: 'Thông tin cá nhân' },
                      { icon: 'fa-cog', text: 'Cài đặt' },
                      { icon: 'fa-bell', text: 'Thông báo' },
                      { icon: 'fa-question-circle', text: 'Trợ giúp' }
                    ].map((item, index) => (
                      <button
                        key={index}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <i className={`fas ${item.icon} w-5`}></i>
                        <span>{item.text}</span>
                      </button>
                    ))}
                  </div>
                  <div className="py-1 border-t border-gray-200">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      <i className="fas fa-sign-out-alt w-5"></i>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Page Header */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Quản lý Leads</h2>
                  <p className="text-gray-500">Quản lý và theo dõi tất cả các leads trong hệ thống</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAddLeadModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer !rounded-button whitespace-nowrap"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    <span>Thêm Lead mới</span>
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer !rounded-button whitespace-nowrap">
                    <i className="fas fa-file-import mr-2"></i>
                    <span>Import Excel</span>
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {/* View Mode Toggle */}
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      viewMode === "table"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    } cursor-pointer !rounded-button whitespace-nowrap`}
                  >
                    <i className="fas fa-table mr-2"></i>
                    <span>Bảng</span>
                  </button>
                  <button
                    onClick={() => setViewMode("kanban")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      viewMode === "kanban"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    } cursor-pointer !rounded-button whitespace-nowrap`}
                  >
                    <i className="fas fa-columns mr-2"></i>
                    <span>Kanban</span>
                  </button>
                </div>
                {/* Status Filter */}
                <div className="relative">
                  <select
                    className="appearance-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer pr-10 !rounded-button whitespace-nowrap"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Tiếp nhận">Tiếp nhận</option>
                    <option value="Tư vấn">Tư vấn</option>
                    <option value="Báo giá">Báo giá</option>
                    <option value="Đàm phán">Đàm phán</option>
                    <option value="Chốt">Chốt</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                  </div>
                </div>
                {/* Source Filter */}
                <div className="relative">
                  <select 
                    className="appearance-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer pr-10 !rounded-button whitespace-nowrap"
                    value={filters.source}
                    onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                  >
                    <option value="">Tất cả nguồn</option>
                    <option value="Zalo OA">Zalo OA</option>
                    <option value="Facebook Ads">Facebook Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Thủ công">Thủ công</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                  </div>
                </div>
                {/* Assignee Filter */}
                <div className="relative">
                  <select 
                    className="appearance-none px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer pr-10 !rounded-button whitespace-nowrap"
                    value={filters.assignee}
                    onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
                  >
                    <option value="">Tất cả nhân viên</option>
                    {salesTeam.map((member) => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                  </div>
                </div>
                {/* Search */}
                <div className="flex-1 max-w-xl">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm lead theo tên, email, số điện thoại..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <i className="fas fa-search text-gray-400"></i>
                    </div>
                  </div>
                </div>
                {/* Advanced Filter Button */}
                <button
                  onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2 !rounded-button whitespace-nowrap"
                >
                  <i className="fas fa-filter"></i>
                  <span>Lọc nâng cao</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Table View */}
          {viewMode === "table" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nguồn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá trị
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người phụ trách
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Liên hệ gần nhất
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className={`hover:bg-gray-50 ${selectedLead === lead.id ? "bg-blue-50" : ""}`}
                        onClick={() => setSelectedLead(selectedLead === lead.id ? null : lead.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {lead.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                              <div className="text-sm text-gray-500">{lead.email}</div>
                              <div className="text-sm text-gray-500">{lead.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`p-1.5 rounded-lg ${getSourceColor(lead.source)} mr-2`}>
                              <i className={`fas ${getSourceIcon(lead.source)}`}></i>
                            </div>
                            <span className="text-sm text-gray-900">{lead.source}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lead.value}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                              <span className="text-xs font-medium">
                                {lead.assignee.split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{lead.assignee}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.lastContact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLead(lead.id);
                                setShowAddLeadModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 cursor-pointer !rounded-button whitespace-nowrap"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowAssignModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 cursor-pointer !rounded-button whitespace-nowrap"
                            >
                              <i className="fas fa-user-plus"></i>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLead(lead.id);
                              }}
                              className="text-red-600 hover:text-red-900 cursor-pointer !rounded-button whitespace-nowrap"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Main Content - Kanban View */}
          {viewMode === "kanban" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6 h-[calc(100vh-350px)]">
              {["Tiếp nhận", "Tư vấn", "Báo giá", "Đàm phán", "Chốt"].map((status) => (
                <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${
                        status === "Tiếp nhận"
                          ? "bg-blue-500"
                          : status === "Tư vấn"
                            ? "bg-purple-500"
                            : status === "Báo giá"
                              ? "bg-yellow-500"
                              : status === "Đàm phán"
                                ? "bg-orange-500"
                                : "bg-green-500"
                      }`}></span>
                      <h3 className="font-medium">{status}</h3>
                    </div>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {filteredLeads.filter((lead) => lead.status === status).length}
                    </span>
                  </div>
                  <div className="flex-1 p-2 overflow-y-auto">
                    {filteredLeads
                      .filter((lead) => lead.status === status)
                      .map((lead) => (
                        <div
                          key={lead.id}
                          className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm mb-2 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setSelectedLead(selectedLead === lead.id ? null : lead.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 font-medium">{lead.name.charAt(0)}</span>
                              </div>
                              <div className="ml-2">
                                <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                              </div>
                            </div>
                            <div className={`p-1 rounded-lg ${getSourceColor(lead.source)}`}>
                              <i className={`fas ${getSourceIcon(lead.source)} text-xs`}></i>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mb-1">{lead.phone}</div>
                          <div className="text-xs text-gray-500 mb-2">{lead.email}</div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-medium text-gray-900">{lead.value}</div>
                            <div className="text-xs text-gray-500">{lead.lastContact}</div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                <span className="text-xs">{lead.assignee.split(" ").map((n) => n[0]).join("")}</span>
                              </div>
                              <div className="ml-1 text-xs text-gray-500">{lead.assignee}</div>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLead(lead.id);
                                  setShowAddLeadModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 cursor-pointer !rounded-button whitespace-nowrap"
                              >
                                <i className="fas fa-edit text-xs"></i>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowAssignModal(true);
                                }}
                                className="text-green-600 hover:text-green-900 cursor-pointer !rounded-button whitespace-nowrap"
                              >
                                <i className="fas fa-user-plus text-xs"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="p-2 border-t border-gray-200">
                    <button
                      onClick={() => setShowAddLeadModal(true)}
                      className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg flex items-center justify-center cursor-pointer !rounded-button whitespace-nowrap"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      <span>Thêm Lead</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Lead Detail */}
          {selectedLead && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              {/* ... Lead Detail Content ... */}
            </div>
          )}

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* ... Analytics Content ... */}
          </div>

          {/* Sales Team Performance */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            {/* ... Sales Team Performance Content ... */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App; 