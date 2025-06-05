import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface TopSalesEntry {
  id: number;
  name: string;
  avatar?: string;
  position: string;
  revenue: number;
  deals: number;
  conversionRate: number;
}

interface TopSalesTableProps {
  data: TopSalesEntry[];
}

export default function TopSalesTable({ data }: TopSalesTableProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Top Doanh Số</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-12 text-sm font-medium text-gray-500 pb-2 border-b">
            <div className="col-span-4">Nhân viên</div>
            <div className="col-span-3 text-right">Doanh số</div>
            <div className="col-span-2 text-right">Deals</div>
            <div className="col-span-3 text-right">Tỷ lệ chuyển đổi</div>
          </div>
          <div className="space-y-3">
            {data.map((entry) => (
              <div key={entry.id} className="grid grid-cols-12 items-center text-sm">
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {entry.avatar ? (
                        <img src={entry.avatar} alt={entry.name} />
                      ) : (
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {entry.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{entry.name}</div>
                      <div className="text-xs text-gray-500">{entry.position}</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 text-right font-medium">
                  {formatCurrency(entry.revenue)}
                </div>
                <div className="col-span-2 text-right font-medium">
                  {entry.deals}
                </div>
                <div className="col-span-3 text-right">
                  <span className={`font-medium ${entry.conversionRate >= 50 ? 'text-green-600' : entry.conversionRate >= 30 ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {entry.conversionRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 