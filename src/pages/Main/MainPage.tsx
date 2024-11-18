import { Navbar } from "@components/Navbar/Navbar";
import { FilterSelectDropdowns, IFilters } from "@components/FilterSelectDropdowns/FilterSelectDropdowns";
import { TableSection } from "./components/TableSection/TableSection";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./MainPage.scss";

const MainPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // -------- state --------
    const [page, setPage] = useState<number>(1);
    const [filterValues, setFilterValues] = useState<IFilters>({});

    // -------- initialize state --------
    useEffect(() => {
        // init page number from URL
        const initialPage = searchParams.get('page') || '1';
        setPage(Number(initialPage));

        // get filters from URL, excluding the 'page' parameter
        const filters: IFilters = {};
        searchParams.forEach((value, key) => {
            if (key !== 'page') {
                filters[key] = value;
            }
        });
        setFilterValues(filters);
    }, [searchParams]);

    // -------- update URL with filters --------
    useEffect(() => {
        if (filterValues) {
            // set filters in URL, but don't reset page unless filters change
            if (Object.keys(filterValues).length > 0) {
                setSearchParams({ page: '1', ...filterValues });
            } else {
                setSearchParams({ page: page.toString() });
            }
        }
    }, [filterValues, page, setSearchParams]);

    // -------- update URL when page changes --------
    useEffect(() => {
        if (page) {
            setSearchParams({ page: page.toString(), ...filterValues });
        }
    }, [page, filterValues, setSearchParams]);

    // -------- handle filter changes --------
    const handleFilterChange = (newFilters: IFilters) => {
        setFilterValues(newFilters);
        setPage(1);
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
                setPage={setPage}
            />
        </>
    );
};

export default MainPage;
