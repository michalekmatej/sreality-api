import { Navbar } from "@components/Navbar/Navbar";
import { TableSection } from "./components/TableSection/TableSection";
import { useEffect } from "react";
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

    return (
        <>
            <Navbar />
            <TableSection pageNumber={pageNumber ? Number(pageNumber) : 1} />
        </>
    )
}

export default MainPage;
