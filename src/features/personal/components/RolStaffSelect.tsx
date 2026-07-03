"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES_STAFF } from "@/features/personal/constants/roles-staff";
import type { RolStaff } from "@/features/personal/constants/roles-staff";
import { ROL_LABEL } from "@/features/navigation/modulos-data";

interface RolStaffSelectProps {
  value: RolStaff;
  onValueChange: (value: RolStaff) => void;
  disabled?: boolean;
}

export function RolStaffSelect({ value, onValueChange, disabled }: RolStaffSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v as RolStaff)} disabled={disabled}>
      <SelectTrigger className="h-11 w-full">
        <SelectValue placeholder="Selecciona un rol" />
      </SelectTrigger>
      <SelectContent>
        {ROLES_STAFF.map((rol) => (
          <SelectItem key={rol} value={rol}>
            {ROL_LABEL[rol]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
