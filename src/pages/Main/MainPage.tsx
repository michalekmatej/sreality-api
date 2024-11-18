import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@components/Navbar/Navbar";
import { FilterSelectDropdowns, IFilters } from "@components/FilterSelectDropdowns/FilterSelectDropdowns";
import { TableSection } from "./components/TableSection/TableSection";
import { PER_PAGE_OPTIONS } from "@globals/globals";
import "./MainPage.scss";

const MainPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // -------- state --------
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10); // Default value
    const [filterValues, setFilterValues] = useState<IFilters>({});

    // -------- initialize state --------
    useEffect(() => {
        const initialPage = searchParams.get("page") || "1";
        const initialPerPage = searchParams.get("per_page") || String(PER_PAGE_OPTIONS[0]);

        setPage(Number(initialPage));
        setPerPage(Number(initialPerPage));

        const filters: IFilters = {};
        searchParams.forEach((value, key) => {
            if (key !== "page" && key !== "per_page") {
                filters[key] = value;
            }
        });
        setFilterValues(filters);
    }, [searchParams]);

    // -------- update URL --------
    useEffect(() => {
        setSearchParams({
            page: page.toString(),
            "per_page": perPage.toString(),
            ...filterValues
        });
    }, [page, perPage, filterValues, setSearchParams]);


    // -------- handle filter change --------
    const handleFilterChange = (newFilters: IFilters) => {
        setFilterValues(newFilters);
        setPage(1); // Reset page when filters change
    };

    return (
        <>
            <Navbar />
            <FilterSelectDropdowns
                filters={filterValues}
                setFilters={handleFilterChange}
            />
            <TableSection
                key={page}
                filters={filterValues}
                page={page}
                perPage={perPage}
                setPage={setPage}
                setPerPage={setPerPage}
            />
        </>
    );
};

export default MainPage;
