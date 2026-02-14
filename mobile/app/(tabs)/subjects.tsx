import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { ScrollText } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, TouchableOpacity, Dimensions } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { useAsyncFetch } from '@/hooks/useAsyncFetch';
import { subjectService } from '@/services/subject';
import { SubjectCard } from '@/components/ui/subject-card';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 16) / 2;

export default function SubjectsScreen() {
  const { user } = useAuth();
  const { data: subjectsData, isLoading } = useAsyncFetch(
    async () => {
      return await subjectService.getSubjects();
    }
  );

  const subjects = React.useMemo(() => {
    if (!subjectsData?.data || !user) return [];
    return subjectsData.data.map((s) => {
      const userProgress = user.progress?.find((p) => p.subjectSlug === s.slug);
      return {
        ...s,
        progress: userProgress?.progressPercent || 0,
        completedChaptersCount: userProgress?.completedChapters?.length || 0,
      };
    });
  }, [subjectsData, user]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <View className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-6 pb-8 pt-16">
          <Text className="mb-1 text-3xl font-extrabold text-foreground">Pelajaran</Text>
          <Text className="text-lg text-muted-foreground">{subjects.length} mata pelajaran</Text>
        </View>

        <View className="px-6">
          <View className="flex-row flex-wrap gap-4">
            {subjects.map((s) => (
              <SubjectCard
                key={s._id}
                emoji={s.icon}
                title={s.title}
                chapters={`${s.completedChaptersCount}/${s.totalChapters || 0} Bab`}
                progress={s.progress}
                color={s.color}
                slug={s.slug}
                variant="detailed"
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
