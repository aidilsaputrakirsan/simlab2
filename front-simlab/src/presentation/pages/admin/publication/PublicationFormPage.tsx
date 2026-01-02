import Header from "@/presentation/components/Header";
import MainContent from "@/presentation/components/MainContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Textarea } from "@/presentation/components/ui/textarea";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";

// Register ImageDrop module for paste/drop support (optional)
try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ImageDrop = require('quill-image-drop-module').ImageDrop;
    Quill.register('modules/imageDrop', ImageDrop);
} catch {
    // Module not available, will fall back to manual handling
}
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useNavigate, useParams } from "react-router-dom";
import { PublicationInputDTO, PublicationUpdateDTO } from "@/application/publication/dto/PublicationDTO";
import { toast } from "sonner";
import { Combobox } from "@/presentation/components/custom/combobox";
import { usePublicationCategorySelect } from "@/presentation/pages/admin/publication-category/hooks/usePublicationCategorySelect";
import { useValidationErrors } from "@/presentation/hooks/useValidationError";
import { PublicationView } from "@/application/publication/PublicationView";

export default function PublicationFormPage() {
    const navigate = useNavigate();
    const params = useParams();
    const id = params.id ? Number(params.id) : undefined;
    const isEdit = !!id;

    const { publicationService } = useDepedencies();
    const { publicationCategories } = usePublicationCategorySelect();
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const quillRef = useRef<any>(null);
    const prevDescRef = useRef<string>("");

    const [formData, setFormData] = useState<PublicationInputDTO>({
        title: "",
        short_description: "",
        description: "",
        publication_category_id: 0,
        writer_id: 0,
        images: null,
    });

    const { errors: vErrors, setErrors: setValidationErrors, processErrors } = useValidationErrors();

    useEffect(() => {
        if (!isEdit) return;
        const fetchPublication = async () => {
            const res = await publicationService.getPublicationById(id!);
            const pub = res.data as PublicationView;
            setFormData({
                title: pub.title,
                short_description: pub.shortDescription,
                description: pub.description,
                publication_category_id: pub.publicationCategoryId,
                writer_id: pub.writerId,
                images: null,
            });
            setImagePreview(pub.imageUrl());
        };
        fetchPublication();
    }, [id, isEdit, publicationService]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, images: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Client-side validate removed; rely on server validation via useValidationErrors

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setValidationErrors({});
        try {
            if (isEdit) {
                const payload: PublicationUpdateDTO = { ...formData };
                const res = await publicationService.updatePublication(id!, payload);
                toast.success(res.message);
            } else {
                const payload: PublicationInputDTO = { ...formData };
                const res = await publicationService.createPublication(payload);
                toast.success(res.message);
            }
            navigate('/panel/publikasi');
        } catch (error: any) {
            // Try map backend validation errors
            if (error?.errors) {
                processErrors(error.errors);
            }
            toast.error(error?.message || "Gagal menyimpan publikasi");
        } finally {
            setIsLoading(false);
        }
    };

    const modules = useMemo(() => ({
        toolbar: [
            [{ font: [] }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["link", "image"],
            ["clean"],
        ],
    }), []);

    const formats = useMemo(() => ([
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "font",
        "size",
        "list",
        "color",
        "background",
        "align",
        "link",
        "image",
    ]), []);

    const handleQuillChange = useCallback((value: string) => {
        if (prevDescRef.current === value) return;
        prevDescRef.current = value;
        setFormData((prev) => ({ ...prev, description: value }));
    }, []);

    // Handle image paste/drop directly as base64
    useEffect(() => {
        if (!quillRef.current) return;
        const quill = quillRef.current.getEditor();

        // Handle drop events for images
        const handleDrop = (e: DragEvent) => {
            const files = e.dataTransfer?.files;
            if (files) {
                for (const file of files) {
                    if (file.type.startsWith('image/')) {
                        e.preventDefault();
                        const reader = new FileReader();
                        reader.onload = (event: any) => {
                            const range = quill.getSelection();
                            quill.insertEmbed(range?.index || 0, 'image', event.target.result);
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
        };

        // Handle paste events for images
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (items) {
                for (const item of items) {
                    if (item.type.startsWith('image/')) {
                        e.preventDefault();
                        const blob = item.getAsFile();
                        if (blob) {
                            const reader = new FileReader();
                            reader.onload = (event: any) => {
                                const range = quill.getSelection();
                                quill.insertEmbed(range?.index || 0, 'image', event.target.result);
                            };
                            reader.readAsDataURL(blob);
                        }
                    }
                }
            }
        };

        quill.root.addEventListener('drop', handleDrop);
        quill.root.addEventListener('paste', handlePaste);

        return () => {
            quill.root.removeEventListener('drop', handleDrop);
            quill.root.removeEventListener('paste', handlePaste);
        };
    }, []);

    return (
        <>
            <Header title={isEdit ? "Edit Publikasi" : "Tambah Publikasi"} />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>{isEdit ? "Edit Publikasi" : "Tambah Publikasi"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul <span className="text-red-500">*</span></Label>
                                    <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Masukkan judul publikasi" />
                                    {vErrors['title'] && (<p className="text-sm text-red-500">{vErrors['title']}</p>)}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="publication_category_id">Kategori <span className="text-red-500">*</span></Label>
                                    <Combobox
                                        options={publicationCategories}
                                        value={formData.publication_category_id?.toString() || ''}
                                        onChange={(val) => setFormData({ ...formData, publication_category_id: val ? parseInt(val) : 0 })}
                                        placeholder="Pilih kategori"
                                        optionLabelKey="name"
                                        optionValueKey="id"
                                    />
                                    {vErrors['publication_category_id'] && (<p className="text-sm text-red-500">{vErrors['publication_category_id']}</p>)}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="short_description">Deskripsi Singkat <span className="text-red-500">*</span></Label>
                                <Textarea id="short_description" value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} placeholder="Masukkan deskripsi singkat (maksimal 500 karakter)" rows={3} maxLength={500} />
                                {vErrors['short_description'] && (<p className="text-sm text-red-500">{vErrors['short_description']}</p>)}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi Lengkap <span className="text-red-500">*</span></Label>
                                <ReactQuill ref={quillRef} theme="snow" value={formData.description} onChange={handleQuillChange} modules={modules} formats={formats} placeholder="Masukkan deskripsi lengkap publikasi..." className="bg-white" />
                                {vErrors['description'] && (<p className="text-sm text-red-500 mt-1">{vErrors['description']}</p>)}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="images">Gambar {!isEdit && <span className="text-red-500">*</span>}</Label>
                                <Input id="images" type="file" accept="image/*" onChange={handleImageChange} />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <img src={imagePreview} alt="Preview" className="h-40 w-auto object-cover rounded border" />
                                    </div>
                                )}
                                {vErrors['images'] && (<p className="text-sm text-red-500">{vErrors['images']}</p>)}
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => navigate('/panel/publikasi')} disabled={isLoading}>Batal</Button>
                                <Button type="submit" disabled={isLoading}>{isLoading ? "Menyimpan..." : "Simpan"}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </MainContent>
        </>
    );
}
