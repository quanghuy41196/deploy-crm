import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FilterIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export interface FilterValues {
  [key: string]: any;
}

interface AdvancedFilterProps {
  fields: FilterField[];
  values: FilterValues;
  onValuesChange: (values: FilterValues) => void;
  onApply: () => void;
  onClear: () => void;
  className?: string;
}

export default function AdvancedFilter({
  fields,
  values,
  onValuesChange,
  onApply,
  onClear,
  className
}: AdvancedFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateValue = (key: string, value: any) => {
    onValuesChange({ ...values, [key]: value });
  };

  const hasActiveFilters = Object.values(values).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  const renderField = (field: FilterField) => {
    const value = values[field.key];

    switch (field.type) {
      case 'text':
        return (
          <Input
            placeholder={field.placeholder || `Nhập ${field.label.toLowerCase()}`}
            value={value || ''}
            onChange={(e) => updateValue(field.key, e.target.value)}
            className="w-full"
          />
        );

      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(val) => updateValue(field.key, val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Chọn ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "dd/MM/yyyy") : `Chọn ${field.label.toLowerCase()}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => updateValue(field.key, date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'dateRange':
        const [startDate, endDate] = value || [null, null];
        return (
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(new Date(startDate), "dd/MM") : "Từ ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate ? new Date(startDate) : undefined}
                  onSelect={(date) => updateValue(field.key, [date?.toISOString(), endDate])}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(new Date(endDate), "dd/MM") : "Đến ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate ? new Date(endDate) : undefined}
                  onSelect={(date) => updateValue(field.key, [startDate, date?.toISOString()])}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case 'number':
        return (
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Từ"
              value={value?.[0] || ''}
              onChange={(e) => updateValue(field.key, [e.target.value, value?.[1]])}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Đến"
              value={value?.[1] || ''}
              onChange={(e) => updateValue(field.key, [value?.[0], e.target.value])}
              className="flex-1"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("bg-white border rounded-lg p-4 mb-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FilterIcon className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium text-gray-900">Bộ lọc nâng cao</h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Đang lọc
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Thu gọn' : 'Mở rộng'}
        </Button>
      </div>

      {isExpanded && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key} className="text-sm font-medium text-gray-700">
                  {field.label}
                </Label>
                {renderField(field)}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              disabled={!hasActiveFilters}
              className="flex items-center space-x-1"
            >
              <X className="h-4 w-4" />
              <span>Xóa bộ lọc</span>
            </Button>
            
            <Button
              onClick={onApply}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Áp dụng bộ lọc
            </Button>
          </div>
        </>
      )}
    </div>
  );
}