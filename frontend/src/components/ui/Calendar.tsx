import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "../../lib/utils";
import { buttonVariants } from "../../components/ui/Button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-white", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 relative",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center h-9 mb-2",
        caption_label: "text-sm font-medium",
        nav: "flex items-center",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1 top-1 z-20"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1 top-1 z-20"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex justify-between",
        weekday:
          "text-muted-foreground rounded-lg w-9 font-normal text-[0.8rem] flex items-center justify-center",
        week: "flex w-full mt-2 justify-between",
        day: "h-9 w-9 text-center text-sm p-0 relative flex items-center justify-center rounded-lg overflow-hidden",
        day_button: cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "relative h-9 w-9 p-0 font-normal aria-selected:opacity-100 transition-none rounded-lg"
        ),
        selected: "bg-primary! text-primary-foreground! hover:bg-primary! hover:text-primary-foreground! focus:bg-primary! focus:text-primary-foreground! rounded-lg",
        today: "after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary",
        outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ ...props }) => {
          if (props.orientation === "left")
            return <ChevronLeft className="h-4 w-4" />;
          return <ChevronRight className="h-4 w-4" />;
        },
      }}
      defaultMonth={
        props.mode === "single" && props.selected instanceof Date
          ? props.selected
          : new Date()
      }
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
