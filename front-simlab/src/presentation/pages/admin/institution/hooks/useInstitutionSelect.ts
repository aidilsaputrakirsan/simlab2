import { InstitutionSelectView } from "@/application/institution/InstitutionSelectView"
import { useDepedencies } from "@/presentation/contexts/useDepedencies"
import { useEffect, useState } from "react"

export const useInstitutionSelect = () => {
    const { institutionService } = useDepedencies()
    const [institutions, setInstitutions] = useState<InstitutionSelectView[]>([])
    const [selectedInstitution, setSelectedInstitution] = useState<number>(0)

    useEffect(() => {
        const getInstitution = async () => {
            const response = await institutionService.getDataForSelect()
            setInstitutions(response.data ?? [])
        }

        getInstitution()
    }, [institutionService])

    return {
        institutions,
        selectedInstitution,
        setSelectedInstitution
    }
}