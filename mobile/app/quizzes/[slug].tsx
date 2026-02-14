import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ChevronLeft, 
  ClipboardList,
  Check,
  X,
  ArrowRight
} from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, SafeAreaView, TouchableOpacity } from 'react-native';

export default function QuizScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  
  const subjectName = "Fisika";
  const quizTitle = "Kuis Bab 1";
  
  const options = [
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
    { id: 'C', label: 'C' },
    { id: 'D', label: 'D' },
  ];

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (isSubmitted) {
      router.push('/subjects/complete');
    } else {
      setIsSubmitted(true);
    }
  };

  // Mock correct answer for demonstration
  const correctAnswer = 'A';

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
            <Text className="text-xl font-extrabold">{quizTitle}</Text>
          </View>
        </View>

        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Assessment Card */}
          <Card className="mt-4 mb-8" contentClassName="p-6">
            {/* Quiz Info Header */}
            <View className="flex-row items-center justify-between mb-8">
              <View className="flex-row items-center gap-4">
                <View className="bg-primary/10 p-3 rounded-2xl">
                  <Icon as={ClipboardList} size={24} className="text-primary" />
                </View>
                <View>
                  <Text className="text-lg font-bold">{quizTitle}</Text>
                  <Text className="text-sm text-muted-foreground">1 dari 4 Soal</Text>
                </View>
              </View>
            </View>

            {/* Question Outline Wrapper */}
            <View className="border-2 border-border rounded-lg p-2">
               {/* Question Inner Card */}
               <View className='p-4'>
                 <Text className="text-xl font-bold text-slate-900 leading-tight mb-8">
                   1. Pertanyaan kuis bab 1?
                 </Text>
                 
                 <View className="gap-4">
                   {options.map((option) => {
                     const isSelected = selectedOption === option.id;
                     const isCorrect = isSubmitted && option.id === correctAnswer;
                     const isWrong = isSubmitted && isSelected && option.id !== correctAnswer;
                     
                   let borderColor = 'border-slate-100';
                   let bgColor = 'bg-white';
                   let circleBorderColor = 'border-slate-200';
                   let circleTextColor = 'text-slate-900';
                   let labelColor = 'text-slate-500';

                   if (isCorrect) {
                     borderColor = 'border-green-500';
                     bgColor = 'bg-green-50/50';
                     circleBorderColor = 'border-green-500';
                     circleTextColor = 'text-green-600';
                     labelColor = 'text-green-700';
                   } else if (isWrong) {
                     borderColor = 'border-red-500';
                     bgColor = 'bg-red-50/50';
                     circleBorderColor = 'border-red-500';
                     circleTextColor = 'text-red-600';
                     labelColor = 'text-red-700';
                   } else if (isSelected) {
                     borderColor = 'border-primary';
                     bgColor = 'bg-primary/5';
                     circleBorderColor = 'border-primary';
                     circleTextColor = 'text-primary';
                     labelColor = 'text-slate-900';
                   }

                   return (
                     <TouchableOpacity
                       key={option.id}
                       activeOpacity={isSubmitted ? 1 : 0.7}
                       onPress={() => handleOptionSelect(option.id)}
                       className={`flex-row items-center justify-between border-2 ${borderColor} ${bgColor} rounded-2xl p-4 h-[72px]`}
                     >
                         <View className="flex-row items-center gap-4 flex-1">
                            <View className={`w-10 h-10 rounded-full items-center justify-center border-2 bg-white ${circleBorderColor}`}>
                               <Text className={`font-bold text-lg ${circleTextColor}`}>{option.id}</Text>
                            </View>
                            <Text className={`font-bold text-lg flex-1 ${labelColor}`}>
                              {option.label}
                            </Text>
                         </View>
                         
                         <View className="w-6 items-center">
                           {isCorrect && <Icon as={Check} size={20} className="text-green-600" strokeWidth={3} />}
                           {isWrong && <Icon as={X} size={20} className="text-red-600" strokeWidth={3} />}
                         </View>
                       </TouchableOpacity>
                     );
                   })}
                 </View>
               </View>
            </View>
          </Card>
        </ScrollView>

        {/* Sticky Footer */}
        <View className="absolute bottom-0 left-0 right-0 p-6 pt-4 bg-white/95 border-t border-slate-100 flex-row gap-4 items-center">
           <Button 
             variant="secondary" 
             className="w-14 h-14" 
             onPress={() => router.back()}
           >
              <Icon as={ChevronLeft} size={24} className="text-foreground" />
           </Button>
           
           <View className="flex-1">
             <Button 
               variant="default" 
               size="lg" 
               className="h-14 w-full"
               disabled={!selectedOption && !isSubmitted}
               onPress={handleSubmit}
             >
                <View className="flex-row items-center justify-center gap-2">
                   {isSubmitted ? (
                      <>
                        <Text className="font-bold text-lg text-white">Lanjut</Text>
                        <Icon as={ArrowRight} size={20} className="text-white" strokeWidth={2.5} />
                      </>
                   ) : (
                      <Text className="font-bold text-lg text-white">Kirim Jawaban</Text>
                   )}
                </View>
             </Button>
           </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
