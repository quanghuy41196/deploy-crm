import React from 'react';

interface FunnelStage {
  name: string;
  count: number;
  color: string;
  width: string;
  conversion: string;
}

const SalesFunnel: React.FC = () => {
  const funnelStages: FunnelStage[] = [
    {
      name: "Tiềm năng",
      count: 254,
      color: "from-indigo-400 to-indigo-500",
      width: "100%",
      conversion: "100%"
    },
    {
      name: "Liên hệ",
      count: 186,
      color: "from-blue-400 to-blue-500",
      width: "85%",
      conversion: "73.2%"
    },
    {
      name: "Đàm phán",
      count: 124,
      color: "from-cyan-400 to-cyan-500",
      width: "70%",
      conversion: "48.8%"
    },
    {
      name: "Đề xuất",
      count: 68,
      color: "from-teal-400 to-teal-500",
      width: "55%",
      conversion: "26.8%"
    },
    {
      name: "Chốt",
      count: 42,
      color: "from-green-500 to-green-600",
      width: "40%",
      conversion: "16.5%"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Main Title */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Phễu bán hàng</h3>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-blue-600 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Lead Sources Section */}
      <div className="mb-8">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Nguồn Leads</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Facebook */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="font-medium text-gray-900">Facebook</span>
              </div>
              <span className="text-sm font-medium text-gray-600">24.5%</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phản hồi 24h</span>
                <span className="font-medium text-blue-600">85%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Giá trị TB</span>
                <span className="font-medium text-green-600">2.5tr</span>
              </div>
            </div>
          </div>

          {/* Google */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <span className="font-medium text-gray-900">Google</span>
              </div>
              <span className="text-sm font-medium text-gray-600">18.2%</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phản hồi 24h</span>
                <span className="font-medium text-blue-600">85%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Giá trị TB</span>
                <span className="font-medium text-green-600">2.5tr</span>
              </div>
            </div>
          </div>

          {/* Zalo */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                <span className="font-medium text-gray-900">Zalo</span>
              </div>
              <span className="text-sm font-medium text-gray-600">15.3%</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phản hồi 24h</span>
                <span className="font-medium text-blue-600">85%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Giá trị TB</span>
                <span className="font-medium text-green-600">2.5tr</span>
              </div>
            </div>
          </div>

          {/* Others */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span className="font-medium text-gray-900">Khác</span>
              </div>
              <span className="text-sm font-medium text-gray-600">8.7%</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phản hồi 24h</span>
                <span className="font-medium text-blue-600">85%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Giá trị TB</span>
                <span className="font-medium text-green-600">2.5tr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phễu chuyển đổi Section */}
      <div className="mb-8">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Phễu chuyển đổi</h4>
        <div className="relative flex flex-col items-center space-y-4">
          {funnelStages.map((stage, index) => (
            <div key={index} className="relative w-full group">
              <div
                className={`relative h-16 bg-gradient-to-r ${stage.color} rounded-lg mx-auto transition-all 
                  ${stage.name === "Chốt" ? "hover:scale-105" : "hover:scale-102"} 
                  hover:shadow-lg cursor-pointer`}
                style={{ width: stage.width }}
              >
                <div className="absolute inset-0 flex items-center justify-between px-4 text-white">
                  <span className="font-medium">{stage.name}</span>
                  <div className="flex flex-col items-end">
                    <span className="font-bold">{stage.count}</span>
                    <span className="text-sm">{stage.conversion}</span>
                  </div>
                </div>

                {/* Tooltip */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-2 px-3 z-10">
                  <div className="flex flex-col">
                    <span className="font-bold">{stage.count} leads</span>
                    <span>Giai đoạn: {stage.name}</span>
                    <span>Tỉ lệ chuyển đổi: {stage.conversion}</span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>

              {/* Arrow connector */}
              {index < funnelStages.length - 1 && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-gray-400 z-10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tỷ lệ chuyển đổi tổng Section */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-blue-800">Tỷ lệ chuyển đổi tổng</h4>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center">
                <div className="bg-white rounded-lg px-3 py-2 shadow-sm mr-3">
                  <span className="text-xl font-bold text-blue-600">16.5%</span>
                </div>
                <div className="text-sm text-blue-700">
                  <p className="font-medium">42/254 leads thành công</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm font-medium">+2.3%</span>
                </div>
                <p className="text-xs text-blue-600">so với tháng trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesFunnel;