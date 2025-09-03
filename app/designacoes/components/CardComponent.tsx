import React, { useMemo } from "react";

export const CardComponent = ({
  qtde,
  title,
  value,
  selectStatus,
  icon: Icon,
  checked,
  variant,
}: {
  qtde: string;
  title: string;
  value: string;
  selectStatus: (status: string) => void;
  icon: React.ElementType;
  checked: boolean;
  variant: "secondary" | "warning" | "success" | "destructive";
}) => {
  const { bg, ring, titleText, text } = useMemo(() => {
    switch (variant) {
      case "secondary":
        return {
          bg: `${checked ? "bg-slate-500/20" : ""}`,
          ring: "ring-slate-500",
          text: "text-slate-500",
          titleText: "text-slate-500 dark:text-slate-400",
        };
      case "warning":
        return {
          bg: `${checked ? "bg-warning/20" : ""}`,
          ring: "ring-warning",
          text: "text-warning",
          titleText: "text-warning",
        };
      case "success":
        return {
          bg: `${checked ? "bg-success/20" : ""}`,
          ring: "ring-success",
          text: "text-success",
          titleText: "text-success",
        };
      case "destructive":
        return {
          bg: `${checked ? "bg-red-500/20" : ""}`,
          ring: "ring-red-500",
          text: "text-red-500",
          titleText: "text-red-500",
        };
      default:
        return {
          bg: `${checked ? "bg-slate-500/20" : ""}`,
          ring: "ring-slate-500",
          text: "text-slate-500",
          titleText: "text-slate-500 dark:text-slate-400",
        };
    }
  }, [variant, checked]);
  return (
    <div
      className={`flex-1 min-w-fit flex justify-between items-center gap-3 md:gap-10 rounded-md px-4 py-2 ring-2 ${ring}  ${bg} transition-colors cursor-pointer`}
      onClick={() => selectStatus(value)}
    >
      <div className="flex gap-1 flex-col">
        <strong className={`font-medium text ${titleText}`}>{title}</strong>
        <span className={`text-3xl font-semibold ${text}`}>{qtde}</span>
      </div>
      <Icon size={40} className={`${text} stroke-[1.5px]`} />
    </div>
  );
};
