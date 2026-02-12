import { type UseFormRegister, type FieldValues, type Path, type FieldErrors } from "react-hook-form";
import { motion } from "motion/react";
import { type LucideIcon } from "lucide-react";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { PasswordInput } from "../ui/PasswordInput";
import { cn } from "../../lib/utils";

export interface FormField<T extends FieldValues> {
  id: Path<T>;
  label: string;
  icon?: LucideIcon;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

interface FormGeneratorProps<T extends FieldValues> {
  fields: FormField<T>[];
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export function FormGenerator<T extends FieldValues>({
  fields,
  register,
  errors,
}: FormGeneratorProps<T>) {
  return (
    <div className="space-y-3">
      {fields.map((f, i) => {
        const Icon = f.icon;
        const Component = f.id.includes("password") || f.type === "password" ? PasswordInput : Input;

        return (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.06 }}
            className="space-y-1.5"
          >
            <Label htmlFor={f.id} className="text-xs font-bold">
              {f.label}
            </Label>
            <div className="relative mt-1">
              {Icon && (
                <Icon className="absolute z-10 left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
              )}
              <Component
                id={f.id}
                type={f.type === "password" ? undefined : f.type}
                placeholder={f.placeholder}
                {...register(f.id)}
                className={cn(`${Icon ? "pl-10" : ""} h-11 rounded-xl border-2 bg-background shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.04)] focus:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.04),0_0_0_3px_hsl(var(--primary)/0.12)] transition-shadow text-sm`, errors[f.id] && "border-destructive")}
              />
            </div>
            {errors[f.id] && (
              <p className="text-xs text-destructive font-medium">
                {errors[f.id]?.message as string}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
