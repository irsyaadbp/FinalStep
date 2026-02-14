import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import { GraduationCapIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

export default function SplashScreen({ onFinish }: { onFinish?: () => void }) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onFinish) setTimeout(onFinish, 600);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <View className="flex-1 bg-primary items-center justify-center p-6">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="items-center gap-6">
        {/* Logo Container */}
        <View className="relative overflow-visible pb-2">
          <View className="bg-primary-foreground/15 rounded-xl p-8">
            <Icon as={GraduationCapIcon} size={64} className="text-white" />
          </View>
        </View>

        <View className="items-center gap-2">
          <Text className="text-4xl font-bold text-white">FinalStep</Text>
          <Text className="text-white/80 text-lg">Persiapkan masa depanmu</Text>
        </View>

        {/* Progress Bar matching frontend */}
        <View className="mt-12 w-[200px] h-1.5 overflow-hidden rounded-full bg-primary-foreground/20">
          <View 
            className="h-full rounded-full bg-primary-foreground" 
            style={{ width: `${Math.min(progress, 100)}%` }} 
          />
        </View>
      </View>
    </View>
  );
}
