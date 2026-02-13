import { useState } from 'react';
import { Settings as SettingsIcon, CalendarDays, Target, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Calendar } from '../../../components/ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/Popover';
import { cn } from '../../../lib/utils';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { useToast } from '../../../hooks/useToast';
import { settings as initialSettings } from '../data';

const SettingsPage = () => {
  const { toast } = useToast();

  const [examDate, setExamDate] = useState(initialSettings.examDate);
  const [targetThreshold, setTargetThreshold] = useState(initialSettings.targetThreshold);

  const [localExamDate, setLocalExamDate] = useState<Date>(parseISO(examDate));
  const [localThreshold, setLocalThreshold] = useState(targetThreshold);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleSave = () => {
    const formattedDate = format(localExamDate, 'yyyy-MM-dd');
    setExamDate(formattedDate);
    setTargetThreshold(localThreshold);
    toast({
      title: 'Pengaturan disimpan',
      description: 'Konfigurasi berhasil diperbarui.',
    });
  };

  const hasChanges =
    format(localExamDate, 'yyyy-MM-dd') !== examDate || localThreshold !== targetThreshold;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-primary" />
          Pengaturan
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Konfigurasi aplikasi pembelajaran</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Exam Date */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarDays className="h-5 w-5 text-primary" />
              Hari Ujian
            </CardTitle>
            <CardDescription>Tanggal ujian nasional yang menjadi target siswa</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !localExamDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {localExamDate
                    ? format(localExamDate, 'EEEE, d MMMM yyyy', { locale: localeId })
                    : 'Pilih tanggal'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={localExamDate}
                  onSelect={(date) => {
                    if (date) {
                      setLocalExamDate(date);
                      setCalendarOpen(false);
                    }
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn('p-3 pointer-events-auto')}
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        {/* Threshold Target */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-primary" />
              Threshold Target
            </CardTitle>
            <CardDescription>
              Persentase minimum progres yang harus dicapai siswa agar dianggap "on track"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="threshold">Target (%)</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="threshold"
                  type="number"
                  min={0}
                  max={100}
                  value={localThreshold}
                  onChange={(e) => setLocalThreshold(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">dari 100%</span>
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                Siswa dengan progres di bawah <span className="font-semibold text-foreground">{localThreshold}%</span> akan ditandai sebagai "perlu perhatian".
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!hasChanges} className="gap-2">
          <Save className="h-4 w-4" />
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
