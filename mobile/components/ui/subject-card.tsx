import { useRouter } from 'expo-router';
import { ScrollText } from 'lucide-react-native';
import * as React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { CircularProgress } from '@/components/ui/circular-progress';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 16) / 2;

interface SubjectCardProps {
  slug: string;
  emoji: string;
  title: string;
  progress: number;
  chapters?: string;
  variant?: 'compact' | 'detailed';
  color?: string;
  onPress?: () => void;
  className?: string;
}

export function SubjectCard({
  slug,
  emoji,
  title,
  progress,
  chapters,
  variant = 'compact',
  color = 'transparent',
  onPress,
  className,
}: SubjectCardProps) {
  const router = useRouter();
  const isDetailed = variant === 'detailed';

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/subjects/${slug}`);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{ width: CARD_WIDTH }}
      onPress={handlePress}
      className={cn('mb-2', className)}>
      <Card
        contentClassName={cn(
          'items-center justify-center',
          isDetailed ? 'p-6' : 'aspect-square p-5'
        )}>
        <View className={cn('mb-5 items-center justify-center')}>
          <CircularProgress
            size={isDetailed ? 90 : 80}
            strokeWidth={4}
            progress={progress}
            color="#4F46E5" // primary color
          >
            <View className="aspect-square items-center justify-center rounded-full p-4">
              <Text className={isDetailed ? 'text-4xl' : 'text-3xl'}>{emoji}</Text>
            </View>
          </CircularProgress>
        </View>

        <Text className={cn('mb-1.5 text-center font-bold', isDetailed ? 'text-base' : 'text-sm')}>
          {title}
        </Text>

        {isDetailed && chapters && (
          <View className="mb-2 flex-row items-center gap-1.5">
            <Icon as={ScrollText} size={12} className="text-muted-foreground" />
            <Text className="text-xs text-muted-foreground">{chapters}</Text>
          </View>
        )}

        <Text
          className={cn(
            'text-sm font-bold',
            isDetailed ? 'text-primary' : 'text-xs text-muted-foreground'
          )}>
          {progress}%
        </Text>
      </Card>
    </TouchableOpacity>
  );
}
