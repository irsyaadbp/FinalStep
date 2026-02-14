import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ChevronLeft, ClipboardList, Clock, Check } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, TouchableOpacity, ActivityIndicator } from 'react-native';

import { finalExamService } from '@/services/final-exam';
import { FinalExam } from '@/lib/types';

interface FinalExamViewProps {
  exam: FinalExam;
  subjectSlug: string;
  onComplete: () => void;
  onBack: () => void;
}

export function FinalExamView({ exam, subjectSlug, onComplete, onBack }: FinalExamViewProps) {
  const [timeLeft, setTimeLeft] = React.useState(exam.duration * 60);
  const [selectedOptions, setSelectedOptions] = React.useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [passed, setPassed] = React.useState(false);
  const [score, setScore] = React.useState(0);

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

  const handleSubmit = async () => {
    if (isSubmitted) {
      if (passed) {
        onComplete();
      } else {
        // Retry logic
        setIsSubmitted(false);
        setPassed(false);
        setScore(0);
        setSelectedOptions([]);
        setTimeLeft(exam.duration * 60);
      }
      return;
    }

    setIsSubmitting(true);

    // Calculate score
    let correctCount = 0;
    exam.questions.forEach((q, index) => {
      if (selectedOptions[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalQuestions = exam.questions.length;
    const isPassed = correctCount >= Math.ceil(totalQuestions * 0.6);

    setTimeout(() => {
      setScore(correctCount);
      setPassed(isPassed);
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 500);
  };

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedOptions((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
  };

  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between px-6 pb-4 pt-4">
        {/* Top Timer - Mobile specific placement if needed, or keep in header */}
        {/* We'll rely on the main screen header for title, but we can put timer here */}
        <View className="ml-auto flex-row items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-2">
          <Icon as={Clock} size={16} className="text-orange-500" />
          <Text className="font-extrabold text-orange-500">{formatTime(timeLeft)}</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}>
        {/* Main Assessment Card */}
        <Card className="mb-8 mt-4" contentClassName="p-6">
          {/* Exam Info Header */}
          <View className="mb-8 flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <View className="rounded-2xl bg-primary/10 p-3">
                <Icon as={ClipboardList} size={24} className="text-primary" />
              </View>
              <View>
                <Text className="text-lg font-bold">{exam.title}</Text>
                <Text className="text-sm text-muted-foreground">
                  Total {exam.questions.length} Soal
                </Text>
              </View>
            </View>
          </View>

          {isSubmitted && (
            <View
              className={`mb-6 rounded-xl border-2 p-4 ${passed ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
              <Text
                className={`mb-1 text-center text-lg font-bold ${passed ? 'text-green-700' : 'text-red-700'}`}>
                {passed ? '🎉 Selamat! Kamu Lulus' : '❌ Belum Lulus'}
              </Text>
              <Text className={`text-center ${passed ? 'text-green-600' : 'text-red-600'}`}>
                Skor: {score}/{exam.questions.length} (
                {Math.round((score / exam.questions.length) * 100)}%)
              </Text>
              {!passed && (
                <Text className="mt-2 text-center text-xs text-red-500">
                  Butuh minimal {Math.ceil(exam.questions.length * 0.6)} benar untuk lulus via Ujian
                  Akhir logic.
                </Text>
              )}
            </View>
          )}

          {/* Question List */}
          <View className="gap-8">
            {exam.questions.map((q, qIdx) => (
              <View key={qIdx} className="rounded-lg border-2 border-border p-2">
                <View className="p-4">
                  <Text className="mb-8 text-xl font-bold leading-tight text-slate-900">
                    {qIdx + 1}. {q.question}
                  </Text>

                  <View className="gap-4">
                    {q.options.map((option, oIdx) => {
                      const id = String.fromCharCode(65 + oIdx);
                      const isSelected = selectedOptions[qIdx] === oIdx;
                      const isCorrect = isSubmitted && oIdx === q.correctAnswer;
                      const isWrong = isSubmitted && isSelected && oIdx !== q.correctAnswer;

                      let borderColor = 'border-slate-100';
                      let bgColor = 'bg-white';
                      let circleBorderColor = 'border-slate-200';
                      let circleTextColor = 'text-slate-900';

                      if (isCorrect) {
                        borderColor = 'border-green-500';
                        bgColor = 'bg-green-50/50';
                        circleBorderColor = 'border-green-500';
                        circleTextColor = 'text-green-600';
                      } else if (isWrong) {
                        borderColor = 'border-red-500';
                        bgColor = 'bg-red-50/50';
                        circleBorderColor = 'border-red-500';
                        circleTextColor = 'text-red-600';
                      } else if (isSelected) {
                        borderColor = 'border-primary';
                        bgColor = 'bg-primary/5';
                        circleBorderColor = 'border-primary';
                        circleTextColor = 'text-primary';
                      }

                      let textColor =
                        isSelected || isCorrect || isWrong ? 'text-slate-900' : 'text-slate-500';
                      if (isCorrect) textColor = 'text-green-700';
                      if (isWrong) textColor = 'text-red-700';

                      return (
                        <TouchableOpacity
                          key={oIdx}
                          disabled={isSubmitted}
                          onPress={() => handleOptionSelect(qIdx, oIdx)}
                          className={`flex-row items-center border-2 ${borderColor} ${bgColor} h-[72px] rounded-2xl p-4`}>
                          <View
                            className={`h-10 w-10 items-center justify-center rounded-full border-2 bg-white ${circleBorderColor} mr-4`}>
                            <Text className={`text-lg font-bold ${circleTextColor}`}>{id}</Text>
                          </View>
                          <Text className={`flex-1 text-lg font-bold ${textColor}`}>{option}</Text>

                          <View className="w-6 items-center">
                            {isCorrect && (
                              <Icon
                                as={Check}
                                size={20}
                                className="text-green-600"
                                strokeWidth={3}
                              />
                            )}
                            {/* X icon not imported, but clear enough with colors */}
                          </View>
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
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center gap-4 border-t border-slate-100 bg-white/95 p-6 pt-4">
        <Button variant="secondary" className="h-14 w-14" onPress={onBack}>
          <Icon as={ChevronLeft} size={24} className="text-foreground" />
        </Button>
        <View className="flex-[1.5]">
          <Button
            variant="default"
            size="lg"
            className="h-14 w-full"
            disabled={
              (selectedOptions.filter((o) => o !== undefined).length !== exam.questions.length &&
                !isSubmitted) ||
              isSubmitting
            }
            onPress={handleSubmit}>
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : isSubmitted ? (
              <Text className="text-lg font-bold text-white">
                {passed ? 'Selesai' : 'Coba Lagi'}
              </Text>
            ) : (
              <Text className="text-lg font-bold text-white">Kirim Jawaban</Text>
            )}
          </Button>
        </View>
      </View>
    </View>
  );
}
