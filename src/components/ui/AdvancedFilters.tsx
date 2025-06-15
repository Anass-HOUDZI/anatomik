
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface FilterOption {
  value: string;
  label: string;
}

export interface AdvancedFiltersProps {
  placeholder?: string;
  options: FilterOption[];
  onFilter: (value: string) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  placeholder = "Rechercher...",
  options,
  onFilter
}) => {
  const [input, setInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    onFilter(e.target.value);
  };

  return (
    <div className="flex gap-3 items-center bg-white/70 dark:bg-[#1d315b]/80 backdrop-blur-modern rounded-xl px-4 py-2 shadow-md ring-1 ring-blue-100 mb-4">
      <Input
        value={input}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-0 focus:ring-0"
      />
      <Button
        type="button"
        variant="outline"
        className="gradient-card-outline px-4 font-semibold"
        onClick={() => onFilter(input)}
      >
        <span className="gradient-text">Filtrer</span>
      </Button>
    </div>
  );
};

export default AdvancedFilters;
