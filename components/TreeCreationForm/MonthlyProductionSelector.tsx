import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MonthlyProduction {
  kg: number;
  units: number;
}

interface MonthlyProductionSelectorProps {
  value: Record<string, MonthlyProduction>;
  onChange: (value: Record<string, MonthlyProduction>) => void;
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function MonthlyProductionSelector({ value, onChange }: MonthlyProductionSelectorProps) {
  const handleChange = (month: string, field: "kg" | "units", newValue: string) => {
    const numericValue = parseFloat(newValue) || 0;
    onChange({
      ...value,
      [month]: {
        ...value[month],
        [field]: numericValue,
      },
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {months.map((month) => (
        <div key={month} className="space-y-2 border p-1 rounded-md">
          <Label>{month}</Label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input type="number" placeholder="kg" value={value[month]?.kg || ""} onChange={(e) => handleChange(month, "kg", e.target.value)} min={0} step={0.1} />
            </div>
            <div className="flex-1">
              <Input type="number" placeholder="units" value={value[month]?.units || ""} onChange={(e) => handleChange(month, "units", e.target.value)} min={0} step={1} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
