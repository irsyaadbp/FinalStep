import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { 
  Flame, 
  Trophy, 
  BookText, 
  Star, 
  Settings, 
  ChevronRight, 
  LogOut,
  Mail,
  Target,
  ShieldCheck
} from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Profile Header Card */}
      <View className="px-6 pt-16 pb-6">
        <Card contentClassName="p-6 items-center">
          <View className="relative mb-4">
            <View className="w-24 h-24 bg-primary rounded-full items-center justify-center">
              <Text className="text-white text-3xl font-bold uppercase">AN</Text>
            </View>
            <View className="absolute bottom-0 right-0 bg-white dark:bg-slate-800 p-1.5 rounded-full border border-border">
              <Icon as={ShieldCheck} size={16} className="text-primary" />
            </View>
          </View>
          
          <Text className="text-2xl font-bold mb-1">Andi Siswa</Text>
          <View className="flex-row items-center gap-2 mb-1">
             <Icon as={Mail} size={14} className="text-muted-foreground" />
             <Text className="text-muted-foreground text-sm">andi@student.com</Text>
          </View>
          <View className="flex-row items-center gap-2 mb-6">
             <Icon as={Target} size={14} className="text-muted-foreground" />
             <Text className="text-muted-foreground text-sm">Target: -</Text>
          </View>

          {/* Level Bar */}
          <View className="w-full">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-bold">Level 1</Text>
              <View className="flex-row items-center">
                <Icon as={Flame} size={14} className="text-orange-500 mr-1" />
                <Text className="text-orange-500 font-bold">0 XP</Text>
              </View>
            </View>
            <View className="h-3 bg-secondary rounded-full overflow-hidden mb-2">
              <View className="h-full bg-slate-200 w-[10%]" />
            </View>
            <Text className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">
              100 XP ke Level 2
            </Text>
          </View>
        </Card>
      </View>

      {/* Stats Grid */}
      <View className="px-6 flex-row flex-wrap justify-between mb-8">
        <StatItem icon={Flame} value="0" label="Streak" color="text-orange-500" bgColor="bg-orange-50" className="w-[48%] mb-4" />
        <StatItem icon={Trophy} value="Lv.1" label="Level" color="text-blue-500" bgColor="bg-blue-50" className="w-[48%] mb-4" />
        <StatItem icon={BookText} value="0" label="Bab" color="text-purple-500" bgColor="bg-purple-50" className="w-[48%]" />
        <StatItem icon={Star} value="0%" label="Progres" color="text-yellow-500" bgColor="bg-yellow-50" className="w-[48%]" />
      </View>

      {/* Menu List */}
      <View className="px-6 mb-8">
        <Card contentClassName="overflow-hidden">
          <MenuItem 
            icon={BookText} 
            title="Pelajaran Saya" 
            subtitle="0 mata pelajaran" 
            onPress={() => {}} 
          />
          <View className="h-[1px] bg-border mx-6" />
          <MenuItem 
            icon={Settings} 
            title="Pengaturan" 
            subtitle="Profil & preferensi" 
            onPress={() => {}} 
          />
        </Card>
      </View>

      {/* Logout Button */}
      <View className="px-6">
        <Button 
          variant="destructive" 
          size="lg" 
          className="h-16"
          onPress={() => {}}
        >
          <View className="flex-row items-center gap-3">
            <Icon as={LogOut} size={20} className="text-white" />
            <Text>Keluar dari Akun</Text>
          </View>
        </Button>
      </View>
    </ScrollView>
  );
}

function StatItem({ icon, value, label, color, bgColor, className }: { icon: any, value: string, label: string, color: string, bgColor: string, className?: string }) {
  return (
    <Card className={cn("mx-0", className)} contentClassName="p-4 items-center">
      <View className={`p-2 rounded-xl mb-3 ${bgColor}`}>
        <Icon as={icon} size={20} className={color} />
      </View>
      <Text className="font-bold text-lg">{value}</Text>
      <Text className="text-[10px] text-muted-foreground uppercase text-center">{label}</Text>
    </Card>
  );
}

function MenuItem({ icon, title, subtitle, onPress }: { icon: any, title: string, subtitle: string, onPress: () => void }) {
  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-row items-center p-6"
    >
      <View className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl mr-4">
        <Icon as={icon} size={22} className="text-muted-foreground" />
      </View>
      <View className="flex-1">
        <Text className="font-bold text-base">{title}</Text>
        <Text className="text-xs text-muted-foreground">{subtitle}</Text>
      </View>
      <Icon as={ChevronRight} size={18} className="text-slate-300" />
    </TouchableOpacity>
  );
}
