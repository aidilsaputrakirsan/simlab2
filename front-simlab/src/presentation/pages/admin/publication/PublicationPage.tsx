import { useState } from "react";
import Table from "../../../components/Table";
import Header from "@/presentation/components/Header";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import MainContent from "@/presentation/components/MainContent";
import { PublicationColumn } from "./PublicationColumn";
import { usePublicationDataTable } from "./hooks/usePublicationDataTable";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { useNavigate } from "react-router-dom";
import { PublicationView } from "@/application/publication/PublicationView";

const PublicationPage = () => {
    const { publicationService } = useDepedencies();
    const navigate = useNavigate();
    const {
        publications,
        isLoading,
        searchTerm,
        refresh,

        // TableHandler
        perPage,
        handleSearch,
        handlePageChange,
        handlePerPageChange,
        totalItems,
        totalPages,
        currentPage,
    } = usePublicationDataTable();

    const [selectedPublication, setSelectedPublication] = useState<
        PublicationView | undefined
    >(undefined);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

    const openAdd = () => {
        setSelectedPublication(undefined);
        navigate('/panel/publikasi/create');
    };

    const openEdit = (publication: PublicationView) => {
        setSelectedPublication(publication);
        navigate(`/panel/publikasi/${publication.id}/edit`);
    };

    const openConfirm = (publication: PublicationView) => {
        setSelectedPublication(publication);
        setConfirmOpen(true);
    };

    // Save handled in form page now

    const handleDelete = async () => {
        if (!selectedPublication) return;
        const res = await publicationService.deletePublication(selectedPublication.id);
        toast.success(res.message);

        refresh();
        setConfirmOpen(false);
    };

    return (
        <>
            <Header title="Menu Publikasi" />
            <MainContent>
                <Card>
                    <CardHeader>
                        <CardTitle>Menu Publikasi</CardTitle>
                        <CardAction>
                            <Button variant={"default"} onClick={() => openAdd()}>
                                Tambah
                                <Plus />
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table
                            data={publications}
                            columns={PublicationColumn({ openModal: openEdit, openConfirm })}
                            loading={isLoading}
                            searchTerm={searchTerm}
                            handleSearch={(e) => handleSearch(e)}
                            currentPage={currentPage}
                            perPage={perPage}
                            totalItems={totalItems}
                            totalPages={totalPages}
                            handlePageChange={handlePageChange}
                            handlePerPageChange={(e) => handlePerPageChange(e)}
                        />
                    </CardContent>
                </Card>
            </MainContent>

            {/* Form moved to separate routes: /panel/publikasi/create and /panel/publikasi/:id/edit */}

            <ConfirmationDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                onConfirm={handleDelete}
                title="Hapus Publikasi"
                message={`Apakah Anda yakin ingin menghapus publikasi "${selectedPublication?.title}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmVariant="destructive"
            />
        </>
    );
};

export default PublicationPage;
