"use client";
import { format, formatDate } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

type InputDateProps = {
  disabled?: boolean;
  value?: Date | string;
  onChange: (date: Date) => void;
  className?: string;

  max?: Date;
  min?: Date;
  uniqueDayMonth?: string | number;
};
export function InputDate({
  disabled,
  value,
  onChange,
  className,

  max,
  min,
  uniqueDayMonth,
}: InputDateProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            `w-[280px] justify-start text-left font-normal ${className}`,
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "dd/MM/yyyy") : <span>Selecione um dia</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          locale={ptBR}
          mode="single"
          selected={date}
          onSelect={(e) => {
            setDate(e || new Date());
            setOpen(false);
          }}
          onDayClick={(e) => {
            setDate(e || new Date());
            onChange(e || new Date());
            setOpen(false);
          }}
          disabled={(date) => {
            if (min && date < min) {
              return true;
            }
            if (max && date > max) {
              return true;
            }
            if (
              uniqueDayMonth !== undefined &&
              parseInt(formatDate(date, "dd")) !== uniqueDayMonth
            ) {
              return true;
            }
            return date < new Date("1900-01-01");
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
