import { IJsonTableProps, JsonToTable } from "@components/JsonToTable/JsonToTable";
import { TableNavigation } from "@components/TableNavigation/TableNavigation";
import { API } from "@lib/api";
import { translateAPIField } from "@globals/globals";
import { CircularProgress } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { IFilters } from "@components/FilterSelectDropdowns/FilterSelectDropdowns";

interface ITableProps {
    page: number;
    setPage: (page: number) => void;
    filters: IFilters;
}

export const TableSection = ({ page, setPage, filters }: ITableProps) => {
    // -------- state --------
    // const [page, setPage] = useState(Number(pageNumber));
    const [perPage, setPerPage] = useState(10);

    // -------- fetching data --------
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['estates', page, perPage, filters],
        queryFn: () => API.fetchData(page, perPage, filters),
    });

    // -------- extracting estates list from the data --------
    let estates: any[] = data?._embedded?.estates || [];
    let totalResults: number | null = data?.result_size;
    let max_page: number | null = useMemo(() => totalResults && Math.ceil(totalResults / perPage), [totalResults, perPage]);

    const dataToDisplay: IJsonTableProps = {
        rows: estates.map((estate) => {
            return {
                "Název": estate.name,
                "Typ": translateAPIField("category_type_cb", estate.seo.category_type_cb),
                "Kategorie": translateAPIField("category_main_cb", estate.seo.category_main_cb),
                "Typ nemovitosti": translateAPIField("category_sub_cb", estate.seo.category_sub_cb),
                "Lokalita": estate.locality,
                "Cena": estate.price,
                "Fotka": estate._links.images[0].href
            }
        })
    }

    // -------- pre-fetching --------
    const queryClient = useQueryClient();

    useEffect(() => {
        const prefetch = (page: number) => {
            queryClient.prefetchQuery({
                queryKey: ['estates', page, perPage, filters],
                queryFn: () => API.fetchData(page, perPage, filters),
            });
        }

        if (!max_page) return;
        if (page < max_page) prefetch(page + 1);
        if (page > 1) prefetch(page - 1);

    }, [page, max_page, queryClient]);

    // -------- page navigation --------

    const goToPreviousPage = () => {
        if (page <= 1) return;
        setPage(page - 1);
    }

    const goToNextPage = () => {
        if (max_page && page >= max_page) return;
        setPage(page + 1);
    }

    // -------- rendering --------
    // if (isLoading) return <div>Loading...</div>;
    // if (isError) return <div>Error loading estates</div>;

    return (
        <section className="table-section">

            {isLoading ? <div className="loading placeholder"><CircularProgress size={30} /></div> :
                isError ? <div className="error placeholder">{error.message}</div> :
                    <div className="table-wrapper">
                        {dataToDisplay.rows.length === 0 ?
                            <div className="no-results">Nenalezeny žádné výsledky</div> :
                            <JsonToTable data={dataToDisplay} />
                        }
                    </div>
            }

            <TableNavigation
                page={page}
                numberOfPages={max_page || 0}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
                onChangePageRange={(event) => setPerPage(event.target.value)}
            />

        </section>
    )
}