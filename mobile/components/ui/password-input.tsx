import { Icon } from '@/components/ui/icon';
import { Input, type InputProps } from '@/components/ui/input';
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type PasswordInputProps = Omit<InputProps, 'icon'>;

function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View className="relative">
      <Input
        className={className}
        icon={<Icon as={LockIcon} className="size-5 text-muted-foreground/40" />}
        secureTextEntry={!isVisible}
        {...props}
      />
      <Pressable
        onPress={toggleVisibility}
        className="absolute right-4 top-[18px] z-10"
        hitSlop={10}
      >
        <Icon
          as={isVisible ? EyeIcon : EyeOffIcon}
          className="size-5 text-muted-foreground/40"
        />
      </Pressable>
    </View>
  );
}

export { PasswordInput };
export type { PasswordInputProps };
