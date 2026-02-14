import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { View, ViewProps } from 'react-native';

const cardVariants = cva(
  'relative overflow-visible pb-2',
  {
    variants: {
      variant: {
        default: '',
        primary: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const shadowVariants = cva(
  'absolute inset-x-0 top-2 h-full',
  {
    variants: {
      variant: {
        default: 'bg-[#e9e9e9]',
        primary: 'bg-[#3D2AA8]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const contentVariants = cva(
  'w-full border',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-slate-900 border-border',
        primary: 'bg-primary border-transparent',
      },
      radius: {
        default: 'rounded-xl',
        lg: 'rounded-xl',
        xl: 'rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      radius: 'default',
    },
  }
);

interface CardProps extends ViewProps, VariantProps<typeof cardVariants> {
  radius?: VariantProps<typeof contentVariants>['radius'];
  contentClassName?: string;
}

function Card({ className, variant, radius, contentClassName, children, ...props }: CardProps) {
  const radiusClass = 'rounded-xl';

  return (
    <View className={cn(cardVariants({ variant }), className)} {...props}>
      {/* Shadow layer */}
      <View
        className={cn(
          shadowVariants({ variant }),
          radiusClass
        )}
      />
      {/* Content layer */}
      <View
        className={cn(
          contentVariants({ variant, radius: 'default' }),
          radiusClass,
          contentClassName
        )}
      >
        {children}
      </View>
    </View>
  );
}

export { Card, cardVariants };
