import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

interface KPITarget {
  name: string;
  current: number;
  target: number;
  unit: string;
  type: 'currency' | 'number' | 'percentage';
}

interface KPITargetsProps {
  data: KPITarget[];
}

export default function KPITargets({ data }: KPITargetsProps) {
  const formatValue = (value: number, type: string, unit: string) => {
    if (type === 'currency') {
      return formatCurrency(value);
    }
    if (type === 'percentage') {
      return `${value}%`;
    }
    return `${value}${unit}`;
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90) return "bg-green-600";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-blue-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Mục Tiêu & KPIs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((kpi, index) => {
            const percentage = Math.min(100, (kpi.current / kpi.target) * 100);
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm text-gray-600">{kpi.name}</span>
                  <span className="text-sm text-gray-900">
                    {formatValue(kpi.current, kpi.type, kpi.unit)} /{' '}
                    {formatValue(kpi.target, kpi.type, kpi.unit)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={percentage} 
                    className={`h-2 ${getProgressColor(kpi.current, kpi.target)}`}
                  />
                  <span className="text-sm font-medium w-12 text-gray-600">
                    {Math.round(percentage)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 