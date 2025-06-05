interface PipelineOverviewProps {
  pipeline?: {
    reception: number;
    consulting: number;
    quoted: number;
    negotiating: number;
    closed: number;
  };
}

export default function PipelineOverview({ pipeline }: PipelineOverviewProps) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Phễu bán hàng</h3>
        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-500 hover:text-blue-600">
            <i className="fas fa-sync-alt"></i>
          </button>
          <button className="p-1 text-gray-500 hover:text-blue-600">
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>

      {/* Lead Sources Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Nguồn Leads
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              name: "Facebook",
              count: "125",
              rate: "24.5%",
              icon: "fab fa-facebook",
              color: "bg-blue-100 text-blue-600",
            },
            {
              name: "Google",
              count: "98",
              rate: "18.2%",
              icon: "fab fa-google",
              color: "bg-red-100 text-red-600",
            },
            {
              name: "Zalo",
              count: "76",
              rate: "15.3%",
              icon: "fas fa-comment-alt",
              color: "bg-blue-100 text-blue-600",
            },
            {
              name: "Khác",
              count: "42",
              rate: "8.7%",
              icon: "fas fa-globe",
              color: "bg-gray-100 text-gray-600",
            },
          ].map((source, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-lg ${source.color} flex items-center justify-center mr-2`}
                  >
                    <i className={source.icon}></i>
                  </div>
                  <span className="font-medium text-sm">
                    {source.name}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {source.rate}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-blue-50 rounded p-2">
                  <p className="text-xs text-gray-500">Phản hồi 24h</p>
                  <p className="text-sm font-medium text-blue-600">
                    85%
                  </p>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <p className="text-xs text-gray-500">Giá trị TB</p>
                  <p className="text-sm font-medium text-green-600">
                    2.5tr
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Funnel Visualization */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Phễu chuyển đổi
        </h4>
        <div className="relative flex flex-col items-center">
          {/* Funnel Stages */}
          {[
            {
              name: "Tiềm năng",
              count: 254,
              color: "from-indigo-400 to-indigo-500",
              width: "100%",
              conversion: "100%",
            },
            {
              name: "Liên hệ",
              count: 186,
              color: "from-blue-400 to-blue-500",
              width: "85%",
              conversion: "73.2%",
            },
            {
              name: "Đàm phán",
              count: 124,
              color: "from-cyan-400 to-cyan-500",
              width: "70%",
              conversion: "48.8%",
            },
            {
              name: "Đề xuất",
              count: 68,
              color: "from-teal-400 to-teal-500",
              width: "55%",
              conversion: "26.8%",
            },
            {
              name: "Chốt",
              count: 42,
              color: "from-green-500 to-green-600",
              width: "40%",
              conversion: "16.5%",
            },
          ].map((stage, index) => (
            <div key={index} className="relative w-full mb-2 group">
              <div
                className={`relative h-16 bg-gradient-to-r ${stage.color} rounded-lg mx-auto transition-all ${stage.name === "Chốt" ? "hover:scale-110 shadow-md" : "hover:scale-105"} hover:shadow-lg cursor-pointer`}
                style={{ width: stage.width }}
              >
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <span className="text-white font-medium">
                    {stage.name}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-white font-bold">
                      {stage.count}
                    </span>
                    <span className="text-white text-xs">
                      {stage.conversion}
                    </span>
                  </div>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-2 px-3 z-10">
                  <div className="flex flex-col">
                    <span className="font-bold">
                      {stage.count} leads
                    </span>
                    <span>Giai đoạn: {stage.name}</span>
                    <span>Tỉ lệ chuyển đổi: {stage.conversion}</span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>

              {/* Arrow between stages */}
              {index < 4 && (
                <div className="flex justify-center my-1">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-400"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
