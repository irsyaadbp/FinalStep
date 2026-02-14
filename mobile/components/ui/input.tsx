import { cn } from '@/lib/utils';
import * as React from 'react';
import { Platform, TextInput, View, type TextInputProps } from 'react-native';

type InputProps = TextInputProps &
  React.RefAttributes<TextInput> & {
    icon?: React.ReactNode;
  };

function Input({ className, icon, ...props }: InputProps) {
  return (
    <View
      className={cn(
        'flex-row items-center rounded-[20px] bg-background border-2 border-input px-4',
        'h-14',
        className
      )}
    >
      {icon && <View className="mr-3 text-muted-foreground/40">{icon}</View>}
      <TextInput
        className={cn(
          'flex-1 text-base text-foreground',
          props.editable === false &&
            cn(
              'opacity-50',
              Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
            ),
          Platform.select({
            web: cn(
              'placeholder:text-muted-foreground outline-none transition-[color,box-shadow] md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'
            ),
            native: 'placeholder:text-muted-foreground/50',
          })
        )}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </View>
  );
}

export { Input };
export type { InputProps };
