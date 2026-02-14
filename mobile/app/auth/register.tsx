import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Text } from '@/components/ui/text';
import { Link, Stack, useRouter } from 'expo-router';
import {
  Building2Icon,
  GraduationCapIcon,
  MailIcon,
  UserIcon,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { ScrollView, View } from 'react-native';

export default function RegisterScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      className="bg-background"
    >
      <Stack.Screen options={{ title: 'Register' }} />

      <View className="items-center justify-center p-6 py-12">
        <View className="items-center gap-4 mb-10">
          <View className="relative overflow-visible pb-2">
            {/* Logo 3D Shadow */}
            <View className="absolute inset-x-0 top-2 h-full rounded-xl bg-[#3D2AA8]" />
            <View className="bg-primary rounded-xl p-5">
              <Icon as={GraduationCapIcon} size={40} className="text-white" />
            </View>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-center mb-1">Mulai Petualanganmu! 🌟</Text>
            <Text className="text-muted-foreground text-center text-base">
              Buat akun dan raih universitas impianmu
            </Text>
          </View>
        </View>

        <View className="w-full bg-white p-7 rounded-xl shadow-sm shadow-black/5 gap-6 border-2 border-border">
          <View className="gap-2">
            <Text className="font-bold ml-1">Nama Lengkap</Text>
            <Input
              icon={<Icon as={UserIcon} className="size-5 text-muted-foreground/40" />}
              placeholder="Ahmad Rizky"
              autoCapitalize="words"
            />
          </View>

          <View className="gap-2">
            <Text className="font-bold ml-1">Email</Text>
            <Input
              icon={<Icon as={MailIcon} className="size-5 text-muted-foreground/40" />}
              placeholder="budi@student.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="gap-2">
            <Text className="font-bold ml-1">Password</Text>
            <PasswordInput placeholder="••••••••" />
          </View>

          <View className="gap-2">
            <Text className="font-bold ml-1">Asal Sekolah</Text>
            <Input
              icon={<Icon as={Building2Icon} className="size-5 text-muted-foreground/40" />}
              placeholder="SMAN 1 Jakarta"
            />
          </View>

          <View className="gap-2">
            <Text className="font-bold ml-1">Universitas Impian</Text>
            <Input
              icon={<Icon as={GraduationCapIcon} className="size-5 text-muted-foreground/40" />}
              placeholder="Universitas Bina Nusantara"
            />
          </View>

          <View className="mt-4">
            <Button size="lg" className="w-full" onPress={() => router.replace('/(tabs)')}>
              <Text>DAFTAR SEKARANG</Text>
            </Button>
          </View>
        </View>

        <View className="flex-row justify-center mt-10 pb-4">
          <Text className="text-muted-foreground">Sudah punya akun? </Text>
          <Link href="/auth/login" asChild>
            <Text className="text-primary font-bold">Masuk</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
