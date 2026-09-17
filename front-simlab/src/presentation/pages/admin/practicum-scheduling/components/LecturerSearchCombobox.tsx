import { useEffect, useState } from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { cn } from "@/presentation/lib/utils"
import { Button } from "@/presentation/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/presentation/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/presentation/components/ui/popover"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { userRole } from "@/domain/User/UserRole"
import { UserSelectView } from "@/application/user/UserSelectView"

const LECTURER_ROLES = [
    userRole.Dosen,
    userRole.KepalaLabJurusan,
    userRole.Kooprodi,
    userRole.KepalaLabTerpadu
]
const RESULT_LIMIT = 10
const SEARCH_DEBOUNCE_MS = 300

type LecturerSearchComboboxProps = {
    value: number | null
    onChange: (lecturerId: number) => void
    placeholder?: string
}

export function LecturerSearchCombobox({
    value,
    onChange,
    placeholder = "Pilih Dosen Pengampu"
}: LecturerSearchComboboxProps) {
    const { userService } = useDepedencies()
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [options, setOptions] = useState<UserSelectView[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selected, setSelected] = useState<UserSelectView | null>(null)

    // Nama dosen terpilih (mode edit / duplikat kelas) bisa tidak ada di hasil pencarian, jadi diambil per id
    useEffect(() => {
        if (!value) {
            setSelected(null)
            return
        }
        if (selected?.id === value) return

        let ignore = false
        userService.searchDataForSelect(LECTURER_ROLES, { ids: [value] })
            .then(res => {
                if (!ignore) setSelected(res.data?.[0] ?? null)
            })
            .catch(() => {
                if (!ignore) setSelected(null)
            })

        return () => { ignore = true }
    }, [value, selected?.id, userService])

    useEffect(() => {
        if (!open) return

        let ignore = false
        setIsLoading(true)
        const timer = setTimeout(async () => {
            try {
                const res = await userService.searchDataForSelect(LECTURER_ROLES, {
                    search: search.trim(),
                    limit: RESULT_LIMIT
                })
                if (!ignore) setOptions(res.data ?? [])
            } catch {
                if (!ignore) setOptions([])
            } finally {
                if (!ignore) setIsLoading(false)
            }
        }, SEARCH_DEBOUNCE_MS)

        return () => {
            ignore = true
            clearTimeout(timer)
        }
    }, [open, search, userService])

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (!nextOpen) setSearch("")
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full text-base md:text-sm justify-between font-normal ${selected ? '' : 'text-muted-foreground'}`}
                >
                    {selected?.name || placeholder}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Cari nama atau NIP dosen..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        {isLoading ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">Memuat data dosen...</div>
                        ) : (
                            <>
                                <CommandEmpty>Dosen tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                    {options.map(option => (
                                        <CommandItem
                                            key={option.id}
                                            value={String(option.id)}
                                            onSelect={() => {
                                                setSelected(option)
                                                onChange(option.id)
                                                handleOpenChange(false)
                                            }}
                                            className="flex justify-between"
                                        >
                                            {option.name}
                                            <CheckIcon
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === option.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                                {options.length === RESULT_LIMIT && (
                                    <p className="px-3 py-2 text-xs text-muted-foreground border-t">
                                        Menampilkan {RESULT_LIMIT} data teratas. Ketik nama atau NIP untuk mempersempit pencarian.
                                    </p>
                                )}
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
