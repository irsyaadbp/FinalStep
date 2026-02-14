import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Text } from '@/components/ui/text';
import { Link, Stack } from 'expo-router';
import { MailIcon, MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, type ImageStyle, View } from 'react-native';

const LOGO = {
  light: require('@/assets/images/icon.png'),
  dark: require('@/assets/images/icon.png'),
};

const SCREEN_OPTIONS = {
  title: 'FinalStep',
  headerShown: true,
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};

export default function Screen() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1 items-center justify-center gap-8 p-4">
        <Image source={LOGO[colorScheme ?? 'light']} style={IMAGE_STYLE} resizeMode="contain" />
        <View className="items-center gap-2 p-4">
          <Text className="text-center text-2xl font-bold">Selamat Datang di FinalStep</Text>
          <Text className="text-center text-muted-foreground">
            Platform persiapan ujian terbaik untuk kamu.
          </Text>
        </View>
        <View className="w-full gap-4 px-2">
          <Input
            icon={<Icon as={MailIcon} className="size-5 text-muted-foreground/40" />}
            placeholder="ahmad@email.com"
          />
          <PasswordInput placeholder="Password" />
        </View>
        <View className="w-full flex-row gap-4 px-2">
          <Link href="/auth/login" asChild>
            <Button size="lg" className="flex-1">
              <Text>MASUK</Text>
            </Button>
          </Link>
          <Link href="/auth/register" asChild>
            <Button variant="secondary" size="lg" className="flex-1">
              <Text>DAFTAR</Text>
            </Button>
          </Link>
        </View>
      </View>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
