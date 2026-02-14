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
  ClipboardList
} from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, TouchableOpacity, SafeAreaView } from 'react-native';

export default function SubjectDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  
  // Format slug to Title (e.g., matematika -> Matematika)
  const title = typeof slug === 'string' 
    ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ') 
    : 'Matematika';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-8 pb-2 flex-row items-center">
          <Button 
            variant="secondary"
            className="w-12 h-12 mr-4"
            onPress={() => router.back()}
          >
            <Icon as={ChevronLeft} size={24} className="text-foreground" />
          </Button>
          <View className="flex-row items-center gap-3">
             <Text className="text-3xl leading-none">📐</Text>
             <Text className="text-2xl font-extrabold leading-tight">{title}</Text>
          </View>
        </View>

        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Card */}
          <Card className="mt-4 mb-8" contentClassName="p-6">
            <View className="flex-row justify-between items-start mb-2">
              <View>
                <Text className="text-muted-foreground text-sm font-medium mb-1">Progres Belajar</Text>
                <Text className="text-4xl font-extrabold">33%</Text>
              </View>
              <View className="bg-slate-100 px-3 py-1.5 rounded-full flex-row items-center gap-1.5 border border-slate-200">
                <Icon as={BookOpen} size={14} className="text-slate-500" />
                <Text className="text-xs font-bold text-slate-600">1/3 Bab</Text>
              </View>
            </View>
            
            {/* Progress Bar Container */}
            <View className="h-2.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
              <View className="h-full bg-primary rounded-full" style={{ width: '33%' }} />
            </View>
          </Card>

          {/* Syllabus Section */}
          <View className="mb-6">
             <Text className="text-xl font-extrabold mb-1">Silabus Materi</Text>
             <Text className="text-muted-foreground text-sm">3 Bab + Ujian Akhir • {title}</Text>
          </View>

          {/* Chapter List */}
          <View className="gap-4">
            <ChapterCard 
              number={1} 
              title="Bab 1: Pengenalan Matematika" 
              subtitle="Bab 1" 
              hasQuiz
              status="completed" 
            />
            <ChapterCard 
              number={2} 
              title="Bab 2: Pengenalan Matematika" 
              subtitle="Bab 2" 
              hasQuiz
              status="active" 
            />
            <ChapterCard 
              number={3} 
              title="Bab 3: Pengenalan Matematika" 
              subtitle="Bab 3" 
              hasQuiz
              status="locked" 
            />
            <ChapterCard 
              number={null} 
              title="Ujian Akhir Matematika" 
              subtitle="Selesaikan semua bab terlebih dahulu" 
              status="locked-exam" 
            />
          </View>
        </ScrollView>

        {/* Sticky Action Button */}
        <View className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800">
           <Button 
             variant="default" 
             size="lg" 
             className="w-full h-16 rounded-2xl shadow-xl shadow-primary/20"
             onPress={() => router.push(`/materials/${slug}`)}
           >
              <View className="flex-row items-center justify-center gap-3">
                 <Text className="text-lg font-bold text-white">Lanjut Belajar</Text>
                 <Icon as={Play} size={20} className="text-white" fill="white" />
              </View>
           </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

function ChapterCard({ number, title, subtitle, status, hasQuiz }: { number: number | null, title: string, subtitle: string, status: 'completed' | 'active' | 'locked' | 'locked-exam', hasQuiz?: boolean }) {
  const isLocked = status === 'locked' || status === 'locked-exam';
  const isCompleted = status === 'completed';
  const isActive = status === 'active';

  return (
    <TouchableOpacity 
      activeOpacity={isLocked ? 1 : 0.7}
      className={`rounded-[24px] border-2 overflow-hidden ${
        isCompleted ? 'bg-green-50/50 border-green-100' : 
        isActive ? 'bg-white border-slate-100 shadow-sm shadow-black/5' : 
        'bg-slate-50 border-slate-100 opacity-60'
      }`}
    >
      <View className="p-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-5 flex-1">
          {/* Number/Icon */}
          <View className="w-12 h-12 items-center justify-center">
            {status === 'locked-exam' ? (
              <Icon as={Trophy} size={32} className="text-slate-300" />
            ) : (
              <Text className={`text-4xl font-extrabold ${isCompleted ? 'text-green-500' : isActive ? 'text-slate-900' : 'text-slate-300'}`}>
                {number}
              </Text>
            )}
          </View>

          {/* Text Content */}
          <View className="flex-1">
            <Text className={`font-bold text-lg mb-1 ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>{title}</Text>
            <View className="flex-row items-center gap-1.5">
              <Text className="text-xs text-muted-foreground">{subtitle}</Text>
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
        <View className={`w-10 h-10 rounded-full items-center justify-center ${
          isCompleted ? 'bg-green-100' : 
          isActive ? 'bg-primary/10' : 
          'bg-white border border-slate-200'
        }`}>
          {isCompleted && <Icon as={CheckCircle2} size={20} className="text-green-600" />}
          {isActive && <Icon as={Play} size={18} className="text-primary fill-primary" />}
          {isLocked && <Icon as={Lock} size={18} className="text-slate-300" />}
        </View>
      </View>
    </TouchableOpacity>
  );
}
