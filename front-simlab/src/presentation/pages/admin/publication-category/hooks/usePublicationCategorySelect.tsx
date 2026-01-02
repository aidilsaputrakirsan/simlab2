import { PublicationCategorySelectView } from "@/application/publication-category/PublicationCategorySelectView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useEffect, useState } from "react"

export const usePublicationCategorySelect = () => {
    const { publicationCategoryService } = useDepedencies()
    const [publicationCategories, setPublicationCategories] = useState<PublicationCategorySelectView[]>([])
    const [selectedPublicationCategory, setSelectedPublicationCategory] = useState<number>(0)

    useEffect(() => {
        const getPublicationCategories = async () => {
            const response = await publicationCategoryService.getDataForSelect()
            setPublicationCategories(response.data || [])
        }

        getPublicationCategories()
    }, [publicationCategoryService])

    return {
        publicationCategories,
        selectedPublicationCategory,
        setSelectedPublicationCategory
    }
}
