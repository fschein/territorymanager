"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, ChevronDown, XCircle, XIcon } from "lucide-react";
import * as React from "react";

const multiSelectVariants = cva("m-1 transition ease-in-out delay-150 duration-300", {
  variants: {
    variant: {
      default: "border-foreground/10 text-foreground bg-card hover:bg-card/80",
      secondary:
        "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      inverted: "inverted",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type MultiSelectOptionProps = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};
export interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  options: MultiSelectOptionProps[];
  onValueChange: (value: string[]) => void;
  defaultValue: string[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
  nowrap?: boolean;
  maxCharacters?: number;
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      modalPopover = true,
      asChild = false,
      className,
      disabled,
      nowrap,
      maxCharacters,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [toggleModal, setToggleModal] = React.useState(false);

    React.useEffect(() => {
      setSelectedValues(defaultValue);
    }, [defaultValue]);

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (value: string) => {
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
      setToggleModal((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const filteredValues = search
      ? options
          .filter((option) => String(option.value).toUpperCase().includes(search.toUpperCase()))
          .map((option) => option.value)
      : options.map((option) => option.value);

    const handleClear = () => {
      // Remover apenas os valores que estão em `filteredValues`
      const remainingValues = selectedValues.filter((value) => !filteredValues.includes(value));
      setSelectedValues(remainingValues);
      onValueChange(remainingValues);
    };

    const selectedValuesWithoutAll = selectedValues.filter(
      (value) =>
        String(value).toUpperCase().includes(search.toUpperCase()) && value !== "(Selecione todos)"
    );
    const toggleAll = () => {
      if (selectedValuesWithoutAll.length === filteredValues.length) {
        handleClear();
      } else {
        // Adicione os valores filtrados aos selecionados, evitando duplicatas
        const allValues = Array.from(new Set([...selectedValues, ...filteredValues]));
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
    };

    const allSelected = React.useMemo(
      () => selectedValuesWithoutAll.length === filteredValues.length,
      [filteredValues, search]
    );

    React.useEffect(() => {
      const resetPointerEvents = () => {
        document.body.style.pointerEvents = "";
      };
      // Remover o pointer-events quando o modal é fechado
      return resetPointerEvents;
    }, [toggleModal]);

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              "flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit",
              className
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex justify-between items-center w-full">
                <div className={`flex flex-wrap items-center ${nowrap && "flex-nowrap"}`}>
                  {selectedValues.slice(0, maxCount).map((value) => {
                    const option = options.find((o) => o.value === value);
                    return (
                      value && (
                        <Badge
                          variant={"secondary"}
                          key={value}
                          className={cn(multiSelectVariants({ variant }))}
                        >
                          <span className={` truncate w-full max-w-[${maxCharacters}ch] `}>
                            {option?.label}
                          </span>
                          <XCircle
                            className="ml-2 h-4 w-4 cursor-pointer"
                            onClick={(event) => {
                              if (!disabled) {
                                event.stopPropagation();
                                toggleOption(value);
                              }
                            }}
                          />
                        </Badge>
                      )
                    );
                  })}
                  {selectedValues.length > maxCount && (
                    <Badge
                      variant={"secondary"}
                      className={cn(
                        "bg-transparent text-foreground border-foreground/1 hover:bg-transparent",

                        multiSelectVariants({
                          variant,
                        })
                      )}
                    >
                      {`+ ${selectedValues.length - maxCount} outros`}
                      <XCircle
                        className="ml-2 h-4 w-4 cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation();
                          clearExtraOptions();
                        }}
                      />
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <XIcon
                    className="h-4 mx-2 cursor-pointer text-muted-foreground"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClear();
                    }}
                  />
                  <Separator orientation="vertical" className="flex min-h-6 h-full" />
                  <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full mx-auto">
                <span className="text-sm text-muted-foreground mx-3">{placeholder}</span>
                <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 z-[600] border border-secondary rounded-md mt-1"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command
            filter={(value: string, search) => {
              if (
                value.toUpperCase().includes(search.toUpperCase()) ||
                value.includes("(Selecione todos)")
              )
                return 1;
              return 0;
            }}
          >
            <CommandInput
              placeholder="Pesquisar..."
              onKeyDown={handleInputKeyDown}
              onValueChange={(search) => setSearch(search)}
            />
            <CommandList className="overflow-y scroll-thin w-full">
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
              <CommandGroup role={"group"}>
                <CommandItem
                  key="all"
                  onSelect={toggleAll}
                  className={`${
                    !disabled &&
                    "data-[disabled]:pointer-events-auto data-[disabled]:opacity-100 cursor-pointer"
                  }`}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      allSelected
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <span>(Selecione todos)</span>
                </CommandItem>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);

                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className={`${
                        !disabled &&
                        "data-[disabled]:pointer-events-auto data-[disabled]:opacity-100 cursor-pointer"
                      }`}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      {option.icon && (
                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between gap-0.5">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        className={`${
                          !disabled &&
                          "data-[disabled]:pointer-events-auto data-[disabled]:opacity-100 cursor-pointer"
                        } flex-1 justify-center cursor-pointer`}
                      >
                        Limpar
                      </CommandItem>
                      <Separator orientation="vertical" className="flex min-h-6 h-full" />
                    </>
                  )}
                  <CommandSeparator />
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    className={`${
                      !disabled &&
                      "data-[disabled]:pointer-events-auto data-[disabled]:opacity-100 cursor-pointer"
                    } flex-1 justify-center cursor-pointer`}
                  >
                    Fechar
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";
