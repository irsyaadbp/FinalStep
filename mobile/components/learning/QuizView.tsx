import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ChevronLeft, ClipboardList, Check, X, ArrowRight } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native';

import { Quiz } from '@/lib/types';

interface QuizViewProps {
  quiz: Quiz;
  subjectSlug: string;
  chapterSlug: string;
  onComplete: () => void;
  onBack: () => void;
}

export function QuizView({ quiz, subjectSlug, chapterSlug, onComplete, onBack }: QuizViewProps) {
  const [answers, setAnswers] = React.useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [result, setResult] = React.useState<{ xpEarned: number; correctCount: number } | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (isSubmitted) {
      onComplete();
      return;
    }

    setIsSubmitting(true);
    
    // Calculate score locally
    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    
    const xpEarned = correctCount * 10;
    
    // Simulate API delay for better UX
    setTimeout(() => {
        setResult({
            correctCount,
            xpEarned
        });
        setIsSubmitted(true);
        setIsSubmitting(false);
    }, 500);
  };

  const allAnswered = quiz.questions.every((_, index) => answers[index] !== undefined);

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}>
        <View className="mb-8 mt-4">
          {/* Questions List */}
          <Card contentClassName="p-4 border-2 border-border rounded-xl gap-6">
            {/* Header */}
            <View className="flex-row items-center gap-4">
              <View className="rounded-2xl bg-primary/10 p-3">
                <Icon as={ClipboardList} size={24} className="text-primary" />
              </View>
              <View>
                <Text className="text-lg font-bold">{quiz.title}</Text>
                <Text className="text-sm text-muted-foreground">{quiz.questions.length} Soal</Text>
              </View>
            </View>

            {quiz.questions.map((question, qIndex) => (
              <View key={qIndex} className="rounded-xl border-2 border-border p-4">
                <Text className="mb-4 text-base font-bold leading-tight text-slate-900">
                  {qIndex + 1}. {question.question}
                </Text>
                <View className="gap-3">
                  {question.options.map((option, oIndex) => {
                    const id = String.fromCharCode(65 + oIndex);
                    const isSelected = answers[qIndex] === oIndex;
                    const isCorrect = isSubmitted && oIndex === question.correctAnswer;
                    const isWrong = isSubmitted && isSelected && oIndex !== question.correctAnswer;

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
                        key={oIndex}
                        activeOpacity={isSubmitted ? 1 : 0.7}
                        onPress={() => handleOptionSelect(qIndex, oIndex)}
                        className={`flex-row items-center justify-between border-2 ${borderColor} ${bgColor} rounded-xl p-3`}>
                        <View className="flex-1 flex-row items-center gap-3">
                          <View
                            className={`h-8 w-8 items-center justify-center rounded-full border-2 bg-white ${circleBorderColor}`}>
                            <Text className={`text-sm font-bold ${circleTextColor}`}>{id}</Text>
                          </View>
                          <Text className={`flex-1 font-medium ${labelColor}`}>{option}</Text>
                        </View>

                        <View className="w-6 items-center">
                          {isCorrect && (
                            <Icon as={Check} size={18} className="text-green-600" strokeWidth={3} />
                          )}
                          {isWrong && (
                            <Icon as={X} size={18} className="text-red-600" strokeWidth={3} />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center gap-4 border-t border-slate-100 bg-white/95 p-6 pt-4">
        <Button variant="secondary" className="h-14 w-14" onPress={onBack}>
          <Icon as={ChevronLeft} size={24} className="text-foreground" />
        </Button>
        <View className="flex-1">
          <Button
            variant="default"
            size="lg"
            className="h-14 w-full"
            disabled={(!allAnswered && !isSubmitted) || isSubmitting}
            onPress={handleSubmit}>
            <View className="flex-row items-center justify-center gap-2">
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : isSubmitted ? (
                <>
                  <Text className="text-lg font-bold text-white">Selesai</Text>
                  <Icon as={Check} size={20} className="text-white" strokeWidth={2.5} />
                </>
              ) : (
                <Text className="text-lg font-bold text-white">Kirim Jawaban</Text>
              )}
            </View>
          </Button>
        </View>
      </View>
    </View>
  );
}
