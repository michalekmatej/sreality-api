import { Navbar } from "@components/Navbar/Navbar";
import { FilterSelectDropdowns, IFilters } from "@components/FilterSelectDropdowns/FilterSelectDropdowns";
import { TableSection } from "./components/TableSection/TableSection";
import { useEffect, useState, } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MainPage.scss";

const MainPage = () => {
    const { pageNumber } = useParams();
    const navigate = useNavigate();

    // -------- redirecting to the first page if no page number is provided --------
    useEffect(() => {
        if (!pageNumber) {
            navigate("/page/1", { replace: true });
            return;
        }
        // if page number is not a number, redirect to 404
        if (isNaN(Number(pageNumber))) {
            navigate("/not-found", { replace: true });
            return;
        }
    }, [pageNumber, navigate]);


    // -------- state --------
    const [page, setPage] = useState<number | null>(Number(pageNumber));
    const [filterValues, setFilterValues] = useState<IFilters>({});

    const handleFilterChange = (value: IFilters) => {
        setFilterValues(value);
        setPage(1);
    }

    useEffect(() => {
        if (!page) return;
        navigate(`/page/${page}`, { replace: true });
    }, [page, navigate]);

    return (
        <>
            <Navbar />
            <FilterSelectDropdowns updateState={handleFilterChange} />
            <TableSection
                // key={page}
                filters={filterValues}
                page={page ? Number(page) : 1}
                setPage={setPage}
            />
        </>
    )
}

export default MainPage;
