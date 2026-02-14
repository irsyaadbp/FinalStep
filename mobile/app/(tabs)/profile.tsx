import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import {
  Flame,
  Trophy,
  BookText,
  Star,
  Settings,
  ChevronRight,
  LogOut,
  Mail,
  Target,
  ShieldCheck,
  Zap,
} from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, TouchableOpacity, RefreshControl } from 'react-native';

import { useAuth } from '@/context/AuthContext';

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000];

function getXPProgress(xp: number, level: number) {
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const progress = ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return { progress: Math.min(100, Math.max(0, progress)), nextThreshold };
}

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshUser();
    setRefreshing(false);
  }, [refreshUser]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const name = user?.name || 'Siswa';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  const xp = user?.xp || 0;
  const level = user?.level || 1;
  const { progress: levelProgress, nextThreshold } = getXPProgress(xp, level);

  const completedChapters = user?.progress?.reduce((acc, p) => acc + (p.completedChapters?.length || 0), 0) || 0;
  const overallProgress = user?.progress?.length 
    ? Math.round(user.progress.reduce((acc, p) => acc + p.progressPercent, 0) / user.progress.length) 
    : 0;

  return (
    <ScrollView 
      className="flex-1 bg-background" 
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Profile Header Card */}
      <View className="px-6 pb-6 pt-16">
        <Card contentClassName="p-6 items-center">
          <View className="relative mb-4">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-primary">
              <Text className="text-3xl font-bold uppercase text-white">{initials}</Text>
            </View>
            <View className="absolute bottom-0 right-0 rounded-full border border-border bg-white p-1.5 dark:bg-slate-800">
              <Icon as={ShieldCheck} size={16} className="text-primary" />
            </View>
          </View>

          <Text className="mb-1 text-2xl font-bold">{name}</Text>
          <View className="mb-1 flex-row items-center gap-2">
            <Icon as={Mail} size={14} className="text-muted-foreground" />
            <Text className="text-sm text-muted-foreground">{user?.email || '-'}</Text>
          </View>
          <View className="mb-6 flex-row items-center gap-2">
            <Icon as={Target} size={14} className="text-muted-foreground" />
            <Text className="text-sm text-muted-foreground">
              Target: {user?.targetUniversity || '-'}
            </Text>
          </View>

          {/* Level Bar */}
          <View className="w-full">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="font-bold">Level {level}</Text>
              <View className="flex-row items-center">
                <Icon as={Zap} size={14} className="mr-1 text-orange-500" />
                <Text className="font-bold text-orange-500">{xp} XP</Text>
              </View>
            </View>
            <View className="mb-2 h-3 overflow-hidden rounded-full bg-secondary">
              <View
                className="h-full bg-orange-500"
                style={{ width: `${levelProgress}%` }}
              />
            </View>
            <Text className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">
              {Math.max(0, nextThreshold - xp)} XP ke Level {level + 1}
            </Text>
          </View>
        </Card>
      </View>

      {/* Stats Grid */}
      <View className="mb-8 flex-row flex-wrap justify-between px-6">
        <StatItem
          icon={Flame}
          value={String(user?.streak || 0)}
          label="Streak"
          color="text-orange-500"
          bgColor="bg-orange-50"
          className="mb-4 w-[48%]"
        />
        <StatItem
          icon={Trophy}
          value={`Lv.${level}`}
          label="Level"
          color="text-blue-500"
          bgColor="bg-blue-50"
          className="mb-4 w-[48%]"
        />
        <StatItem
          icon={BookText}
          value={String(completedChapters)}
          label="Materi"
          color="text-purple-500"
          bgColor="bg-purple-50"
          className="w-[48%]"
        />
        <StatItem
          icon={Star}
          value={`${overallProgress}%`}
          label="Avg Progres"
          color="text-yellow-500"
          bgColor="bg-yellow-50"
          className="w-[48%]"
        />
      </View>

      {/* Menu List */}
      <View className="mb-8 px-6">
        <Card contentClassName="overflow-hidden">
          <MenuItem
            icon={BookText}
            title="Pelajaran Saya"
            subtitle={`${user?.progress?.length || 0} mata pelajaran`}
            onPress={() => router.push('/(tabs)/subjects')}
          />
          <View className="mx-6 h-[1px] bg-border" />
          <MenuItem
            icon={Settings}
            title="Pengaturan"
            subtitle="Profil & preferensi"
            onPress={() => {}}
          />
        </Card>
      </View>

      {/* Logout Button */}
      <View className="px-6">
        <Button 
          variant="destructive" 
          size="lg" 
          className="h-16" 
          onPress={handleLogout}
          disabled={loading}
        >
          <View className="flex-row items-center gap-3">
            <Icon as={LogOut} size={20} className="text-white" />
            <Text>{loading ? 'MEMPROSES...' : 'Keluar dari Akun'}</Text>
          </View>
        </Button>
      </View>
    </ScrollView>
  );
}

function StatItem({
  icon,
  value,
  label,
  color,
  bgColor,
  className,
}: {
  icon: any;
  value: string;
  label: string;
  color: string;
  bgColor: string;
  className?: string;
}) {
  return (
    <Card className={cn('mx-0', className)} contentClassName="p-4 items-center">
      <View className={`mb-3 rounded-xl p-2 ${bgColor}`}>
        <Icon as={icon} size={20} className={color} />
      </View>
      <Text className="text-lg font-bold">{value}</Text>
      <Text className="text-center text-[10px] uppercase text-muted-foreground">{label}</Text>
    </Card>
  );
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: any;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} className="flex-row items-center p-6">
      <View className="mr-4 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
        <Icon as={icon} size={22} className="text-muted-foreground" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-bold">{title}</Text>
        <Text className="text-xs text-muted-foreground">{subtitle}</Text>
      </View>
      <Icon as={ChevronRight} size={18} className="text-slate-300" />
    </TouchableOpacity>
  );
}
