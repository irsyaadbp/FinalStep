import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ClipboardList, Trophy, Play } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, SafeAreaView, ActivityIndicator, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

import { useAsyncFetch } from '@/hooks/useAsyncFetch';
import { chapterService } from '@/services/chapter';
import { finalExamService } from '@/services/final-exam';
import { subjectService } from '@/services/subject';
import { progressService } from '@/services/progress';
import { useAuth } from '@/context/AuthContext';
import { Chapter, FinalExam, Subject } from '@/lib/types';
import { QuizView } from '@/components/learning/QuizView';
import { FinalExamView } from '@/components/learning/FinalExamView';
import { quizService } from '@/services/quiz';

// Define styles for HTML elements outside relevant to avoid recreation
const tagsStyles = {
  body: {
    color: '#334155', // slate-700
    fontSize: 16,
    lineHeight: 24,
  },
  p: {
    marginBottom: 12,
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 12,
    color: '#0f172a', // slate-900
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
    color: '#0f172a', // slate-900
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
    color: '#0f172a', // slate-900
  },
  ul: {
    marginLeft: 0,
    marginBottom: 12,
    paddingLeft: 20,
  },
  ol: {
    marginLeft: 0,
    marginBottom: 12,
    paddingLeft: 20,
  },
  li: {
    marginBottom: 4,
  },
  strong: {
    fontWeight: 'bold',
    color: '#0f172a', // slate-900
  },
  a: {
    color: '#4f46e5', // indigo-600
    textDecorationLine: 'underline',
  },
  img: {
    borderRadius: 8,
    marginVertical: 12,
  },
  pre: {
    backgroundColor: '#f1f5f9', // slate-100
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  code: {
    backgroundColor: '#f1f5f9', // slate-100
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#ef4444', // red-500
  },
};

export default function MaterialScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const slug = params.slug as string; // subject slug
  const mid = params.mid as string; // material id or chapter slug
  const { user, refreshUser } = useAuth();
  const { width } = useWindowDimensions();

  const [viewMode, setViewMode] = React.useState<'reading' | 'quiz' | 'exam' | 'complete'>(
    'reading'
  );
  const [quizData, setQuizData] = React.useState<any>(null); // Store fetched quiz data
  const [finalExamId, setFinalExamId] = React.useState<string | null>(null);

  const { data: subjectRes, isLoading: isSubjectLoading } = useAsyncFetch(async () => {
    const res = await subjectService.getSubject(slug);
    return res;
  });

  const { data: chaptersRes, isLoading: isChaptersLoading } = useAsyncFetch(async () => {
    return await chapterService.getChapters(slug);
  });

  const { data: finalExamRes, isLoading: isExamLoading } = useAsyncFetch(async () => {
    return await finalExamService.getFinalExam(slug);
  });

  const [activeContent, setActiveContent] = React.useState<Chapter | FinalExam | null>(null);
  const [contentType, setContentType] = React.useState<'chapter' | 'final_exam' | null>(null);

  // Resolve active content
  React.useEffect(() => {
    const chapters = chaptersRes?.data || [];
    const finalExam = finalExamRes?.data;

    if (mid) {
      // 1. Try finding in chapters
      const foundChapter = chapters.find((c) => c.slug === mid);
      if (foundChapter) {
        setActiveContent(foundChapter);
        setContentType('chapter');
        setViewMode('reading');
        return;
      }

      // 2. Try finding in final exam
      if (finalExam && finalExam._id === mid) {
        setActiveContent(finalExam);
        setContentType('final_exam');
        setViewMode('exam');
        return;
      }
    }
  }, [mid, chaptersRes, finalExamRes]);

  // Fetch quiz data when entering quiz mode
  React.useEffect(() => {
    const fetchQuiz = async () => {
      if (viewMode === 'quiz' && !quizData && contentType === 'chapter') {
        try {
          const res = await quizService.getQuiz(slug, mid);
          if (res.success) {
            setQuizData(res.data);
          }
        } catch (e) {
          console.error('Failed to fetch quiz', e);
          setViewMode('reading'); // Fallback
        }
      }
    };
    fetchQuiz();
  }, [viewMode, mid, contentType]);

  // Fetch Final Exam ID if entering complete mode
  React.useEffect(() => {
    // No need to fetch ID separately, we have it in finalExamRes
    if (viewMode === 'complete' && finalExamRes?.data && !finalExamId) {
      setFinalExamId(finalExamRes.data._id);
    }
  }, [viewMode, finalExamRes, finalExamId]);

  if (isSubjectLoading || isChaptersLoading || isExamLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  const subject = subjectRes?.data;
  const content = activeContent;
  const type = contentType;
  const chapters = chaptersRes?.data || [];

  if (!subject || !content) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text>Materi tidak ditemukan</Text>
        <View>
          <Button variant={'link'} onPress={() => router.back()}>
            <Text className="text-center">Kembali</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const subjectName = subject.title;
  const chapterTitle = content.title;
  const emoji = subject.icon;

  const navigateToNext = () => {
    if (!subject) return;

    // Logic to find next chapter
    const currentIndex = chapters.findIndex((c) => c.slug === mid);

    if (currentIndex !== -1 && currentIndex < chapters.length - 1) {
      // Go to next chapter
      const nextChapter = chapters[currentIndex + 1];
      router.setParams({ mid: nextChapter.slug });
    } else {
      // Check for final exam - trigger complete screen
      setViewMode('complete');
    }
  };




  const handleFinishReading = async () => {
    if (type === 'chapter') {
      if ((content as Chapter).hasQuiz) {
        setViewMode('quiz');
      } else {
        await progressService.completeChapter(slug, mid);
        refreshUser();
        navigateToNext();
      }
    }
  };

  const handleQuizComplete = async () => {
    await progressService.completeChapter(slug, mid);
    if (quizData) {
      await progressService.completeQuiz(slug, quizData._id);
    }
    refreshUser();
    navigateToNext();
  };

  const handleExamComplete = async () => {
    await progressService.completeFinalExam(slug);
    refreshUser();
    router.back();
  };

  // Render Views based on mode
  if (viewMode === 'quiz' && quizData) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-row items-center px-6 pb-0 pt-8">
          <Button
            variant="secondary"
            className="mr-4 h-12 w-12"
            onPress={() => setViewMode('reading')}>
            <Icon as={ChevronLeft} size={24} className="text-foreground" />
          </Button>
          <View className="flex-1">
            <View className="mb-1 flex-row items-center gap-1.5">
              <Text className="text-xs">{emoji}</Text>
              <Text className="text-xs font-bold uppercase text-muted-foreground">
                {subjectName}
              </Text>
            </View>
            <Text className="text-xl font-extrabold">{quizData.title}</Text>
          </View>
        </View>
        <QuizView
          quiz={quizData}
          subjectSlug={slug}
          chapterSlug={mid}
          onComplete={handleQuizComplete}
          onBack={() => setViewMode('reading')}
        />
      </SafeAreaView>
    );
  }

  if (viewMode === 'exam' && type === 'final_exam') {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-row items-center px-6 pb-0 pt-8">
          <Button variant="secondary" className="mr-4 h-12 w-12" onPress={() => router.back()}>
            <Icon as={ChevronLeft} size={24} className="text-foreground" />
          </Button>
          <View className="flex-1">
            <View className="mb-1 flex-row items-center gap-1.5">
              <Text className="text-xs">{emoji}</Text>
              <Text className="text-xs font-bold uppercase text-muted-foreground">
                {subjectName}
              </Text>
            </View>
            <Text className="text-xl font-extrabold">{chapterTitle}</Text>
          </View>
        </View>
        <FinalExamView
          exam={content as FinalExam}
          subjectSlug={slug}
          onComplete={handleExamComplete}
          onBack={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  if (viewMode === 'complete') {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background p-6">
        <View className="items-center">
          <View className="mb-6 rounded-full bg-orange-100 p-6">
            <Icon as={Trophy} size={64} className="text-orange-500" />
          </View>
          <Text className="mb-2 text-center text-2xl font-extrabold">Selamat!</Text>
          <Text className="mb-8 text-center text-lg text-slate-600">
            Kamu telah menyelesaikan semua bab materi. Sekarang saatnya membuktikan kemampuanmu
            dengan Ujian Akhir!
          </Text>

          <View>
            <Button
              variant="default"
              className="mb-4 h-14 rounded-2xl"
              disabled={!finalExamId}
              onPress={() => {
                if (finalExamId) {
                  router.setParams({ mid: finalExamId });
                }
              }}>
              <Text className="text-center">Mulai Ujian Akhir</Text>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="h-14 rounded-2xl"
              onPress={() => router.back()}>
              <Text className="text-center">Kembali ke Silabus</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Default: Reading View
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-6 pb-4 pt-8">
          <Button variant="secondary" className="mr-4 h-12 w-12" onPress={() => router.back()}>
            <Icon as={ChevronLeft} size={24} className="text-foreground" />
          </Button>
          <View className="flex-1">
            <View className="mb-1 flex-row items-center gap-1.5">
              <Text className="text-xs">{emoji}</Text>
              <Text className="text-xs font-bold uppercase text-muted-foreground">
                {subjectName}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="mr-2 flex-1 text-xl font-extrabold">{chapterTitle}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}>
          {/* Content Card */}
          <Card contentClassName="p-4">
            {type === 'chapter' ? (
              <RenderHtml
                contentWidth={width - 80} // Adjust for card padding (24 padding horizontal * 2 + card padding)
                source={{ html: (content as Chapter).content || '<p>Tidak ada konten.</p>' }}
                tagsStyles={tagsStyles as any}
                systemFonts={['Inter', 'System']} // Add your app's custom fonts here if needed
              />
            ) : (
              <Text className="mb-6 text-lg leading-relaxed text-slate-600">
                Selamat! Kamu telah menyelesaikan semua bab. Sekarang saatnya menguji kemampuanmu di Ujian Akhir untuk mendapatkan sertifikat dan XP tambahan!
              </Text>
            )}
          </Card>
        </ScrollView>

        {/* Sticky Footer */}
        <View className="absolute bottom-0 left-0 right-0 flex-row gap-4 border-t border-slate-100 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-900/80">
          <Button
            variant="secondary"
            size="lg"
            className="h-14 flex-1 rounded-2xl"
            onPress={() => router.back()}>
            <View className="flex-row items-center justify-center gap-2">
              <Icon as={ChevronLeft} size={18} className="text-foreground" />
              <Text className="font-bold">Silabus</Text>
            </View>
          </Button>

          <Button
            variant="default"
            size="lg"
            className="h-14 flex-[2] rounded-2xl"
            onPress={handleFinishReading}>
            <View className="flex-row items-center justify-center gap-2">
              <Icon as={ClipboardList} size={18} className="text-white" />

              <Text className="font-bold">
                {(content as Chapter).hasQuiz ? 'Mulai Quiz' : 'Lanjut'}
              </Text>
            </View>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
