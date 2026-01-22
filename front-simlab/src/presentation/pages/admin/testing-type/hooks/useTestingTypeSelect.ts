import { TestingTypeSelectView } from "@/application/testing-type/TestingTypeSelectView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useEffect, useState } from "react"

export const useTestingTypeSelect = () => {
    const { testingTypeService } = useDepedencies()
    const [testingTypes, setTestingTypes] = useState<TestingTypeSelectView[]>([])
    const [selectedTestingType, setSelectedTestingType] = useState<number>(0)

    useEffect(() => {
        const getTestingTypes = async () => {
            const response = await testingTypeService.getDataForSelect()
            setTestingTypes(response.data ?? [])
        }

        getTestingTypes()
    }, [testingTypeService])

    return {
        testingTypes,
        selectedTestingType,
        setSelectedTestingType
    }
}