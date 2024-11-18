import { IJsonTableProp, IJsonTableProps, JsonToTable } from "@components/JsonToTable/JsonToTable";
import { TableNavigation } from "@components/TableNavigation/TableNavigation";
import { API } from "@lib/api";
import { formatCurrency, IEstate, translateAPIField, translateAPIFieldReverse } from "@globals/globals";
import { CircularProgress } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { IFilters } from "@components/FilterSelectDropdowns/FilterSelectDropdowns";
import UpdateButton from "@/components/UpdateButton/UpdateButton";
import { Link } from "react-router-dom";

interface ITableProps {
    page: number;
    setPage: (page: number) => void;
    filters: IFilters;
}

export const TableSection = ({ page, setPage, filters }: ITableProps) => {
    // -------- state --------
    // const [page, setPage] = useState(Number(pageNumber));
    const [perPage, setPerPage] = useState(10);

    const [localUpdates, setLocalUpdates] = useState<IEstate[]>([]);

    const onUpdate = (newData: IJsonTableProp, estate: IEstate) => {
        //translate back to API format
        const updatedEstate: IEstate = {
            ...estate,
            name: newData["Název"],
            seo: {
                category_type_cb: translateAPIFieldReverse("category_type_cb", newData["Typ inzerátu"]),
                category_main_cb: translateAPIFieldReverse("category_main_cb", newData["Kategorie"]),
                category_sub_cb: translateAPIFieldReverse("category_sub_cb", newData["Typ nemovitosti"]),
            },
            locality: newData["Lokalita"],
            price: parseInt(newData["Cena"].replace(/\s/g, "")),
        };

        // update local state
        setLocalUpdates((prev) => {
            const index = prev.findIndex((update) => update.hash_id === estate.hash_id);
            if (index === -1) {
                return [...prev, updatedEstate];
            } else {
                const newUpdates = [...prev];
                newUpdates[index] = updatedEstate;
                return newUpdates;
            }
        });
    }
    // -------- fetching data --------
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['estates', page, perPage, filters],
        queryFn: () => API.fetchEstates(page, perPage, filters),
    });

    // -------- extracting estates list from the data --------
    // let estates: IEstate[] = data?._embedded?.estates || [];
    // combine data from the API with local updates
    let estates: IEstate[] = data?._embedded?.estates || [];

    estates = estates.map((estate: IEstate) => {
        const localUpdate = localUpdates.find((update) => update.hash_id === estate.hash_id);
        return localUpdate || estate;
    });

    let totalResults: number | null = data?.result_size;
    let max_page: number | null = useMemo(() => totalResults && Math.ceil(totalResults / perPage), [totalResults, perPage]);


    const formatDataForTable = (estates: IEstate[], onUpdate: any): IJsonTableProps => {
        return {
            rows: estates.map((estate: IEstate): IJsonTableProp => {
                // translate data from API
                const estateData = {
                    "Název": estate.name,
                    "Typ inzerátu": translateAPIField("category_type_cb", estate.seo.category_type_cb),
                    "Kategorie": translateAPIField("category_main_cb", estate.seo.category_main_cb),
                    "Typ nemovitosti": translateAPIField("category_sub_cb", estate.seo.category_sub_cb),
                    "Lokalita": estate.locality,
                    "Cena": formatCurrency(estate.price),
                    "Fotka": <Link to={estate._links.images[0].href} target="_blank" rel="noopener noreferrer">Zobrazit fotku</Link>,
                    "Detail": <Link to={`estate/${estate.hash_id}`}>Zobrazit detail</Link>,
                };

                // add update button
                return {
                    ...estateData,
                    "Změny": (
                        <UpdateButton
                            dataToDisplay={estateData}
                            onUpdate={(newData: IJsonTableProp) => onUpdate(newData, estate)}
                        />
                    ),
                };
            }),
        };
    };

    const dataToDisplay = formatDataForTable(estates, onUpdate);

    // -------- pre-fetching --------
    const queryClient = useQueryClient();

    useEffect(() => {
        const prefetch = (page: number) => {
            queryClient.prefetchQuery({
                queryKey: ['estates', page, perPage, filters],
                queryFn: () => API.fetchEstates(page, perPage, filters),
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