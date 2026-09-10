"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface AccordionContextType {
  openItem: string | null;
  toggleItem: (value: string) => void;
  collapsible?: boolean;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

const AccordionItemContext = createContext<{
  value: string;
  isOpen: boolean;
} | null>(null);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string | null) => void;
  children: React.ReactNode;
}

export function Accordion({
  type = "single",
  collapsible = true,
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: AccordionProps) {
  const [internalValue, setInternalValue] = useState<string | null>(
    defaultValue ?? null
  );

  const isControlled = controlledValue !== undefined;
  const openItem = isControlled ? controlledValue : internalValue;

  const toggleItem = (val: string) => {
    let nextValue: string | null = val;
    if (openItem === val && collapsible) {
      nextValue = null;
    }
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  return (
    <AccordionContext.Provider value={{ openItem, toggleItem, collapsible }}>
      <div className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export function AccordionItem({
  value,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const context = useContext(AccordionContext);
  const isOpen = context?.openItem === value;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div
        data-state={isOpen ? "open" : "closed"}
        className={cn(className)}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const itemContext = useContext(AccordionItemContext);
  const rootContext = useContext(AccordionContext);

  if (!itemContext || !rootContext) {
    throw new Error("AccordionTrigger must be used within an AccordionItem");
  }

  const { value, isOpen } = itemContext;

  return (
    <button
      type="button"
      data-state={isOpen ? "open" : "closed"}
      aria-expanded={isOpen}
      onClick={() => rootContext.toggleItem(value)}
      className={cn(
        "flex w-full items-center justify-between text-left transition-all",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  const itemContext = useContext(AccordionItemContext);

  if (!itemContext) {
    throw new Error("AccordionContent must be used within an AccordionItem");
  }

  const { isOpen } = itemContext;

  /* Height is animated with the grid-template-rows 0fr -> 1fr technique, so
     the panel eases open at its natural height without measuring anything.
     The panel stays mounted (hidden from AT while collapsed) so the
     transition has something to animate. */
  return (
    <div
      data-state={isOpen ? "open" : "closed"}
      aria-hidden={!isOpen}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className={cn("overflow-hidden", className)} {...props}>
        {children}
      </div>
    </div>
  );
}
