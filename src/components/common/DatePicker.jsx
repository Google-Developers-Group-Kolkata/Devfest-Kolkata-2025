"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({ value, onChange, className, buttonClassName, popoverClassName }) {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState(value ? new Date(value) : undefined);

    const handleSelect = (selectedDate) => {
        setDate(selectedDate);
        if (selectedDate) {
            // Format date as YYYY-MM-DD for the form
            const formattedDate = selectedDate.toISOString().split('T')[0];
            onChange(formattedDate);
        }
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen} className={className}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-between font-normal px-3 py-2 border border-gray-300 rounded-md shadow-sm",
                        buttonClassName
                    )}
                >
                    {date ? date.toLocaleDateString() : "Select date"}
                    <ChevronDownIcon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={cn("w-auto overflow-hidden p-0", popoverClassName)}
                align="start"
            >
                <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    onSelect={handleSelect}
                    fromYear={1950}
                    toYear={new Date().getFullYear()}
                />
            </PopoverContent>
        </Popover>
    );
}
