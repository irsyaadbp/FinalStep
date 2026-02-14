import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { Trophy, ClipboardList } from 'lucide-react-native';
import * as React from 'react';
import { View, SafeAreaView } from 'react-native';

export default function CompletionScreen() {
  const router = useRouter();
  const subjectName = "Fisika";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-10">
        {/* Trophy Icon */}
        <View className="bg-orange-100 p-8 rounded-[40px] mb-8">
          <Icon as={Trophy} size={64} className="text-orange-500" />
        </View>

        {/* Success Message */}
        <View className="items-center mb-10">
          <Text className="text-4xl font-extrabold mb-3">Selamat! 🥳</Text>
          <Text className="text-center text-lg text-slate-500 leading-relaxed">
            Kamu telah menyelesaikan semua materi dalam mata pelajaran <Text className="font-bold text-slate-900">{subjectName}</Text>. Sekarang saatnya menguji kemampuanmu di Ujian Akhir!
          </Text>
        </View>

        {/* Final Exam Invitation Card */}
        <Card className="w-full mb-10" contentClassName="p-6">
          <View className="flex-row items-center gap-4">
            <View className="bg-indigo-50 p-3 rounded-2xl">
              <Icon as={ClipboardList} size={24} className="text-indigo-500" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold">Ujian Akhir {subjectName}</Text>
              <Text className="text-xs text-muted-foreground leading-snug">
                4 soal • Ambil ujian ini untuk mendapatkan sertifikat dan XP tambahan!
              </Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View className="w-full gap-4">
          <Button 
            variant="default" 
            size="lg" 
            className="h-16 rounded-2xl"
            onPress={() => router.push(`/exams/${subjectName.toLowerCase()}`)}
          >
            <Text className="text-lg font-bold text-white">Mulai Ujian Akhir</Text>
          </Button>
          
          <Button 
            variant="secondary" 
            size="lg" 
            className="h-16 rounded-2xl border-2 border-slate-100"
            onPress={() => router.push('/(tabs)/subjects')}
          >
            <Text className="text-lg font-bold text-slate-500">Nanti Saja</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
