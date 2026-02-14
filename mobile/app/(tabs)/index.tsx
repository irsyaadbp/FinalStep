import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { Flame, Zap, AlertTriangle, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView, View, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { useAsyncFetch } from '@/hooks/useAsyncFetch';
import { subjectService } from '@/services/subject';
import { Subject } from '@/lib/types';
import { SubjectCard } from '@/components/ui/subject-card';
import { settingsService } from '@/services/settings';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 16) / 2;

export default function HomeScreen() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);
  const [settings, setSettings] = React.useState<any>(null);

  const { data: subjectsData, execute: refreshSubjects } = useAsyncFetch(
    async () => {
      return await subjectService.getSubjects();
    }
  );

  const { execute: fetchSettings } = useAsyncFetch(
    async () => {
      return await settingsService.getSettings();
    },
    {
      onSuccess: (res) => {
        if (res.data) setSettings(res.data);
      }
    }
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshUser(), refreshSubjects(), fetchSettings()]);
    setRefreshing(false);
  }, [refreshUser, refreshSubjects, fetchSettings]);

  const subjects = React.useMemo(() => {
    if (!subjectsData?.data || !user) return [];
    return subjectsData.data.map((s) => {
      const userProgress = user.progress?.find((p) => p.subjectSlug === s.slug);
      return {
        ...s,
        progress: userProgress?.progressPercent || 0,
      };
    });
  }, [subjectsData, user]);

  const name = user?.name.split(' ')[0] || 'Siswa';
  const streak = user?.streak || 0;
  const dailyXP = user?.dailyXP || 0;
  const dailyGoal = user?.dailyGoal || 100;
  
  const totalChapters = subjects.reduce((acc, s) => acc + (s.totalChapters || 0), 0);
  const completedChapters = user?.progress?.reduce((acc, p) => acc + (p.completedChapters?.length || 0), 0) || 0;
  const overallProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  const lastStudy = user?.lastStudy;

  // Dynamic calculations based on settings
  const daysLeft = React.useMemo(() => {
    if (!settings?.examDate) return 0;
    const target = new Date(settings.examDate);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [settings]);

  const timeProgress = settings?.targetThreshold || 0;

  const handleStartLearning = () => {
    if (!lastStudy) {
      router.push('/(tabs)/subjects');
    } else {
      const subjectProgress = user?.progress?.find(p => p.subjectSlug === lastStudy.subjectSlug);
      const isExamDone = lastStudy.type === 'final_exam' && subjectProgress?.finalExamDone;

      if (isExamDone) {
        router.push('/(tabs)/subjects');
      } else {
        // If last study was a quiz, go to the chapter reading instead
        const targetSlug = lastStudy.type === 'quiz' ? lastStudy.chapterSlug : (lastStudy.materialId || lastStudy.chapterSlug);
        
        if (targetSlug) {
          router.push(`/subjects/${lastStudy.subjectSlug}/material/${targetSlug}`);
        } else {
          router.push(`/subjects/${lastStudy.subjectSlug}`);
        }
      }
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pb-6 pt-12">
          <View>
            <Text className="text-2xl font-extrabold">Halo, {name} 👋</Text>
            <Text className="text-sm text-muted-foreground">Yuk lanjutkan belajarmu!</Text>
          </View>
          <TouchableOpacity className="flex-row items-center rounded-full border border-orange-200 bg-orange-100 px-3 py-1.5 dark:border-orange-900/50 dark:bg-orange-950/30">
            <Icon as={Flame} size={18} className="mr-1.5 text-orange-500" />
            <Text className="font-bold text-orange-600">{streak}</Text>
          </TouchableOpacity>
        </View>

        {/* Main Stats Card */}
        <View className="mb-8 mt-2 px-6">
          <Card contentClassName="p-6">
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="rounded-xl bg-orange-100 p-2 dark:bg-orange-950/30">
                  <Icon as={Zap} size={20} className="text-orange-500" />
                </View>
                <Text className="text-lg font-bold">Target Harian</Text>
              </View>
              <Text className="font-bold text-orange-500">{dailyXP}/{dailyGoal} XP</Text>
            </View>
            <View className="h-2.5 overflow-hidden rounded-full bg-secondary">
              <View 
                className="h-full bg-orange-500" 
                style={{ width: `${Math.min(100, (dailyXP / dailyGoal) * 100)}%` }}
              />
            </View>

            {/* Alert Card & Progress Section */}
            <View className="mt-6">
              {/* Alert Box */}
              <View className="mb-6 rounded-2xl bg-secondary p-4">
                <View className="flex-row items-center gap-3 mb-1">
                  <Icon as={AlertTriangle} size={24} className="text-orange-500" />
                  <Text className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {dailyXP >= dailyGoal ? "Target Tercapai! 🎉" : "Perlu Kejar! ⚠️"}
                  </Text>
                </View>
                <Text className="text-xs font-medium text-slate-500 ml-9">
                  {completedChapters}/{totalChapters} bab · {overallProgress}% selesai · 📅 {daysLeft} hari lagi
                </Text>
              </View>

              {/* Progress Bars */}
              <View className="gap-4">
                {/* User Progress */}
                <View className="gap-2">
                  <View className="flex-row justify-between items-end">
                    <Text className="text-xs font-medium text-slate-500">Progres Kamu</Text>
                    <Text className="text-sm font-bold text-primary">{overallProgress}%</Text>
                  </View>
                  <View className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <View 
                      className="h-full rounded-full bg-primary" 
                      style={{ width: `${overallProgress}%` }} 
                    />
                  </View>
                </View>

                {/* Target Ideal */}
                <View className="gap-2">
                  <View className="flex-row justify-between items-end">
                    <Text className="text-xs font-medium text-slate-500">Target Ideal</Text>
                    <Text className="text-sm font-bold text-slate-400">{timeProgress}%</Text>
                  </View>
                  <View className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <View 
                      className="h-full rounded-full bg-slate-300 dark:bg-slate-600" 
                      style={{ width: `${timeProgress}%` }} 
                    />
                  </View>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Subjects Section */}
        <View className="mb-4 px-6">
          <Text className="mb-4 text-xl font-bold">Progressmu</Text>
          <View className="flex-row flex-wrap gap-4">
            {subjects.map((s) => (
              <SubjectCard 
                key={s._id}
                slug={s.slug}
                emoji={s.icon} 
                title={s.title} 
                progress={s.progress} 
                color={s.color}
                variant="compact"
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Floating Action Banner */}
      <View className="absolute bottom-6 left-6 right-6">
        <Button size="lg" className="h-20" onPress={handleStartLearning}>
          <View className="flex-1 flex-row items-center">
            <View className="mr-4 aspect-square items-center justify-center rounded-2xl bg-white/20 p-2.5">
              <Text className="text-2xl">{lastStudy ? "📚" : "✨"}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold leading-tight text-white">
                {lastStudy ? "Lanjutkan Belajar" : "Mulai Belajar"}
              </Text>
              <Text className="text-sm text-white/80" numberOfLines={1}>
                {lastStudy ? lastStudy.title : "Pilih pelajaran pertamamu!"}
              </Text>
            </View>
            <ChevronRight size={20} className="text-white" />
          </View>
        </Button>
      </View>
    </View>
  );
}

