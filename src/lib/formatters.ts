import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCompactCurrency = (amount: number): string => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B VND`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M VND`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K VND`;
  }
  return `${amount.toLocaleString('vi-VN')} VND`;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '-';
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: vi });
  } catch (error) {
    return '-';
  }
};

export const formatDateShort = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '-';
    return format(dateObj, 'dd/MM/yyyy', { locale: vi });
  } catch (error) {
    return '-';
  }
};

export const formatTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '-';
    return format(dateObj, 'HH:mm', { locale: vi });
  } catch (error) {
    return '-';
  }
};

export const formatPhone = (phone: string): string => {
  // Vietnamese phone number formatting
  if (phone.length === 10) {
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3');
  } else if (phone.length === 11) {
    return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1.$2.$3');
  }
  return phone;
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} phút`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} giờ`;
  }
  
  return `${hours} giờ ${remainingMinutes} phút`;
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    // Lead statuses
    new: 'text-gray-600 bg-gray-100',
    contacted: 'text-blue-600 bg-blue-100',
    potential: 'text-green-600 bg-green-100',
    not_interested: 'text-red-600 bg-red-100',
    
    // Order statuses
    pending: 'text-yellow-600 bg-yellow-100',
    confirmed: 'text-blue-600 bg-blue-100',
    processing: 'text-purple-600 bg-purple-100',
    shipped: 'text-indigo-600 bg-indigo-100',
    delivered: 'text-green-600 bg-green-100',
    cancelled: 'text-red-600 bg-red-100',
    
    // Task priorities
    low: 'text-gray-600 bg-gray-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-orange-600 bg-orange-100',
    urgent: 'text-red-600 bg-red-100',
    
    // Task statuses
    completed: 'text-green-600 bg-green-100',
    in_progress: 'text-blue-600 bg-blue-100',
  };
  
  return statusColors[status] || 'text-gray-600 bg-gray-100';
};

export const getSourceIcon = (source: string): string => {
  const sourceIcons: Record<string, string> = {
    facebook: '📘',
    zalo: '💬',
    google_ads: '🔍',
    manual: '📝',
  };
  
  return sourceIcons[source] || '📄';
};
