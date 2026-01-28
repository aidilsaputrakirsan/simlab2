import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { PublicationView } from "@/application/publication/PublicationView";
import { PublicationInputDTO } from "@/application/publication/dto/PublicationDTO";
import { Textarea } from "@/presentation/components/ui/textarea";
import { usePublicationCategorySelect } from "@/presentation/pages/admin/publication-category/hooks/usePublicationCategorySelect";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/presentation/components/ui/select";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { UserSelectView } from "@/application/user/UserSelectView";
import { userRole } from "@/domain/User/UserRole";

type PublicationFormDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: PublicationInputDTO) => Promise<void>;
    publicationData?: PublicationView;
};

const PublicationFormDialog = ({
    isOpen,
    onClose,
    onSave,
    publicationData,
}: PublicationFormDialogProps) => {
    const { userService } = useDepedencies();
    const { publicationCategories } = usePublicationCategorySelect();
    const [users, setUsers] = useState<UserSelectView[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            // Fetch all users - will get all roles
            const response = await userService.getDataForSelect(userRole.Dosen);
            setUsers(response.data ?? []);
        };
        fetchUsers();
    }, [userService]);

    const [formData, setFormData] = useState<PublicationInputDTO>({
        title: "",
        short_description: "",
        description: "",
        publication_category_id: 0,
        writer_id: 0,
        images: null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (publicationData) {
            setFormData({
                title: publicationData.title,
                short_description: publicationData.shortDescription,
                description: publicationData.description,
                publication_category_id: publicationData.publicationCategoryId,
                writer_id: publicationData.writerId,
                images: null,
            });
            setImagePreview(publicationData.imageUrl);
        } else {
            resetForm();
        }
    }, [publicationData, isOpen]);

    const resetForm = () => {
        setFormData({
            title: "",
            short_description: "",
            description: "",
            publication_category_id: 0,
            writer_id: 0,
            images: null,
        });
        setImagePreview(null);
        setErrors({});
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, images: file });

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            await onSave(formData);
            resetForm();
            onClose();
        } catch (error) {
            console.error("Error saving publication:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["link"],
            ["clean"],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "color",
        "background",
        "align",
        "link",
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {publicationData ? "Edit Publikasi" : "Tambah Publikasi"}
                    </DialogTitle>
                    <DialogDescription>
                        {publicationData
                            ? "Ubah data publikasi di bawah ini"
                            : "Isi form di bawah ini untuk menambah publikasi baru"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Judul <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                placeholder="Masukkan judul publikasi"
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="publication_category_id">
                                Kategori <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.publication_category_id?.toString()}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        publication_category_id: parseInt(value),
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {publicationCategories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id.toString()}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.publication_category_id && (
                                <p className="text-sm text-red-500">
                                    {errors.publication_category_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="writer_id">
                            Penulis <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.writer_id?.toString()}
                            onValueChange={(value) =>
                                setFormData({
                                    ...formData,
                                    writer_id: parseInt(value),
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih penulis" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.writer_id && (
                            <p className="text-sm text-red-500">{errors.writer_id}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="short_description">
                            Deskripsi Singkat <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="short_description"
                            value={formData.short_description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    short_description: e.target.value,
                                })
                            }
                            placeholder="Masukkan deskripsi singkat (maksimal 500 karakter)"
                            rows={3}
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500">
                            {formData.short_description.length}/500 karakter
                        </p>
                        {errors.short_description && (
                            <p className="text-sm text-red-500">
                                {errors.short_description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Deskripsi Lengkap <span className="text-red-500">*</span>
                        </Label>
                        <ReactQuill
                            theme="snow"
                            value={formData.description}
                            onChange={(value) =>
                                setFormData({ ...formData, description: value })
                            }
                            modules={modules}
                            formats={formats}
                            placeholder="Masukkan deskripsi lengkap publikasi..."
                            className="bg-white"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="images">
                            Gambar {!publicationData && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                            id="images"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-40 w-auto object-cover rounded border"
                                />
                            </div>
                        )}
                        {errors.images && (
                            <p className="text-sm text-red-500">{errors.images}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PublicationFormDialog;
