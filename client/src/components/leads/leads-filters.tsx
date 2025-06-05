import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { LEAD_SOURCES, LEAD_STATUSES, REGIONS, TEAM_A_MEMBERS, ALL_SALES_USERS } from "@/lib/constants";
import { usePermissions } from "@/hooks/usePermissions";

interface LeadsFiltersProps {
  filters: {
    source: string;
    region: string;
    status: string;
    assignedTo: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
  advancedFilterButton?: React.ReactNode;
}

export default function LeadsFilters({ filters, onFiltersChange, advancedFilterButton }: LeadsFiltersProps) {
  const { permissions } = usePermissions();
  
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1, // Reset to first page when filtering
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      source: "",
      region: "",
      status: "",
      assignedTo: "",
      search: "",
      page: 1,
    });
  };

  // Get available sales users based on permissions
  const getAvailableSalesUsers = () => {
    if (permissions.canViewAllLeads) {
      return ALL_SALES_USERS;
    } else if (permissions.canViewTeamLeads) {
      // Leader role - only show Team A members
      return TEAM_A_MEMBERS;
    } else {
      // Sale role - no dropdown needed
      return [];
    }
  };

  const availableSalesUsers = getAvailableSalesUsers();

  return (
    <div className="flex flex-row flex-wrap items-center gap-3 w-full">
      <Select
        value={filters.source}
        onValueChange={(value) => handleFilterChange("source", value)}
      >
        <SelectTrigger className="w-[140px] h-10">
          <SelectValue placeholder="Tất cả nguồn" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả nguồn</SelectItem>
          {LEAD_SOURCES.map((source) => (
            <SelectItem key={source.value} value={source.value}>
              {source.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.region}
        onValueChange={(value) => handleFilterChange("region", value)}
      >
        <SelectTrigger className="w-[130px] h-10">
          <SelectValue placeholder="Tất cả khu vực" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả khu vực</SelectItem>
          {REGIONS.map((region) => (
            <SelectItem key={region.value} value={region.value}>
              {region.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(value) => handleFilterChange("status", value)}
      >
        <SelectTrigger className="w-[140px] h-10">
          <SelectValue placeholder="Tất cả trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          {LEAD_STATUSES.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {availableSalesUsers.length > 0 && (
        <Select
          value={filters.assignedTo}
          onValueChange={(value) => handleFilterChange("assignedTo", value)}
        >
          <SelectTrigger className="w-[160px] h-10">
            <SelectValue placeholder={permissions.canViewAllLeads ? "Tất cả sales" : "Nhóm A"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{permissions.canViewAllLeads ? "Tất cả sales" : "Nhóm A"}</SelectItem>
            {availableSalesUsers.map((user) => (
              <SelectItem key={user.value} value={user.value}>
                {user.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="relative w-[250px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Tìm kiếm theo tên, số điện thoại, email..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-10 h-10"
        />
      </div>
      
      {advancedFilterButton}
    </div>
  );
}
