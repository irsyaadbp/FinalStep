import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  BookOpen,
  Play,
  Lock,
  CheckCircle2,
  Trophy,
  ClipboardList,
} from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { useAsyncFetch } from '@/hooks/useAsyncFetch';
import { subjectService } from '@/services/subject';
import { chapterService } from '@/services/chapter';
import { finalExamService } from '@/services/final-exam';
import { Chapter, FinalExam, Subject } from '@/lib/types';

export default function SubjectDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  const { user } = useAuth();

  const { data: subjectRes, isLoading: isSubjectLoading } = useAsyncFetch(async () => {
    if (typeof slug !== 'string') return null;
    return await subjectService.getSubject(slug);
  });

  const { data: chaptersRes, isLoading: isChaptersLoading } = useAsyncFetch(async () => {
    if (typeof slug !== 'string') return null;
    return await chapterService.getChapters(slug);
  });

  const { data: finalExamRes, isLoading: isExamLoading } = useAsyncFetch(async () => {
    if (typeof slug !== 'string') return null;
    return await finalExamService.getFinalExam(slug);
  });

  const subject = subjectRes?.data;
  const chapters = chaptersRes?.data || [];
  const finalExam = finalExamRes?.data;

  const subjectProgress = user?.progress?.find((p) => p.subjectSlug === slug);
  const completedChapters = subjectProgress?.completedChapters || [];
  const isFinalExamPassed = subjectProgress?.finalExamDone || false;

  const chaptersWithStatus = React.useMemo(() => {
    return chapters.map((c, i) => {
      const isCompleted = completedChapters.includes(c.slug);
      const isUnlocked = i === 0 || completedChapters.includes(chapters[i - 1].slug);
      let status: 'completed' | 'active' | 'locked' = 'locked';
      if (isCompleted) status = 'completed';
      else if (isUnlocked) status = 'active';
      return { ...c, status };
    });
  }, [chapters, completedChapters]);

  const allChaptersCompleted = chapters.length > 0 && completedChapters.length === chapters.length;
  const isFinalExamUnlocked = allChaptersCompleted;

  if (isSubjectLoading || isChaptersLoading || isExamLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  if (!subject) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text>Mata pelajaran tidak ditemukan</Text>
        <Button onPress={() => router.back()}>
          <Text>Kembali</Text>
        </Button>
      </SafeAreaView>
    );
  }

  const completedCount = completedChapters.length;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-6 pb-2 pt-8">
          <Button variant="secondary" className="mr-4 h-12 w-12" onPress={() => router.back()}>
            <Icon as={ChevronLeft} size={24} className="text-foreground" />
          </Button>
          <View className="flex-row items-center gap-3">
            <Text className="text-3xl leading-none">{subject.icon}</Text>
            <Text className="text-2xl font-extrabold leading-tight">{subject.title}</Text>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}>
          {/* Progress Card */}
          <Card className="mb-8 mt-4" contentClassName="p-6">
            <View className="mb-2 flex-row items-start justify-between">
              <View>
                <Text className="mb-1 text-sm font-medium text-muted-foreground">
                  Progres Belajar
                </Text>
                <Text className="text-4xl font-extrabold">
                  {subjectProgress?.progressPercent || 0}%
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5">
                <Icon as={BookOpen} size={14} className="text-slate-500" />
                <Text className="text-xs font-bold text-slate-600">
                  {completedCount}/{chapters.length} Bab
                </Text>
              </View>
            </View>

            {/* Progress Bar Container */}
            <View className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <View
                className="h-full rounded-full bg-primary"
                style={{ width: `${subjectProgress?.progressPercent || 0}%` }}
              />
            </View>
          </Card>

          {/* Syllabus Section */}
          <View className="mb-6">
            <Text className="mb-1 text-xl font-extrabold text-foreground">Silabus Materi</Text>
            <Text className="text-sm text-muted-foreground">
              {chapters.length} Bab{finalExam ? ' + Ujian Akhir' : ''} • {subject.title}
            </Text>
          </View>

          {/* Chapter List */}
          <View className="gap-4">
            {chaptersWithStatus.map((ch, i) => (
              <ChapterCard
                key={ch._id}
                number={i + 1}
                title={ch.title}
                subtitle={`Bab ${i + 1}`}
                hasQuiz={ch.hasQuiz}
                status={ch.status}
                onPress={() =>
                  ch.status !== 'locked' && router.push(`/subjects/${slug}/material/${ch.slug}`)
                }
              />
            ))}
            {finalExam && (
              <ChapterCard
                number={null}
                title={finalExam.title}
                subtitle={
                  isFinalExamPassed
                    ? '🏆 Lulus!'
                    : !isFinalExamUnlocked
                      ? 'Selesaikan semua bab terlebih dahulu'
                      : `${finalExam.questions.length} soal • Ujian Akhir`
                }
                status={
                  isFinalExamPassed
                    ? 'completed'
                    : isFinalExamUnlocked
                      ? 'active-exam'
                      : 'locked-exam'
                }
                onPress={() =>
                  isFinalExamUnlocked &&
                  !isFinalExamPassed &&
                  router.push(`/subjects/${slug}/material/${finalExam._id}`)
                }
              />
            )}
          </View>
        </ScrollView>

        {/* Sticky Action Button */}
        <View className="absolute bottom-0 left-0 right-0 p-6">
          <Button
            variant="default"
            size="lg"
            className="h-16 w-full rounded-2xl shadow-xl shadow-primary/20"
            onPress={() => {
              const firstIncomplete = chaptersWithStatus.findIndex((c) => c.status !== 'completed');
              const target =
                firstIncomplete === -1
                  ? finalExam && !isFinalExamPassed
                    ? finalExam._id
                    : chapters[0].slug
                  : chapters[firstIncomplete].slug;
              router.push(`/subjects/${slug}/material/${target}`);
            }}>
            <View className="flex-row items-center justify-center gap-3">
              <Text className="text-lg font-bold text-white">
                {completedCount === 0 ? 'Mulai Belajar' : 'Lanjut Belajar'}
              </Text>
              <Icon as={Play} size={20} className="text-white" fill="white" />
            </View>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

function ChapterCard({
  number,
  title,
  subtitle,
  status,
  hasQuiz,
  onPress,
}: {
  number: number | null;
  title: string;
  subtitle: string;
  status: 'completed' | 'active' | 'locked' | 'locked-exam' | 'active-exam';
  hasQuiz?: boolean;
  onPress?: () => void;
}) {
  const isLocked = status === 'locked' || status === 'locked-exam';
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  const isExamActive = status === 'active-exam';
  const isExam = number === null; // Final Exam has no number

  // Specific styles for Exam Success
  const isExamSuccess = isExam && isCompleted;

  return (
    <TouchableOpacity
      activeOpacity={isLocked ? 1 : 0.7}
      onPress={onPress}
      className={`overflow-hidden rounded-[24px] border-2 ${
        isExamSuccess
          ? 'border-orange-200 bg-[#FFF8F0]'
          : isCompleted
            ? 'border-green-100 bg-green-50/50'
            : isExamActive
              ? 'border-orange-200 bg-white shadow-sm shadow-orange-500/10'
              : isActive
                ? 'border-slate-100 bg-white shadow-sm shadow-black/5'
                : 'border-slate-100 bg-slate-50 opacity-60'
      }`}>
      <View className="flex-row items-center justify-between p-6">
        <View className="flex-1 flex-row items-center gap-5">
          {/* Number/Icon */}
          <View
            className={`h-12 w-12 items-center justify-center rounded-full ${isExamSuccess || isExamActive ? 'bg-orange-100' : ''}`}>
            {isExam ? (
              <Icon
                as={Trophy}
                size={24}
                className={isExamSuccess || isExamActive ? 'text-orange-500' : 'text-slate-300'}
              />
            ) : (
              <Text
                className={`text-4xl font-extrabold ${isCompleted ? 'text-green-500' : isActive ? 'text-slate-900' : 'text-slate-300'}`}>
                {number}
              </Text>
            )}
          </View>

          {/* Text Content */}
          <View className="flex-1">
            <Text
              className={`mb-1 text-lg font-bold ${isExamSuccess ? 'text-orange-500' : isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
              {title}
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Text
                className={`text-xs ${isExamSuccess ? 'font-medium text-slate-500' : isExamActive ? 'font-medium text-orange-600' : 'text-muted-foreground'}`}>
                {subtitle}
              </Text>
              {hasQuiz && (
                <>
                  <Text className="text-xs text-muted-foreground">•</Text>
                  <View className="flex-row items-center gap-1">
                    <Icon as={ClipboardList} size={12} className="text-muted-foreground" />
                    <Text className="text-xs text-muted-foreground">Quiz</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Action Icon */}
        <View
          className={`h-10 w-10 items-center justify-center rounded-full ${
            isExamSuccess
              ? 'border border-orange-200 bg-orange-100'
              : isCompleted
                ? 'bg-green-100'
                : isExamActive
                  ? 'bg-orange-100'
                  : isActive
                    ? 'bg-primary/10'
                    : 'border border-slate-200 bg-white'
          }`}>
          {isExamSuccess ? (
            <Icon as={CheckCircle2} size={20} className="text-orange-500" />
          ) : isCompleted ? (
            <Icon as={CheckCircle2} size={20} className="text-green-600" />
          ) : isExamActive ? (
            <Icon as={Play} size={18} className="fill-orange-500 text-orange-500" />
          ) : isActive ? (
            <Icon as={Play} size={18} className="fill-primary text-primary" />
          ) : (
            <Icon as={Lock} size={18} className="text-slate-300" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
