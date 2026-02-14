import { Tabs } from 'expo-router';
import { Home, BookText, User } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { NAV_THEME } from '@/lib/theme';
import { View, Platform } from 'react-native';

function TabBarIcon({ Icon, focused, color }: { Icon: any; focused: boolean; color: string }) {
  if (!focused) {
    return (
      <View className="h-10 items-center justify-center mb-2">
        <Icon color={color} size={24} />
      </View>
    );
  }

  return (
    <View className="items-center justify-center h-9 w-12 mb-5">
      {/* 3D Shadow Layer */}
      <View className="absolute inset-x-0 top-1 h-full bg-[#3D2AA8] rounded-2xl" />
      {/* Main Layer */}
      <View className="absolute inset-0 bg-primary rounded-2xl items-center justify-center">
        <Icon color="white" size={22} />
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          height: 96,
          paddingTop: 16,
          // paddingBottom: 12,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={Home} focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="subjects"
        options={{
          title: 'Pelajaran',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={BookText} focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => <TabBarIcon Icon={User} focused={focused} color={color} />,
        }}
      />
    </Tabs>
  );
}
