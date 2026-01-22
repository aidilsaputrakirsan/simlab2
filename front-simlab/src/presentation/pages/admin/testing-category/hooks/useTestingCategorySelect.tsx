import { TestingCategoryView } from "@/application/testing-category/TestingCategoryView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useEffect, useState } from "react"

export const useTestingCategorySelect = () => {
    const { testingCategoryService } = useDepedencies()
    const [testingCategories, setTestingCategories] = useState<TestingCategoryView[]>([])
    const [selectedTestingCategory, setSelectedTestingCategory] = useState<number>(0)

    useEffect(() => {
        const getTestingCategories = async () => {
            const response = await testingCategoryService.getDataForSelect()
            setTestingCategories(response.data || [])
        }

        getTestingCategories()
    }, [testingCategoryService])

    return {
        testingCategories,
        selectedTestingCategory,
        setSelectedTestingCategory
    }
}