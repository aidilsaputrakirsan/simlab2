import { useEffect, useState } from "react"
import Table from "../../../components/Table";
import Header from "@/presentation/components/Header";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import ConfirmationDialog from "@/presentation/components/custom/ConfirmationDialog";
import MainContent from "@/presentation/components/MainContent";
import { PublicationCategoryColumn } from "./PublicationCategoryColumn";
import PublicationCategoryFormDialog from "./components/PublicationCategoryFormDialog";
import { usePublicationCategoryDataTable } from "./hooks/usePublicationCategoryDataTable";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import { PublicationCategoryInputDTO } from "@/application/publication-category/PublicationCategoryDTO";
import { PublicationCategoryView } from "@/application/publication-category/PublicationCategoryView";

const PublicationCategoryPage = () => {
	const { publicationCategoryService } = useDepedencies()
	const {
		publicationCategories,
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
		setCurrentPage
	} = usePublicationCategoryDataTable()

	useEffect(() => {
		setCurrentPage(1)
	}, [])

	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [selectedCategory, setSelectedCategory] = useState<PublicationCategoryView | undefined>(undefined)
	const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

	const isEdit = !!selectedCategory

	const openAdd = () => {
		setSelectedCategory(undefined)
		setIsOpen(true)
	}

	const openEdit = (category: PublicationCategoryView) => {
		setSelectedCategory(category)
		setIsOpen(true)
	}

	const openConfirm = (category: PublicationCategoryView) => {
		setSelectedCategory(category)
		setConfirmOpen(true)
	}

	const handleSave = async (formData: PublicationCategoryInputDTO): Promise<void> => {
		const res = selectedCategory
			? await publicationCategoryService.updateData(selectedCategory.id, formData)
			: await publicationCategoryService.createData(formData)
        
		toast.success(res.message)
		refresh()
		setIsOpen(false)
	}

	const handleDelete = async () => {
		if (!selectedCategory) return
		const res = await publicationCategoryService.deleteData(selectedCategory.id)
		toast.success(res.message)

		refresh()
		setConfirmOpen(false)
	}

	return (
		<>
			<Header title="Menu Kategori Publikasi" />
			<MainContent>
				<Card>
					<CardHeader>
						<CardTitle>Menu Kategori Publikasi</CardTitle>
						<CardAction>
							<Button variant={"default"} onClick={() => openAdd()}>
								Tambah
								<Plus />
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent>
						<Table
							data={publicationCategories}
							columns={PublicationCategoryColumn({ openModal: openEdit, openConfirm })}
							loading={isLoading}
							searchTerm={searchTerm}
							handleSearch={(e) => handleSearch(e)}
							perPage={perPage}
							handlePerPageChange={(e) => handlePerPageChange(e)}
							totalPages={totalPages}
							totalItems={totalItems}
							currentPage={currentPage}
							handlePageChange={handlePageChange}
							handleRefresh={refresh} />
					</CardContent>
				</Card>
			</MainContent>
			<ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} onConfirm={handleDelete} />
			<PublicationCategoryFormDialog
				open={isOpen}
				onOpenChange={setIsOpen}
				category={selectedCategory}
				handleSave={handleSave}
				title={!isEdit ? 'Tambah kategori publikasi' : 'Edit kategori publikasi'}
			/>
		</>
	)
}

export default PublicationCategoryPage
