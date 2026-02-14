import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, Pressable, View } from 'react-native';

const buttonVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-2 shadow-none',
    Platform.select({
      web: "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    })
  ),
  {
    variants: {
      variant: {
        default: cn(
          'bg-primary rounded-2xl active:bg-primary/90',
          Platform.select({ web: 'hover:bg-primary/90' })
        ),
        destructive: cn(
          'bg-red-500 rounded-2xl active:bg-red-600',
          Platform.select({
            web: 'hover:bg-red-600 focus-visible:ring-red-200',
          })
        ),
        outline: cn(
          'border border-border rounded-2xl bg-background shadow-sm shadow-black/5 active:bg-accent dark:border-input dark:bg-input/30 dark:active:bg-input/50',
          Platform.select({
            web: 'hover:bg-accent dark:hover:bg-input/50',
          })
        ),
        secondary: cn(
          'bg-white rounded-2xl border border-border active:bg-gray-50',
          Platform.select({ web: 'hover:bg-gray-50' })
        ),
        ghost: cn(
          'rounded-2xl active:bg-accent dark:active:bg-accent/50',
          Platform.select({ web: 'hover:bg-accent dark:hover:bg-accent/50' })
        ),
        link: 'rounded-2xl',
      },
      size: {
        default: cn('h-10 px-4 py-2 sm:h-9', Platform.select({ web: 'has-[>svg]:px-3' })),
        sm: cn('h-9 gap-1.5 px-3 sm:h-8', Platform.select({ web: 'has-[>svg]:px-2.5' })),
        lg: cn('h-[60px] px-8', Platform.select({ web: 'has-[>svg]:px-4' })),
        icon: 'h-10 w-10 sm:h-9 sm:w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva(
  cn(
    'text-sm font-medium text-foreground',
    Platform.select({ web: 'pointer-events-none transition-colors' })
  ),
  {
    variants: {
      variant: {
        default: 'text-primary-foreground font-bold text-lg',
        destructive: 'text-white font-bold text-lg',
        outline: cn(
          'group-active:text-accent-foreground',
          Platform.select({ web: 'group-hover:text-accent-foreground' })
        ),
        secondary: 'text-gray-800 font-bold text-lg',
        ghost: 'group-active:text-accent-foreground',
        link: cn(
          'text-primary group-active:underline',
          Platform.select({ web: 'underline-offset-4 hover:underline group-hover:underline' })
        ),
      },
      size: {
        default: '',
        sm: '',
        lg: '',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  const isDefault = !variant || variant === 'default';
  const isSecondary = variant === 'secondary';
  const isDestructive = variant === 'destructive';
  const hasShadowLayer = isDefault || isSecondary || isDestructive;

  const radiusClass = 'rounded-2xl';
  
  // Detect if we should fill height (only if explicit height class is passed)
  const shouldFillHeight = className?.includes('h-');

  const pressable = (
    <Pressable
      className={cn(
        props.disabled && 'opacity-50',
        buttonVariants({ variant, size }),
        radiusClass,
        hasShadowLayer && 'w-full',
        hasShadowLayer && shouldFillHeight && 'h-full'
      )}
      role="button"
      {...props}
    />
  );

  if (!hasShadowLayer) {
    return (
      <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
        <Pressable
          className={cn(
            props.disabled && 'opacity-50',
            buttonVariants({ variant, size }),
            radiusClass,
            className
          )}
          role="button"
          {...props}
        />
      </TextClassContext.Provider>
    );
  }

  const getShadowColor = () => {
    if (isDefault) return 'bg-[#3D2AA8]';
    if (isSecondary) return 'bg-[#e9e9e9]';
    if (isDestructive) return 'bg-[#B91C1C]'; // Darker red for shadow
    return 'bg-[#e9e9e9]';
  };

  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <View className={cn('relative overflow-visible pb-2', className)}>
        {/* Shadow layer — matching parent size, offset 8px down */}
        <View
          className={cn(
            'absolute inset-x-0 top-2 h-full',
            radiusClass,
            getShadowColor()
          )}
        />
        {pressable}
      </View>
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
