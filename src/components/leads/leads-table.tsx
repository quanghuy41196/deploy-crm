import React, { useState } from 'react';
import { formatCurrency } from '@/lib/formatters';
import { Lead } from '@/types/lead';

interface LeadsTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: number) => void;
}

interface ColumnConfig {
  id: string;
  title: string;
  visible: boolean;
  group: string;
}

const defaultColumns: ColumnConfig[] = [
  // Thông tin cơ bản
  { id: 'id', title: 'ID', visible: true, group: 'Thông tin cơ bản' },
  { id: 'name', title: 'Tên KH', visible: true, group: 'Thông tin cơ bản' },
  { id: 'phone', title: 'Số ĐT', visible: true, group: 'Thông tin cơ bản' },
  { id: 'email', title: 'Email', visible: true, group: 'Thông tin cơ bản' },
  
  // Nguồn và phân loại
  { id: 'source', title: 'Nguồn', visible: true, group: 'Nguồn và phân loại' },
  { id: 'region', title: 'Khu vực', visible: true, group: 'Nguồn và phân loại' },
  { id: 'product', title: 'Sản phẩm', visible: true, group: 'Nguồn và phân loại' },
  { id: 'content', title: 'Nội dung', visible: true, group: 'Nguồn và phân loại' },
  
  // Trạng thái và quy trình
  { id: 'status', title: 'Trạng thái', visible: true, group: 'Trạng thái và quy trình' },
  { id: 'stage', title: 'Giai đoạn', visible: true, group: 'Trạng thái và quy trình' },
  { id: 'assignedTo', title: 'Phân công', visible: true, group: 'Trạng thái và quy trình' },
  
  // Giá trị và theo dõi
  { id: 'value', title: 'Giá trị', visible: true, group: 'Giá trị và theo dõi' },
  { id: 'notes', title: 'Ghi chú', visible: true, group: 'Giá trị và theo dõi' },
  { id: 'tags', title: 'Tags', visible: true, group: 'Giá trị và theo dõi' },
  { id: 'lastContact', title: 'Liên hệ cuối', visible: true, group: 'Giá trị và theo dõi' },
  { id: 'createdAt', title: 'Ngày tạo', visible: true, group: 'Giá trị và theo dõi' },
  
  // Thao tác
  { id: 'actions', title: 'Thao tác', visible: true, group: 'Thao tác' }
];

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onEdit, onDelete }) => {
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [isTableView, setIsTableView] = useState(true);

  const getSourceColor = (source: string) => {
    switch (source) {
      case "Zalo":
        return "bg-blue-100 text-blue-600";
      case "Facebook":
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
      case "Zalo":
        return "fa-comment";
      case "Facebook":
        return "fa-facebook";
      case "Google Ads":
        return "fa-google";
      case "Website":
        return "fa-globe";
      default:
        return "fa-user";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Mới":
        return "bg-blue-100 text-blue-800";
      case "Đã liên hệ":
        return "bg-purple-100 text-purple-800";
      case "Tiềm năng":
        return "bg-green-100 text-green-800";
      case "Không quan tâm":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Tiếp nhận":
        return "bg-blue-100 text-blue-800";
      case "Tư vấn":
        return "bg-purple-100 text-purple-800";
      case "Báo giá":
        return "bg-yellow-100 text-yellow-800";
      case "Đàm phán":
        return "bg-orange-100 text-orange-800";
      case "Đóng deal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  };

  const renderColumnSelector = () => {
    const groupedColumns = columns.reduce((acc, col) => {
      if (!acc[col.group]) {
        acc[col.group] = [];
      }
      acc[col.group].push(col);
      return acc;
    }, {} as Record<string, ColumnConfig[]>);

    return (
      <div className="absolute top-0 right-0 mt-12 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Tùy chỉnh cột</h3>
          <button
            onClick={() => setShowColumnSelector(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="space-y-4">
          {Object.entries(groupedColumns).map(([group, cols]) => (
            <div key={group}>
              <h4 className="font-medium text-gray-700 mb-2">{group}</h4>
              <div className="space-y-2">
                {cols.map(col => (
                  <label key={col.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={col.visible}
                      onChange={() => toggleColumnVisibility(col.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{col.title}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCardView = (lead: Lead) => {
    return (
      <div key={lead.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-medium">{lead.name.charAt(0)}</span>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">{lead.name}</div>
              <div className="text-sm text-gray-500">{lead.phone}</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(lead)}
              className="text-blue-600 hover:text-blue-900"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={() => onDelete(lead.id)}
              className="text-red-600 hover:text-red-900"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase mb-1">Email</div>
            <div className="text-sm text-gray-900">{lead.email}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase mb-1">Nguồn</div>
            <div className="flex items-center">
              <div className={`p-1 rounded ${getSourceColor(lead.source)} mr-2`}>
                <i className={`fas ${getSourceIcon(lead.source)} text-xs`}></i>
              </div>
              <span className="text-sm text-gray-900">{lead.source}</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase mb-1">Trạng thái</div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
              {lead.status}
            </span>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase mb-1">Giai đoạn</div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStageColor(lead.stage)}`}>
              {lead.stage}
            </span>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase mb-1">Giá trị</div>
            <div className="text-sm font-medium text-gray-900">{formatCurrency(lead.value)}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase mb-1">Phân công</div>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <span className="text-xs font-medium">
                  {lead.assignedTo.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div className="ml-2 text-sm text-gray-500">{lead.assignedTo}</div>
            </div>
          </div>
        </div>

        {lead.tags && lead.tags.length > 0 && (
          <div className="mt-4">
            <div className="text-xs font-medium text-gray-500 uppercase mb-1">Tags</div>
            <div className="flex flex-wrap gap-1">
              {lead.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Liên hệ cuối: {new Date(lead.lastContact).toLocaleDateString('vi-VN')}</span>
            <span>Ngày tạo: {new Date(lead.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
      </div>
    );
  };

  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Chưa có dữ liệu leads
      </div>
    );
  }

  const visibleColumns = columns.filter(col => col.visible);

  return (
    <div className="relative">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsTableView(true)}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              isTableView
                ? 'bg-blue-50 text-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-table mr-2"></i>
            Dạng bảng
          </button>
          <button
            onClick={() => setIsTableView(false)}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              !isTableView
                ? 'bg-blue-50 text-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-th-large mr-2"></i>
            Dạng thẻ
          </button>
        </div>

        {isTableView && (
          <button
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <i className="fas fa-columns mr-2"></i>
            Tùy chỉnh cột
          </button>
        )}
      </div>

      {showColumnSelector && renderColumnSelector()}

      {isTableView ? (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="divide-x divide-gray-200">
                  {visibleColumns.map(col => (
                    <th
                      key={col.id}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0"
                    >
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 divide-x divide-gray-200">
                    {visibleColumns.map(col => {
                      switch (col.id) {
                        case 'id':
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {lead.id}
                            </td>
                          );
                        case 'name':
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-600 font-medium">{lead.name.charAt(0)}</span>
                                </div>
                                <div className="ml-2 text-sm font-medium text-gray-900">{lead.name}</div>
                              </div>
                            </td>
                          );
                        case 'phone':
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {lead.phone}
                            </td>
                          );
                        case 'email':
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {lead.email}
                            </td>
                          );
                        case 'source':
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`p-1.5 rounded-lg ${getSourceColor(lead.source)} mr-2`}>
                                  <i className={`fas ${getSourceIcon(lead.source)}`}></i>
                                </div>
                                <span className="text-sm text-gray-900">{lead.source}</span>
                              </div>
                            </td>
                          );
                        case 'region':
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {lead.region}
                            </td>
                          );
                        case 'product':
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {lead.product}
                            </td>
                          );
                        case 'content':
                          return (
                            <td key={col.id} className="px-4 py-3 text-sm text-gray-500">
                              <div className="line-clamp-2" title={lead.content}>{lead.content}</div>
                            </td>
                          );
                        case 'status':
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                                {lead.status}
                              </span>
                            </td>
                          );
                        case 'stage':
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStageColor(lead.stage)}`}>
                                {lead.stage}
                              </span>
                            </td>
                          );
                        case 'assignedTo':
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                  <span className="text-xs font-medium">
                                    {lead.assignedTo.split(" ").map((n) => n[0]).join("")}
                                  </span>
                                </div>
                                <div className="ml-2 text-sm text-gray-500">{lead.assignedTo}</div>
                              </div>
                            </td>
                          );
                        case 'value':
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(lead.value)}
                            </td>
                          );
                        case 'notes':
                          return (
                            <td key={col.id} className="px-4 py-3 text-sm text-gray-500">
                              <div className="line-clamp-2" title={lead.notes}>{lead.notes}</div>
                            </td>
                          );
                        case 'tags':
                          return (
                            <td key={col.id} className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {(lead.tags || []).map((tag, index) => (
                                  <span key={index} className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </td>
                          );
                        case 'lastContact':
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {new Date(lead.lastContact).toLocaleDateString('vi-VN')}
                            </td>
                          );
                        case 'createdAt':
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                            </td>
                          );
                        case 'actions':
                          return (
                            <td key={col.id} className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button 
                                  onClick={() => onEdit(lead)}
                                  className="text-blue-600 hover:text-blue-900 cursor-pointer"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() => onDelete(lead.id)}
                                  className="text-red-600 hover:text-red-900 cursor-pointer"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          );
                        default:
                          return null;
                      }
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leads.map(lead => renderCardView(lead))}
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
