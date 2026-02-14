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

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function RegisterScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      school: '',
      targetUniversity: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setError(null);
      await register(data);
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    }
  };

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
          {error && (
            <View className="bg-destructive/10 p-3 rounded-lg border border-destructive/20">
              <Text className="text-destructive text-sm font-medium">{error}</Text>
            </View>
          )}

          <View className="gap-2">
            <Text className="font-bold ml-1">Nama Lengkap</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  icon={<Icon as={UserIcon} className="size-5 text-muted-foreground/40" />}
                  placeholder="Ahmad Rizky"
                  autoCapitalize="words"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.name}
                />
              )}
            />
            {errors.name && (
              <Text className="text-destructive text-xs ml-1">{errors.name.message}</Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="font-bold ml-1">Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  icon={<Icon as={MailIcon} className="size-5 text-muted-foreground/40" />}
                  placeholder="budi@student.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.email}
                />
              )}
            />
            {errors.email && (
              <Text className="text-destructive text-xs ml-1">{errors.email.message}</Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="font-bold ml-1">Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput 
                  placeholder="••••••••" 
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.password}
                />
              )}
            />
            {errors.password && (
              <Text className="text-destructive text-xs ml-1">{errors.password.message}</Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="font-bold ml-1">Asal Sekolah</Text>
            <Controller
              control={control}
              name="school"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  icon={<Icon as={Building2Icon} className="size-5 text-muted-foreground/40" />}
                  placeholder="SMAN 1 Jakarta"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.school}
                />
              )}
            />
            {errors.school && (
              <Text className="text-destructive text-xs ml-1">{errors.school.message}</Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="font-bold ml-1">Universitas Impian</Text>
            <Controller
              control={control}
              name="targetUniversity"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  icon={<Icon as={GraduationCapIcon} className="size-5 text-muted-foreground/40" />}
                  placeholder="Universitas Bina Nusantara"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.targetUniversity}
                />
              )}
            />
            {errors.targetUniversity && (
              <Text className="text-destructive text-xs ml-1">{errors.targetUniversity.message}</Text>
            )}
          </View>

          <View className="mt-4">
            <Button 
              size="lg" 
              className="w-full" 
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <Text>{isSubmitting ? 'MEMPROSES...' : 'DAFTAR SEKARANG'}</Text>
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
