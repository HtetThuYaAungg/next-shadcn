import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterValue {
  type1: string;
  value1: string;
  operator: "AND" | "OR";
  type2: string;
  value2: string;
}

interface FilterPopoverProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  onApply: () => void;
  onClear: () => void;
}

const filterTypes = [
  { value: "contains", label: "Contains" },
  { value: "notContains", label: "Does not contain" },
  { value: "equals", label: "Equals" },
  { value: "notEquals", label: "Does not equal" },
  { value: "startsWith", label: "Starts with" },
  { value: "endsWith", label: "Ends with" },
  { value: "blank", label: "Blank" },
  { value: "notBlank", label: "Not blank" },
];

export function FilterPopover({
  value,
  onChange,
  onApply,
  onClear,
}: FilterPopoverProps) {
  const handleChange = (field: keyof FilterValue, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Select
          value={value.type1}
          onValueChange={(newValue) => handleChange("type1", newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select filter type" />
          </SelectTrigger>
          <SelectContent>
            {filterTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!["blank", "notBlank"].includes(value.type1) && (
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter value..."
              value={value.value1}
              onChange={(e) => handleChange("value1", e.target.value)}
              className="pl-8"
            />
          </div>
        )}
        <RadioGroup
          value={value.operator}
          onValueChange={(newValue) =>
            handleChange("operator", newValue as "AND" | "OR")
          }
          className="flex items-center space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="AND" id="and" />
            <Label htmlFor="and">AND</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="OR" id="or" />
            <Label htmlFor="or">OR</Label>
          </div>
        </RadioGroup>
        <Select
          value={value.type2}
          onValueChange={(newValue) => handleChange("type2", newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select filter type" />
          </SelectTrigger>
          <SelectContent>
            {filterTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!["blank", "notBlank"].includes(value.type2) && (
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter..."
              value={value.value2}
              onChange={(e) => handleChange("value2", e.target.value)}
              className="pl-8"
            />
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <Button onClick={onApply}>Apply Filter</Button>
        <Button variant="outline" onClick={onClear}>
          Clear Filter
        </Button>
      </div>
    </div>
  );
}
