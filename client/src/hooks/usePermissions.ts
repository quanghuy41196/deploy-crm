import { useState, useEffect } from 'react';

export type UserRole = 'admin' | 'ceo' | 'leader' | 'sale';

export interface Permissions {
  // Dashboard permissions
  canViewAllDashboard: boolean;
  canViewTeamDashboard: boolean;
  canViewPersonalDashboard: boolean;
  
  // Leads permissions
  canViewAllLeads: boolean;
  canViewTeamLeads: boolean;
  canViewPersonalLeads: boolean;
  canAssignLeads: boolean;
  canImportExportLeads: boolean;
  canEditLeads: boolean;
  
  // Customers permissions
  canViewAllCustomers: boolean;
  canViewTeamCustomers: boolean;
  canViewPersonalCustomers: boolean;
  canImportExportCustomers: boolean;
  canEditCustomers: boolean;
  
  // Orders permissions
  canViewAllOrders: boolean;
  canViewTeamOrders: boolean;
  canViewPersonalOrders: boolean;
  canEditOrders: boolean;
  
  // Products permissions
  canViewAllProducts: boolean;
  canViewProductHistory: boolean;
  canImportExportProducts: boolean;
  canEditProducts: boolean;
  
  // Tasks permissions
  canViewAllTasks: boolean;
  canViewTeamTasks: boolean;
  canViewPersonalTasks: boolean;
  canEditTasks: boolean;
  
  // Calendar permissions
  canViewAllCalendar: boolean;
  canViewTeamCalendar: boolean;
  canViewPersonalCalendar: boolean;
  
  // Employees permissions
  canViewAllEmployees: boolean;
  canViewTeamEmployees: boolean;
  canEditEmployees: boolean;
  canManagePermissions: boolean;
  
  // KPIs permissions
  canViewAllKPIs: boolean;
  canViewTeamKPIs: boolean;
  canEditKPIs: boolean;
  
  // Marketing permissions
  canViewAllMarketing: boolean;
  canViewTeamMarketing: boolean;
  canEditMarketing: boolean;
  canManageAutomation: boolean;
  
  // Reports permissions
  canViewAllReports: boolean;
  canViewTeamReports: boolean;
  canViewPersonalReports: boolean;
  canCustomizeReports: boolean;
  canExportReports: boolean;
  
  // Settings permissions
  canViewAllSettings: boolean;
  canViewCompanySettings: boolean;
  canEditSettings: boolean;
  canManageIntegrations: boolean;
}

const getPermissionsByRole = (role: UserRole): Permissions => {
  switch (role) {
    case 'admin':
      return {
        // Dashboard - Admin: toàn quyền
        canViewAllDashboard: true,
        canViewTeamDashboard: true,
        canViewPersonalDashboard: true,
        
        // Leads - Admin: toàn quyền
        canViewAllLeads: true,
        canViewTeamLeads: true,
        canViewPersonalLeads: true,
        canAssignLeads: true,
        canImportExportLeads: true,
        canEditLeads: true,
        
        // Customers - Admin: toàn quyền
        canViewAllCustomers: true,
        canViewTeamCustomers: true,
        canViewPersonalCustomers: true,
        canImportExportCustomers: true,
        canEditCustomers: true,
        
        // Orders - Admin: toàn quyền
        canViewAllOrders: true,
        canViewTeamOrders: true,
        canViewPersonalOrders: true,
        canEditOrders: true,
        
        // Products - Admin: toàn quyền
        canViewAllProducts: true,
        canViewProductHistory: true,
        canImportExportProducts: true,
        canEditProducts: true,
        
        // Tasks - Admin: toàn quyền
        canViewAllTasks: true,
        canViewTeamTasks: true,
        canViewPersonalTasks: true,
        canEditTasks: true,
        
        // Calendar - Admin: toàn quyền
        canViewAllCalendar: true,
        canViewTeamCalendar: true,
        canViewPersonalCalendar: true,
        
        // Employees - Admin: toàn quyền
        canViewAllEmployees: true,
        canViewTeamEmployees: true,
        canEditEmployees: true,
        canManagePermissions: true,
        
        // KPIs - Admin: toàn quyền
        canViewAllKPIs: true,
        canViewTeamKPIs: true,
        canEditKPIs: true,
        
        // Marketing - Admin: toàn quyền
        canViewAllMarketing: true,
        canViewTeamMarketing: true,
        canEditMarketing: true,
        canManageAutomation: true,
        
        // Reports - Admin: toàn quyền
        canViewAllReports: true,
        canViewTeamReports: true,
        canViewPersonalReports: true,
        canCustomizeReports: true,
        canExportReports: true,
        
        // Settings - Admin: toàn quyền
        canViewAllSettings: true,
        canViewCompanySettings: true,
        canEditSettings: true,
        canManageIntegrations: true,
      };

    case 'ceo':
      return {
        // Dashboard - CEO: xem toàn bộ
        canViewAllDashboard: true,
        canViewTeamDashboard: true,
        canViewPersonalDashboard: true,
        
        // Leads - CEO: xem toàn bộ, không phân bổ/nhập xuất
        canViewAllLeads: true,
        canViewTeamLeads: true,
        canViewPersonalLeads: true,
        canAssignLeads: false,
        canImportExportLeads: false,
        canEditLeads: true,
        
        // Customers - CEO: xem toàn bộ, không nhập xuất
        canViewAllCustomers: true,
        canViewTeamCustomers: true,
        canViewPersonalCustomers: true,
        canImportExportCustomers: false,
        canEditCustomers: true,
        
        // Orders - CEO: xem toàn bộ, không chỉnh sửa
        canViewAllOrders: true,
        canViewTeamOrders: true,
        canViewPersonalOrders: true,
        canEditOrders: false,
        
        // Products - CEO: xem toàn bộ, không nhập xuất
        canViewAllProducts: true,
        canViewProductHistory: true,
        canImportExportProducts: false,
        canEditProducts: false,
        
        // Tasks - CEO: xem toàn bộ
        canViewAllTasks: true,
        canViewTeamTasks: true,
        canViewPersonalTasks: true,
        canEditTasks: true,
        
        // Calendar - CEO: xem toàn bộ
        canViewAllCalendar: true,
        canViewTeamCalendar: true,
        canViewPersonalCalendar: true,
        
        // Employees - CEO: xem toàn bộ, không chỉnh sửa/phân quyền
        canViewAllEmployees: true,
        canViewTeamEmployees: true,
        canEditEmployees: false,
        canManagePermissions: false,
        
        // KPIs - CEO: xem toàn bộ, không chỉnh sửa
        canViewAllKPIs: true,
        canViewTeamKPIs: true,
        canEditKPIs: false,
        
        // Marketing - CEO: xem toàn bộ, không quản lý automation
        canViewAllMarketing: true,
        canViewTeamMarketing: true,
        canEditMarketing: false,
        canManageAutomation: false,
        
        // Reports - CEO: xem toàn bộ, không xuất
        canViewAllReports: true,
        canViewTeamReports: true,
        canViewPersonalReports: true,
        canCustomizeReports: true,
        canExportReports: false,
        
        // Settings - CEO: xem công ty, không chỉnh sửa
        canViewAllSettings: false,
        canViewCompanySettings: true,
        canEditSettings: false,
        canManageIntegrations: false,
      };

    case 'leader':
      return {
        // Dashboard - Leader: xem đội
        canViewAllDashboard: false,
        canViewTeamDashboard: true,
        canViewPersonalDashboard: true,
        
        // Leads - Leader: quản lý đội
        canViewAllLeads: false,
        canViewTeamLeads: true,
        canViewPersonalLeads: true,
        canAssignLeads: true,
        canImportExportLeads: false,
        canEditLeads: true,
        
        // Customers - Leader: quản lý đội
        canViewAllCustomers: false,
        canViewTeamCustomers: true,
        canViewPersonalCustomers: true,
        canImportExportCustomers: false,
        canEditCustomers: true,
        
        // Orders - Leader: quản lý đội
        canViewAllOrders: false,
        canViewTeamOrders: true,
        canViewPersonalOrders: true,
        canEditOrders: true,
        
        // Products - Leader: chỉ xem, không chỉnh sửa/lịch sử
        canViewAllProducts: true,
        canViewProductHistory: false,
        canImportExportProducts: false,
        canEditProducts: false,
        
        // Tasks - Leader: quản lý đội
        canViewAllTasks: false,
        canViewTeamTasks: true,
        canViewPersonalTasks: true,
        canEditTasks: true,
        
        // Calendar - Leader: quản lý đội
        canViewAllCalendar: false,
        canViewTeamCalendar: true,
        canViewPersonalCalendar: true,
        
        // Employees - Leader: xem đội, không chỉnh sửa/nhật ký
        canViewAllEmployees: false,
        canViewTeamEmployees: true,
        canEditEmployees: false,
        canManagePermissions: false,
        
        // KPIs - Leader: xem đội, không chỉnh sửa
        canViewAllKPIs: false,
        canViewTeamKPIs: true,
        canEditKPIs: false,
        
        // Marketing - Leader: xem đội, không chỉnh sửa automation
        canViewAllMarketing: false,
        canViewTeamMarketing: true,
        canEditMarketing: false,
        canManageAutomation: false,
        
        // Reports - Leader: xem đội, không xuất/tùy chỉnh
        canViewAllReports: false,
        canViewTeamReports: true,
        canViewPersonalReports: true,
        canCustomizeReports: false,
        canExportReports: false,
        
        // Settings - Leader: không truy cập
        canViewAllSettings: false,
        canViewCompanySettings: false,
        canEditSettings: false,
        canManageIntegrations: false,
      };

    case 'sale':
      return {
        // Dashboard - Sale: chỉ cá nhân
        canViewAllDashboard: false,
        canViewTeamDashboard: false,
        canViewPersonalDashboard: true,
        
        // Leads - Sale: chỉ cá nhân
        canViewAllLeads: false,
        canViewTeamLeads: false,
        canViewPersonalLeads: true,
        canAssignLeads: false,
        canImportExportLeads: false,
        canEditLeads: true,
        
        // Customers - Sale: chỉ cá nhân
        canViewAllCustomers: false,
        canViewTeamCustomers: false,
        canViewPersonalCustomers: true,
        canImportExportCustomers: false,
        canEditCustomers: true,
        
        // Orders - Sale: chỉ cá nhân
        canViewAllOrders: false,
        canViewTeamOrders: false,
        canViewPersonalOrders: true,
        canEditOrders: true,
        
        // Products - Sale: chỉ xem, không chỉnh sửa/lịch sử
        canViewAllProducts: true,
        canViewProductHistory: false,
        canImportExportProducts: false,
        canEditProducts: false,
        
        // Tasks - Sale: chỉ cá nhân
        canViewAllTasks: false,
        canViewTeamTasks: false,
        canViewPersonalTasks: true,
        canEditTasks: true,
        
        // Calendar - Sale: chỉ cá nhân
        canViewAllCalendar: false,
        canViewTeamCalendar: false,
        canViewPersonalCalendar: true,
        
        // Employees - Sale: không truy cập
        canViewAllEmployees: false,
        canViewTeamEmployees: false,
        canEditEmployees: false,
        canManagePermissions: false,
        
        // KPIs - Sale: không truy cập
        canViewAllKPIs: false,
        canViewTeamKPIs: false,
        canEditKPIs: false,
        
        // Marketing - Sale: không truy cập
        canViewAllMarketing: false,
        canViewTeamMarketing: false,
        canEditMarketing: false,
        canManageAutomation: false,
        
        // Reports - Sale: chỉ cá nhân, không xuất/tùy chỉnh
        canViewAllReports: false,
        canViewTeamReports: false,
        canViewPersonalReports: true,
        canCustomizeReports: false,
        canExportReports: false,
        
        // Settings - Sale: không truy cập
        canViewAllSettings: false,
        canViewCompanySettings: false,
        canEditSettings: false,
        canManageIntegrations: false,
      };

    default:
      // Default to sale permissions for safety
      return getPermissionsByRole('sale');
  }
};

export function usePermissions() {
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('userRole') as UserRole) || 'leader';
  });

  const permissions = getPermissionsByRole(userRole);

  const setRole = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
    
    // Force refresh to update all data with new role
    window.location.reload();
  };

  return {
    userRole,
    permissions,
    setRole,
  };
}