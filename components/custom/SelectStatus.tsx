import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"; // Assuming these are custom components

type TSelectStatus = {
  value: string | undefined;
  onChange: (id_grupo_economico?: string) => void;
  showAll?: boolean;
  className?: string;
  disabled?: boolean;
};

type StatusProps = {
  value: string;
  label: string;
};

const status = [
  { value: "urgent", label: "Urgente" },
  { value: "ongoing", label: "Feito Parcialmente" },
  { value: "done", label: "Concluído" },
  { value: "assigned", label: "Designado" },
];

export const SelectStatus = ({ value, onChange, showAll, className, disabled }: TSelectStatus) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      {/* Estilização sendo usada no cadastro de orçamentos */}
      <SelectTrigger className={`w-[180px] ${className}`}>
        <SelectValue placeholder="Selecione o grupo" />
      </SelectTrigger>
      <SelectContent>
        {showAll && status && status.length > 1 && <SelectItem value="all">TODOS</SelectItem>}
        {status?.map((item: StatusProps) => (
          <SelectItem className="text-left" key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

import { Register } from "@tanstack/react-query";
import { Control } from "react-hook-form";
import { MultiSelect } from "../ui/multi-select";

type TSelectMultiStatus = {
  showAll?: boolean;
  name?: string;
  label?: string;
  placeholder?: string;
  control?: Control<any>;
  register?: Register;
  disabled?: boolean;
  className?: string;
  value: string[];
  maxCount?: number;
  nowrap?: boolean;
  onChange: (value: string[]) => any;
};

export const SelectMultiStatus = (props: TSelectMultiStatus) => {
  return (
    // @ts-ignore
    <MultiSelect
      {...props}
      options={status}
      onValueChange={props.onChange}
      defaultValue={props.value}
      placeholder="Status"
      variant="secondary"
      animation={4}
      maxCount={props?.maxCount || 1}
    />
  );
};
