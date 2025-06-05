import React from 'react';
import { formatCurrency } from '@/lib/formatters';
import { Lead } from '@/types/lead';

interface LeadsKanbanProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: number) => void;
}

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

const LeadsKanban: React.FC<LeadsKanbanProps> = ({ leads = sampleLeads, onEdit, onDelete }) => {
  const getSourceColor = (source: string) => {
    switch (source) {
      case "Zalo OA":
        return "bg-blue-100 text-blue-600";
      case "Facebook Ads":
        return "bg-indigo-100 text-indigo-600";
      case "Google Ads":
        return "bg-red-100 text-red-600";
      case "Website":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "Zalo OA":
        return "fa-comment";
      case "Facebook Ads":
        return "fa-facebook";
      case "Google Ads":
        return "fa-google";
      case "Website":
        return "fa-globe";
      default:
        return "fa-user";
    }
  };

  const statuses = ["Tiếp nhận", "Tư vấn", "Báo giá", "Đàm phán", "Chốt"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-350px)]">
      {statuses.map((status) => (
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
              {leads.filter((lead) => lead.status === status).length}
            </span>
          </div>
          <div className="flex-1 p-2 overflow-y-auto">
            {leads
              .filter((lead) => lead.status === status)
              .map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm mb-2 hover:shadow-md transition-shadow"
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
                    <div className="text-xs font-medium text-gray-900">{formatCurrency(lead.value)}</div>
                    <div className="text-xs text-gray-500">{new Date(lead.lastContact).toLocaleDateString('vi-VN')}</div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <span className="text-xs">{lead.assignedTo.split(" ").map((n) => n[0]).join("")}</span>
                      </div>
                      <div className="ml-1 text-xs text-gray-500">{lead.assignedTo}</div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => onEdit(lead)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <i className="fas fa-edit text-xs"></i>
                      </button>
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadsKanban;