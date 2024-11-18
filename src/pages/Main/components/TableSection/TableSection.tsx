import { IJsonTableProp, JsonToTable } from "@components/JsonToTable/JsonToTable";
import { TableNavigation } from "@components/TableNavigation/TableNavigation";
import { IFilters } from "@components/FilterSelectDropdowns/FilterSelectDropdowns";
import { formatDataForTable, formatDataToAPI, IEstate } from "@globals/globals";
import { API } from "@lib/api";
import { CircularProgress } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";

interface ITableProps {
    page: number;
    setPage: (page: number) => void;
    filters: IFilters;
}

export const TableSection = ({ page, setPage, filters }: ITableProps) => {
    // -------- state --------
    const [perPage, setPerPage] = useState(10);
    const [localUpdates, setLocalUpdates] = useState<IEstate[]>([]);

    // -------- onUpdate function --------
    const onUpdate = (newData: IJsonTableProp, estate: IEstate) => {
        const updatedEstate = formatDataToAPI(newData, estate);
        setLocalUpdates((prev) => {
            const index = prev.findIndex((update) => update.hash_id === estate.hash_id);
            return index === -1 ? [...prev, updatedEstate] : prev.map((update, i) => i === index ? updatedEstate : update);
        });
    };

    // -------- fetching data --------
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['estates', page, perPage, filters],
        queryFn: () => API.fetchEstates(page, perPage, filters),
    });

    // -------- combining local updates with API data --------
    const estates = useMemo(() => {
        return (data?._embedded?.estates || []).map((estate: IEstate) => {
            const localUpdate = localUpdates.find((update) => update.hash_id === estate.hash_id);
            return localUpdate || estate;
        });
    }, [data, localUpdates]);

    // -------- pagination --------
    const totalResults = data?.result_size;
    const maxPage = useMemo(() => totalResults ? Math.ceil(totalResults / perPage) : 1, [totalResults, perPage]);
    const dataToDisplay = formatDataForTable(estates, onUpdate);

    // -------- pre-fetching --------
    const queryClient = useQueryClient();
    useEffect(() => {
        if (!maxPage) return;

        const prefetch = (page: number) => {
            queryClient.prefetchQuery({
                queryKey: ['estates', page, perPage, filters],
                queryFn: () => API.fetchEstates(page, perPage, filters),
            });
        };

        if (page < maxPage) prefetch(page + 1);
        if (page > 1) prefetch(page - 1);
    }, [page, maxPage, perPage, filters, queryClient]);

    // -------- page navigation functions --------
    const goToPreviousPage = () => page > 1 && setPage(page - 1);
    const goToNextPage = () => maxPage && page < maxPage && setPage(page + 1);

    // -------- rendering --------
    if (isLoading) return <div className="loading placeholder"><CircularProgress size={30} /></div>;
    if (isError) return <div className="error placeholder">{error.message}</div>;

    return (
        <section className="table-section">
            <div className="table-wrapper">
                {dataToDisplay.rows.length === 0 ? (
                    <div className="no-results">Nenalezeny žádné výsledky</div>
                ) : (
                    <JsonToTable data={dataToDisplay} />
                )}
            </div>

            <TableNavigation
                page={page}
                numberOfPages={maxPage || 0}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                onChangePageRange={(event) => setPerPage(event.target.value)}
            />
        </section>
    );
};
