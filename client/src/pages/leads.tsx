import React, { useState } from 'react';
import LeadsTable from '@/components/leads/leads-table';
import LeadsKanban from '@/components/leads/leads-kanban';
import LeadForm from '@/components/leads/lead-form';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload, Download, Filter, Table, Kanban, Tag, User, Calendar, TrendingUp, Target, Users, DollarSign, Eye, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercentage } from "@/lib/formatters";
import { usePermissions } from "@/hooks/usePermissions";
import { LEAD_SOURCES, LEAD_STATUSES, REGIONS } from "@/lib/constants";
import { Lead } from '@/types/lead';

const sampleLeads: Lead[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0987654321",
    source: "Facebook Ads",
    status: "Tiếp nhận",
    value: 50000000,
    assignedTo: "Trần Thị B",
    lastContact: "2024-03-20",
    location: "Hà Nội",
    company: "Công ty TNHH ABC",
    notes: "Khách hàng quan tâm đến dịch vụ X",
    createdAt: "2024-03-15",
    updatedAt: "2024-03-20"
  },
  {
    id: 2,
    name: "Trần Văn C",
    email: "tranvanc@gmail.com",
    phone: "0123456789",
    source: "Google Ads",
    status: "Tư vấn",
    value: 75000000,
    assignedTo: "Lê Văn D",
    lastContact: "2024-03-19",
    location: "Hồ Chí Minh",
    company: "Công ty CP XYZ",
    notes: "Đã tư vấn sơ bộ về giải pháp",
    createdAt: "2024-03-14",
    updatedAt: "2024-03-19"
  },
  {
    id: 3,
    name: "Phạm Thị E",
    email: "phamthie@gmail.com",
    phone: "0909090909",
    source: "Zalo OA",
    status: "Báo giá",
    value: 120000000,
    assignedTo: "Nguyễn Văn F",
    lastContact: "2024-03-18",
    location: "Đà Nẵng",
    company: "Công ty TNHH DEF",
    notes: "Đã gửi báo giá, chờ phản hồi",
    createdAt: "2024-03-13",
    updatedAt: "2024-03-18"
  },
  {
    id: 4,
    name: "Lê Thị G",
    email: "lethig@gmail.com",
    phone: "0977777777",
    source: "Website",
    status: "Đàm phán",
    value: 200000000,
    assignedTo: "Trần Văn H",
    lastContact: "2024-03-17",
    location: "Hải Phòng",
    company: "Công ty CP MNO",
    notes: "Đang thương lượng giá và điều khoản",
    createdAt: "2024-03-12",
    updatedAt: "2024-03-17"
  },
  {
    id: 5,
    name: "Hoàng Văn I",
    email: "hoangvani@gmail.com",
    phone: "0866666666",
    source: "Thủ công",
    status: "Chốt",
    value: 150000000,
    assignedTo: "Phạm Thị K",
    lastContact: "2024-03-16",
    location: "Cần Thơ",
    company: "Công ty TNHH PQR",
    notes: "Đã ký hợp đồng, chờ thanh toán",
    createdAt: "2024-03-11",
    updatedAt: "2024-03-16"
  }
];

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(sampleLeads);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [showForm, setShowForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');

  const handleAddLead = (lead: Lead) => {
    const newLead = {
      ...lead,
      id: leads.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastContact: new Date().toISOString(),
    };
    setLeads([...leads, newLead]);
    setShowForm(false);
  };

  const handleEditLead = (lead: Lead) => {
    setLeads(leads.map(l => l.id === lead.id ? { ...lead, updatedAt: new Date().toISOString() } : l));
    setShowForm(false);
    setSelectedLead(undefined);
  };

  const handleDeleteLead = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lead này?')) {
      setLeads(leads.filter(lead => lead.id !== id));
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSource = selectedSource === '' || lead.source === selectedSource;
    const matchesStatus = selectedStatus === '' || lead.status === selectedStatus;
    const matchesAssignee = selectedAssignee === '' || lead.assignedTo === selectedAssignee;

    return matchesSearch && matchesSource && matchesStatus && matchesAssignee;
  });

  const sources = Array.from(new Set(leads.map(lead => lead.source)));
  const statuses = Array.from(new Set(leads.map(lead => lead.status)));
  const assignees = Array.from(new Set(leads.map(lead => lead.assignedTo)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Leads</h1>
                <p className="text-sm text-gray-500">Quản lý và theo dõi tất cả các leads trong hệ thống</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedLead(undefined);
                    setShowForm(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Thêm Lead mới
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center">
                  <i className="fas fa-file-excel mr-2"></i>
                  Import Excel
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả nguồn</option>
                {sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả người phụ trách</option>
                {assignees.map(assignee => (
                  <option key={assignee} value={assignee}>{assignee}</option>
                ))}
              </select>
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 text-sm font-medium flex items-center ${
                    viewMode === 'table'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <i className="fas fa-table mr-2"></i>
                  Bảng
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-4 py-2 text-sm font-medium flex items-center ${
                    viewMode === 'kanban'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <i className="fas fa-columns mr-2"></i>
                  Kanban
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-6 py-6">
        {viewMode === 'table' ? (
          <LeadsTable
            leads={filteredLeads}
            onEdit={(lead) => {
              setSelectedLead(lead);
              setShowForm(true);
            }}
            onDelete={handleDeleteLead}
          />
        ) : (
          <LeadsKanban
            leads={filteredLeads}
            onEdit={(lead) => {
              setSelectedLead(lead);
              setShowForm(true);
            }}
            onDelete={handleDeleteLead}
          />
        )}
      </div>

      {/* Lead Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <LeadForm
              lead={selectedLead}
              onSubmit={selectedLead ? handleEditLead : handleAddLead}
              onClose={() => {
                setShowForm(false);
                setSelectedLead(undefined);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
