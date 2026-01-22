import { useState, useEffect, useCallback } from "react";
import { PublicationView } from "@/application/publication/PublicationView";
import { useDepedencies } from "@/presentation/contexts/useDepedencies";
import useTable from "@/application/hooks/useTable";
import { useDebounce } from "@/presentation/hooks/useDebounce";

export const usePublicationDataTable = () => {
    const { publicationService } = useDepedencies();
    const [publications, setPublications] = useState<PublicationView[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const table = useTable()
    const {
        currentPage,
        perPage,
        searchTerm,
        
        setTotalPages,
        setTotalItems,
        setCurrentPage,
    } = table
    const debounceSearchTerm = useDebounce(searchTerm, 500)
    
    const getData = useCallback(async () => {
        setIsLoading(true);
        const response = await publicationService.getPublications({
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
            // publication_category_id: categoryFilter,
        });

        setPublications(response.data ?? []);
        setTotalItems(response.total ?? 0);
        setTotalPages(response.last_page ?? 0);
        setIsLoading(false);
    }, [publicationService, currentPage, perPage, searchTerm]);

    useEffect(() => {
        getData();
    }, [getData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debounceSearchTerm]);

    const refresh = useCallback(() => {
        getData()
    }, [getData])

    return {
        ...table,
        isLoading,
        publications,
        refresh
    };
};
