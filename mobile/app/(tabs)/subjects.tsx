import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { ScrollText } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 16) / 2;

export default function SubjectsScreen() {
  const router = useRouter();

  const handlePress = (title: string) => {
    router.push(`/subjects/${title.toLowerCase().replace(/ /g, '-')}`);
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-6 pt-16 pb-8">
          <Text className="text-3xl font-extrabold mb-1">Pelajaran</Text>
          <Text className="text-muted-foreground text-lg">6 mata pelajaran</Text>
        </View>

        <View className="px-6">
          <View className="flex-row flex-wrap gap-4">
            <SubjectDetailCard emoji="📐" title="Matematika" chapters="0/3 Bab" progress={0} onPress={() => handlePress("Matematika")} />
            <SubjectDetailCard emoji="⚡" title="Fisika" chapters="0/3 Bab" progress={0} onPress={() => handlePress("Fisika")} />
            <SubjectDetailCard emoji="🧪" title="Kimia" chapters="0/3 Bab" progress={0} onPress={() => handlePress("Kimia")} />
            <SubjectDetailCard emoji="🧬" title="Biologi" chapters="0/3 Bab" progress={0} onPress={() => handlePress("Biologi")} />
            <SubjectDetailCard emoji="🇬🇧" title="Bahasa Inggris" chapters="0/3 Bab" progress={0} onPress={() => handlePress("Bahasa Inggris")} />
            <SubjectDetailCard emoji="📜" title="Sejarah" chapters="0/3 Bab" progress={0} onPress={() => handlePress("Sejarah")} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function SubjectDetailCard({ emoji, title, chapters, progress, onPress }: { emoji: string, title: string, chapters: string, progress: number, onPress?: () => void }) {
  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      style={{ width: CARD_WIDTH }}
      onPress={onPress}
      className="mb-2"
    >
      <Card contentClassName="p-6 items-center justify-center">
        <View className="bg-slate-50 dark:bg-slate-800 p-5 rounded-full mb-5 aspect-square items-center justify-center">
          <Text className="text-4xl">{emoji}</Text>
        </View>
        <Text className="font-bold text-center text-base mb-1.5">{title}</Text>
        <View className="flex-row items-center gap-1.5 mb-2">
           <Icon as={ScrollText} size={12} className="text-muted-foreground" />
           <Text className="text-xs text-muted-foreground">{chapters}</Text>
        </View>
        <Text className="font-bold text-sm text-primary">{progress}%</Text>
      </Card>
    </TouchableOpacity>
  );
}
