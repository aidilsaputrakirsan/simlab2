import * as React from 'react';
import { Calendar } from '@/presentation/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/presentation/components/ui/popover';
import { Button } from '@/presentation/components/ui/button';
import { CalendarClock } from 'lucide-react';
import { cn } from '@/presentation/lib/utils';

// Definisi sesi praktikum
const PRACTICUM_SESSIONS = [
  { id: '1', label: 'Sesi 1', startTime: '07:30', endTime: '10:00' },
  { id: '2', label: 'Sesi 2', startTime: '10:20', endTime: '12:00' },
  { id: '3', label: 'Sesi 3', startTime: '13:00', endTime: '15:30' },
  { id: '4', label: 'Sesi 4', startTime: '15:50', endTime: '17:30' },
];

interface DateTimePickerProps {
  value?: { date?: Date; startTime?: string; endTime?: string };
  onChange: (val: { date?: Date; startTime?: string; endTime?: string }) => void;
  placeholder?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange, placeholder }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value?.date);
  const [startTime, setStartTime] = React.useState<string>(value?.startTime || '07:30');
  const [endTime, setEndTime] = React.useState<string>(value?.endTime || '10:00');
  const [selectedSession, setSelectedSession] = React.useState<string | null>(null);

  // Fungsi untuk mendeteksi sesi berdasarkan waktu
  const detectSession = (start: string, end: string): string | null => {
    const session = PRACTICUM_SESSIONS.find(s => s.startTime === start && s.endTime === end);
    return session?.id || null;
  };

  React.useEffect(() => {
    if (value?.date) setSelectedDate(value.date); else setSelectedDate(undefined);
    if (value?.startTime) setStartTime(value.startTime);
    if (value?.endTime) setEndTime(value.endTime);
    if (value?.startTime && value?.endTime) {
      setSelectedSession(detectSession(value.startTime, value.endTime));
    }
  }, [value]);

  const handleDateSelect = (date?: Date) => {
    if (!date) return;
    setSelectedDate(date);
    onChange({ date, startTime, endTime });
  };

  const handleSessionSelect = (sessionId: string) => {
    const session = PRACTICUM_SESSIONS.find(s => s.id === sessionId);
    if (!session) return;

    setSelectedSession(sessionId);
    setStartTime(session.startTime);
    setEndTime(session.endTime);
    onChange({ date: selectedDate, startTime: session.startTime, endTime: session.endTime });
  };

  // Mendapatkan label sesi yang dipilih
  const getSessionLabel = (): string | null => {
    const session = PRACTICUM_SESSIONS.find(s => s.id === selectedSession);
    return session ? `${session.label} (${session.startTime} - ${session.endTime})` : null;
  };

  return (
    <div className="flex gap-2 items-center w-full">
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          {selectedDate ? (
            <Button type="button" className='w-full font-normal' variant="outline" onClick={() => setOpen(true)}>
              {selectedDate.toLocaleDateString() + (getSessionLabel() ? ` - ${getSessionLabel()}` : ` (${startTime} - ${endTime})`)}
            </Button>
          ) : (
            <Button type="button" className='w-full text-muted-foreground font-normal' variant="outline" onClick={() => setOpen(true)}>
              <CalendarClock/>
              {(placeholder || 'Pilih Tanggal & Waktu')}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 flex flex-col gap-3">
          <Calendar
            className='p-0'
            mode="single"
            selected={selectedDate}
            onSelect={date => handleDateSelect(date)}
          />
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs font-semibold">Pilih Sesi Praktikum</label>
            <div className="grid grid-cols-2 gap-2">
              {PRACTICUM_SESSIONS.map((session) => (
                <Button
                  key={session.id}
                  type="button"
                  variant={selectedSession === session.id ? "default" : "outline"}
                  className={cn(
                    "flex flex-col h-auto py-2 px-3",
                    selectedSession === session.id && "ring-2 ring-primary"
                  )}
                  onClick={() => handleSessionSelect(session.id)}
                >
                  <span className="font-semibold">{session.label}</span>
                  <span className="text-xs opacity-80">{session.startTime} - {session.endTime}</span>
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
