import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/context/AuthContext';
import { Monitor, LogOut, ChevronRight } from 'lucide-react-native';
import * as React from 'react';
import { View, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';

const WEB_DASHBOARD_URL = 'https://finalstep.syaad.dev'; // Replace with actual URL

export default function AdminNoticeScreen() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleOpenWeb = () => {
    Linking.openURL(WEB_DASHBOARD_URL).catch((err) => console.error('Failed to open URL:', err));
  };

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    router.replace('/auth/login');
    setLoading(false);
  };

  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <Stack.Screen options={{ title: 'Admin Access', headerLeft: () => null }} />

      <View className="mb-8 items-center">
        <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <Icon as={Monitor} size={48} className="text-primary" />
        </View>

        <Text className="mb-3 text-center text-2xl font-bold">Dashboard Admin Hanya di Web</Text>
        <Text className="px-4 text-center text-base text-muted-foreground">
          Maaf {user?.name}, fitur manajemen admin saat ini hanya tersedia di versi desktop untuk
          pengalaman terbaik.
        </Text>
      </View>

      <View className="w-full gap-4">
        <Button size="lg" className="h-16" onPress={handleOpenWeb}>
          <View className="flex-row items-center gap-3">
            <Text className="font-bold">BUKA DASHBOARD WEB</Text>
            <Icon as={ChevronRight} size={20} className="text-white" />
          </View>
        </Button>

        <Button
          disabled={loading}
          variant="outline"
          size="lg"
          className="h-16"
          onPress={handleLogout}>
          <View className="flex-row items-center gap-3">
            <Icon as={LogOut} size={20} className="text-muted-foreground" />
            <Text className="font-bold">KELUAR DARI AKUN</Text>
          </View>
        </Button>
      </View>

      <Text className="mt-10 text-xs text-muted-foreground">Versi Mobile v1.0.0</Text>
    </View>
  );
}
