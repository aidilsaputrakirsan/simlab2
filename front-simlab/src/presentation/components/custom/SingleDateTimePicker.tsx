import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/presentation/components/ui/button"
import { Calendar } from "@/presentation/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/presentation/components/ui/popover"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';


type BookingDateTimeRangePickerProps = {
    onChange: (e: { target: { name: string; value: Date } }) => void;
    name: string
    current_time?: Date;
};

export default function SingleDatetimePicker({
    onChange,
    name,
    current_time,
}: BookingDateTimeRangePickerProps) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>();

    const [time, setTime] = useState(
        current_time ? current_time.toTimeString().slice(0, 8) : "08:00:00"
    );

    // helper arrays for select controls
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    const parseTime = (t: string) => {
        const [h = "0", m = "0", s = "0"] = t.split(":");
        return { h: Number(h), m: Number(m), s: Number(s) };
    };

    const pad = (n: number) => n.toString().padStart(2, "0");

    const handleTimeChange = (h: number, m: number) => {
        const newTime = `${pad(h)}:${pad(m)}:00`;
        setTime(newTime);
    };

    useEffect(() => {
        if (date) {
            const [sh, sm, ss] = time.split(":").map(Number);
            const newDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                sh, sm, ss
            );
            onChange({ target: { name: name, value: newDate } });
        }
    }, [date, time]);

    return (
        <div className="flex flex-col gap-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    {date? (
                        <Button variant="outline" className="text-base md:text-sm justify-between font-normal">
                            {`${date.toLocaleDateString()} ${time.slice(0, 5)}`}
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button variant="outline" className="text-base md:text-sm justify-between font-normal text-muted-foreground">
                            Pilih Tanggal & Waktu
                            <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4 flex flex-col gap-3" align="start">
                    <Calendar
                        className="p-0"
                        mode="single"
                        selected={date}
                        onSelect={(value) =>
                            setDate(value ?? date)
                        }
                        numberOfMonths={1}
                        captionLayout="dropdown"
                    />
                    <div className="flex flex-col gap-4 mt-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold mb-1">Waktu Mulai</label>
                            <div className="flex gap-2 items-center">
                                <Select value={parseTime(time).h.toString()} onValueChange={val => handleTimeChange(Number(val), parseTime(time).m)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Jam" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hours.map(h => (
                                            <SelectItem key={h} value={h.toString()}>{h.toString().padStart(2, "0")}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <span>:</span>
                                <Select value={parseTime(time).m.toString()} onValueChange={val => handleTimeChange(parseTime(time).h, Number(val))}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Menit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {minutes.map(m => (
                                            <SelectItem key={m} value={m.toString()}>{m.toString().padStart(2, "0")}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

