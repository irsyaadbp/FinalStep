import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ChevronLeft, 
  ClipboardList 
} from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, SafeAreaView } from 'react-native';

export default function MaterialScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  
  // Mock data/title extraction
  const subjectName = "Fisika";
  const chapterTitle = "Bab 1: Pengenalan Fisika";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-8 pb-4 flex-row items-center">
          <Button 
            variant="secondary"
            className="w-12 h-12 mr-4"
            onPress={() => router.back()}
          >
            <Icon as={ChevronLeft} size={24} className="text-foreground" />
          </Button>
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5 mb-1">
               <Text className="text-xs text-orange-400">⚡</Text>
               <Text className="text-xs font-bold text-muted-foreground uppercase">{subjectName}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-extrabold flex-1 mr-2">{chapterTitle}</Text>
              <Text className="text-sm font-bold text-muted-foreground">1 / 3</Text>
            </View>
          </View>
        </View>

        {/* Progress Bar Header */}
        <View className="px-6 mb-6">
           <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <View className="h-full bg-primary rounded-full" style={{ width: '33%' }} />
           </View>
        </View>

        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Content Card */}
          <Card contentClassName="p-8">
            <Text className="text-lg text-slate-600 leading-relaxed mb-6">
              Ini adalah konten pembelajaran untuk Bab 1 pada mata pelajaran Fisika.
            </Text>
            
            <View className="gap-4">
              <View className="flex-row items-start gap-3">
                <View className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2.5" />
                <Text className="text-lg text-slate-600">Poin 1</Text>
              </View>
              <View className="flex-row items-start gap-3">
                <View className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2.5" />
                <Text className="text-lg text-slate-600">Poin 2</Text>
              </View>
            </View>
          </Card>
        </ScrollView>

        {/* Sticky Footer */}
        <View className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex-row gap-4">
           <Button 
             variant="secondary" 
             size="lg" 
             className="flex-1 h-14 rounded-2xl" 
             onPress={() => router.back()}
           >
              <View className="flex-row items-center justify-center gap-2">
                 <Icon as={ChevronLeft} size={18} className="text-foreground" />
                 <Text className="font-bold">Silabus</Text>
              </View>
           </Button>
           
           <Button 
             variant="default" 
             size="lg" 
             className="flex-[2] h-14 rounded-2xl"
             onPress={() => router.push(`/quizzes/${slug}`)}
           >
              <View className="flex-row items-center justify-center gap-2">
                 <Icon as={ClipboardList} size={18} className="text-white" />
                 <Text className="font-bold">Mulai Quiz</Text>
              </View>
           </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
