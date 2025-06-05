import { Button } from "@/components/ui/button";

interface SalesFunnelProps {
  data: {
    leadSources: Array<{
      name: string;
      count: string;
      rate: string;
      responseRate: string;
      avgValue: string;
      icon: string;
      color: string;
    }>;
    funnelStages: Array<{
      name: string;
      count: number;
      rate: string;
    }>;
    conversionRate: {
      value: string;
      change: string;
      successCount: string;
      totalCount: string;
    };
  };
}

export default function SalesFunnel({ data }: SalesFunnelProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Phễu bán hàng</h3>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Nguồn Leads</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {data.leadSources.map((source) => (
            <div key={source.name} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 ${source.color} rounded-full flex items-center justify-center`}>
                    <i className={`${source.icon} text-white text-sm`}></i>
                  </div>
                  <span className="font-medium text-gray-900">{source.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-600">{source.rate}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phản hồi 24h</span>
                  <span className="font-medium text-blue-600">{source.responseRate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Giá trị TB</span>
                  <span className="font-medium text-green-600">{source.avgValue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Phễu chuyển đổi</h4>
        <div className="relative flex flex-col items-center space-y-4">
          {data.funnelStages.map((stage, index) => (
            <div key={stage.name} className="relative w-full group">
              <div
                className="relative h-16 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-lg mx-auto transition-all hover:scale-102 hover:shadow-lg cursor-pointer"
                style={{ width: `${100 - index * 15}%` }}
              >
                <div className="absolute inset-0 flex items-center justify-between px-4 text-white">
                  <span className="font-medium">{stage.name}</span>
                  <div className="flex flex-col items-end">
                    <span className="font-bold">{stage.count}</span>
                    <span className="text-sm">{stage.rate}</span>
                  </div>
                </div>
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-2 px-3 z-10">
                  <div className="flex flex-col">
                    <span className="font-bold">{stage.count} leads</span>
                    <span>Giai đoạn: {stage.name}</span>
                    <span>Tỉ lệ chuyển đổi: {stage.rate}</span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>
              {index < data.funnelStages.length - 1 && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-gray-400 z-10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-blue-800">Tỷ lệ chuyển đổi tổng</h4>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center">
                <div className="bg-white rounded-lg px-3 py-2 shadow-sm mr-3">
                  <span className="text-xl font-bold text-blue-600">{data.conversionRate.value}</span>
                </div>
                <div className="text-sm text-blue-700">
                  <p className="font-medium">{data.conversionRate.successCount}/{data.conversionRate.totalCount} leads thành công</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm font-medium">{data.conversionRate.change}</span>
                </div>
                <p className="text-xs text-blue-600">so với tháng trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 