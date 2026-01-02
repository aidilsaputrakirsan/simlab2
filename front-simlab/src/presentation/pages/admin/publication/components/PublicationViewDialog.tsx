import { useState } from "react";
import { PublicationView } from "@/application/publication/PublicationView";
import { Button } from "@/presentation/components/ui/button";
import { Eye } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";

type PublicationViewDialogProps = {
    publication: PublicationView;
};

export const PublicationViewDialog = ({ publication }: PublicationViewDialogProps) => {
    const [viewOpen, setViewOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewOpen(true)}
            >
                <Eye className="h-4 w-4" />
            </Button>

            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>{publication.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <img
                            src={publication.imageUrl()}
                            alt={publication.title}
                            className="w-full h-64 object-cover rounded"
                        />
                        <div>
                            <h4 className="font-semibold mb-2">Deskripsi Singkat</h4>
                            <p className="text-gray-700">{publication.shortDescription}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Deskripsi Lengkap</h4>
                            <div
                                className="prose"
                                dangerouslySetInnerHTML={{ __html: publication.description }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-semibold">Kategori:</span> {publication.publicationCategoryName}
                            </div>
                            <div>
                                <span className="font-semibold">Penulis:</span> {publication.writerName}
                            </div>
                            <div>
                                <span className="font-semibold">Tanggal:</span> {publication.formattedDate}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
