import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Text } from '@/components/ui/text';
import { Link, Stack, useRouter } from 'expo-router';
import { GraduationCapIcon, MailIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

export default function LoginScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background items-center justify-center p-6">
      <Stack.Screen options={{ title: 'Login' }} />

      <View className="items-center gap-4 mb-10">
        <View className="relative overflow-visible pb-2">
          {/* Logo 3D Shadow */}
          <View className="absolute inset-x-0 top-2 h-full rounded-xl bg-[#3D2AA8]" />
          <View className="bg-primary rounded-xl p-5">
            <Icon as={GraduationCapIcon} size={40} className="text-white" />
          </View>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-center mb-1">FinalStep</Text>
          <Text className="text-muted-foreground text-center text-base">
            Siap taklukkan ujianmu? 🚀
          </Text>
        </View>
      </View>

      <View className="w-full bg-white p-7 rounded-xl shadow-sm shadow-black/5 gap-6 border-2 border-border">
        <View className="gap-2">
          <Text className="font-bold ml-1">Email</Text>
          <Input
            icon={<Icon as={MailIcon} className="size-5 text-muted-foreground/40" />}
            placeholder="ahmad@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="gap-2">
          <Text className="font-bold ml-1">Password</Text>
          <PasswordInput placeholder="••••••••" />
        </View>

        <View className="mt-2">
          <Button size="lg" className="w-full" onPress={() => router.replace('/(tabs)')}>
            <Text>MASUK</Text>
          </Button>
        </View>
      </View>

      <View className="flex-row justify-center mt-10">
        <Text className="text-muted-foreground">Belum punya akun? </Text>
        <Link href="/auth/register" asChild>
          <Text className="text-primary font-bold">Daftar</Text>
        </Link>
      </View>
    </View>
  );
}
