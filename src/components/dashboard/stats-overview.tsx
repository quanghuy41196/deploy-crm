import React from 'react';

interface StatData {
  value: string;
  target: string;
  percent: number;
}

interface StatsOverviewProps {
  stats: {
    revenue: StatData;
    customers: StatData;
    leads: StatData;
    tasks: StatData;
  };
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(stats).map(([key, data]) => (
        <div key={key} className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 capitalize">
            {key === 'revenue' ? 'Doanh thu' :
             key === 'customers' ? 'Khách hàng' :
             key === 'leads' ? 'Leads' : 'Công việc'}
          </h3>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="text-2xl font-semibold">{data.value}</p>
              <p className="text-sm text-gray-500">Mục tiêu: {data.target}</p>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${data.percent}%` }}
                />
              </div>
              <span className="ml-2 text-sm font-medium">{data.percent}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;