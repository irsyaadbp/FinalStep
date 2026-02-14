import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ChevronLeft, 
  ClipboardList,
  Clock,
  Check
} from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, SafeAreaView, TouchableOpacity } from 'react-native';

export default function FinalExamScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  
  const [timeLeft, setTimeLeft] = React.useState(89 * 60 + 57); // 89:57
  const [selectedOptions, setSelectedOptions] = React.useState<Record<number, string>>({});
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const subjectName = "Fisika";
  const examTitle = `Ujian Akhir ${subjectName}`;
  
  const questions = [
    { 
      id: 1, 
      text: "Apa itu Fisika?", 
      options: [
        { id: 'A', label: 'Ilmu' },
        { id: 'B', label: 'Seni' },
        { id: 'C', label: 'Olahraga' },
        { id: 'D', label: 'Musik' },
      ]
    },
    { 
      id: 2, 
      text: "1 + 1 = ?", 
      options: [
        { id: 'A', label: '1' },
        { id: 'B', label: '2' },
        { id: 'C', label: '3' },
      ]
    }
  ];

  const handleOptionSelect = (questionId: number, optionId: string) => {
    setSelectedOptions(prev => ({ ...prev, [questionId]: optionId }));
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-8 pb-4 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
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
              <Text className="text-xl font-extrabold">{examTitle}</Text>
            </View>
          </View>
          
          {/* Top Timer */}
          <View className="bg-orange-50 border border-orange-100 px-4 py-2 rounded-2xl flex-row items-center gap-2">
            <Icon as={Clock} size={16} className="text-orange-500" />
            <Text className="font-extrabold text-orange-500">{formatTime(timeLeft)}</Text>
          </View>
        </View>

        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Assessment Card */}
          <Card className="mt-4 mb-8" contentClassName="p-6">
            {/* Exam Info Header */}
            <View className="flex-row items-center justify-between mb-8">
              <View className="flex-row items-center gap-4">
                <View className="bg-primary/10 p-3 rounded-2xl">
                  <Icon as={ClipboardList} size={24} className="text-primary" />
                </View>
                <View>
                  <Text className="text-lg font-bold">{examTitle}</Text>
                  <Text className="text-sm text-muted-foreground">Total 4 Soal</Text>
                </View>
              </View>
            </View>

            {/* Question List */}
            <View className="gap-8">
              {questions.map((q) => (
                <View key={q.id} className="border-2 border-border rounded-lg p-2">
                  <View className="p-4">
                    <Text className="text-xl font-bold text-slate-900 leading-tight mb-8">
                      {q.id}. {q.text}
                    </Text>
                    
                    <View className="gap-4">
                      {q.options.map((option) => {
                        const isSelected = selectedOptions[q.id] === option.id;
                        
                        let borderColor = isSelected ? 'border-primary' : 'border-slate-100';
                        let bgColor = isSelected ? 'bg-primary/5' : 'bg-white';
                        let circleBorderColor = isSelected ? 'border-primary' : 'border-slate-200';
                        let circleTextColor = isSelected ? 'text-primary' : 'text-slate-900';

                        return (
                          <TouchableOpacity
                            key={option.id}
                            onPress={() => handleOptionSelect(q.id, option.id)}
                            className={`flex-row items-center border-2 ${borderColor} ${bgColor} rounded-2xl p-4 h-[72px]`}
                          >
                            <View className={`w-10 h-10 rounded-full items-center justify-center border-2 bg-white ${circleBorderColor} mr-4`}>
                               <Text className={`font-bold text-lg ${circleTextColor}`}>{option.id}</Text>
                            </View>
                            <Text className={`font-bold text-lg flex-1 ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                              {option.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        </ScrollView>

        {/* Sticky Footer */}
        <View className="absolute bottom-0 left-0 right-0 p-6 pt-4 bg-white/95 border-t border-slate-100 flex-row items-center gap-4">
           {/* Bottom Timer */}
           <View className="flex-1 bg-orange-50 border border-orange-100 h-14 rounded-2xl flex-row items-center justify-center gap-2">
              <Icon as={Clock} size={20} className="text-orange-500" strokeWidth={2.5} />
              <Text className="font-extrabold text-orange-500 text-xl">{formatTime(timeLeft)}</Text>
           </View>
           
           <View className="flex-[1.5]">
             <Button 
               variant="default" 
               size="lg" 
               className="h-14 w-full"
               disabled={Object.keys(selectedOptions).length !== questions.length}
               onPress={() => router.push('/(tabs)/subjects')}
             >
                <Text className="font-bold text-lg text-white">Kirim Jawaban</Text>
             </Button>
           </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
