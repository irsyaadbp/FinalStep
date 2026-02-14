import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { Flame, Zap, AlertTriangle, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView, View, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 16) / 2;

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-12 pb-6">
          <View>
            <Text className="text-2xl font-extrabold">Halo, Andi 👋</Text>
            <Text className="text-muted-foreground text-sm">Yuk lanjutkan belajarmu!</Text>
          </View>
          <TouchableOpacity className="flex-row items-center bg-orange-100 dark:bg-orange-950/30 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-900/50">
            <Icon as={Flame} size={18} className="text-orange-500 mr-1.5" />
            <Text className="text-orange-600 font-bold">0</Text>
          </TouchableOpacity>
        </View>

        {/* Main Stats Card */}
        <View className="px-6 mb-8 mt-2">
          <Card contentClassName="p-6">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-3">
                <View className="p-2 bg-orange-100 dark:bg-orange-950/30 rounded-xl">
                  <Icon as={Zap} size={20} className="text-orange-500" />
                </View>
                <Text className="font-bold text-lg">Target Harian</Text>
              </View>
              <Text className="text-orange-500 font-bold">0/100 XP</Text>
            </View>
            <View className="h-2.5 bg-secondary rounded-full overflow-hidden">
              <View className="h-full bg-slate-200 w-[5%]" />
            </View>

            {/* Alert Card Inside (Flat Style) */}
            <View className="mt-6 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[24px] border border-slate-100 dark:border-slate-800">
              <View className="flex-row items-center gap-3 mb-3">
                <View className="p-1.5 bg-orange-100 rounded-lg">
                  <Icon as={AlertTriangle} size={16} className="text-orange-500" />
                </View>
                <Text className="font-bold text-sm">Perlu Kejar! ⚠️</Text>
                <View className="flex-1" />
              </View>
              <View className="flex-row justify-between mb-4">
                 <Text className="text-xs text-muted-foreground">0/18 bab</Text>
                 <Text className="text-xs text-muted-foreground">0% selesai</Text>
                 <Text className="text-xs text-muted-foreground">📅 12 hari lagi</Text>
              </View>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-[10px] text-muted-foreground">Progres Kamu</Text>
                  <Text className="text-[10px] font-bold text-primary">0%</Text>
                </View>
                <View className="h-1.5 bg-slate-200 rounded-full">
                  <View className="h-full bg-primary w-[2%]" />
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-[10px] text-muted-foreground">Target Ideal</Text>
                  <Text className="text-[10px] font-bold text-slate-400">30%</Text>
                </View>
                <View className="h-1.5 bg-slate-200 rounded-full">
                  <View className="h-full bg-slate-300 w-[30%]" />
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Subjects Section */}
        <View className="px-6 mb-4">
          <Text className="text-xl font-bold mb-4">Progressmu</Text>
          <View className="flex-row flex-wrap gap-4">
            <SubjectCard emoji="📐" title="Matematika" progress={0} />
            <SubjectCard emoji="⚡" title="Fisika" progress={0} />
            <SubjectCard emoji="🧪" title="Kimia" progress={0} />
            <SubjectCard emoji="🧬" title="Biologi" progress={0} />
          </View>
        </View>
      </ScrollView>

      {/* Sticky Floating Action Banner */}
      <View className="absolute bottom-6 left-6 right-6">
         <Button 
           size="lg" 
           className="h-20" 
           onPress={() => router.push('/(tabs)/subjects')}
          >
            <View className="flex-1 flex-row items-center">
                <View className="bg-white/20 p-2.5 rounded-2xl mr-4 aspect-square items-center justify-center">
                    <Text className="text-2xl">✨</Text>
                </View>
                <View className="flex-1">
                    <Text className="text-white font-bold text-lg leading-tight">Mulai Belajar</Text>
                    <Text className="text-white/80 text-sm">Pilih pelajaran pertamamu!</Text>
                </View>
                <Icon as={ChevronRight} size={20} className="text-white" />
            </View>
         </Button>
      </View>
    </View>
  );
}

function SubjectCard({ emoji, title, progress }: { emoji: string, title: string, progress: number }) {
  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      style={{ width: CARD_WIDTH }}
    >
      <Card contentClassName="aspect-square p-5 items-center justify-center">
        <View className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-3 aspect-square items-center justify-center">
          <Text className="text-3xl">{emoji}</Text>
        </View>
        <Text className="font-bold text-center mb-1 text-sm">{title}</Text>
        <Text className="text-xs text-muted-foreground">{progress}%</Text>
      </Card>
    </TouchableOpacity>
  );
}
