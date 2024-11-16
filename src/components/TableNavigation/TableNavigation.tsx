import { PER_PAGE_OPTIONS } from "@/globals/globals";
import { useId } from "react";
import "./TableNavigation.scss";

interface ITableNavigationProps {
    page: number;
    numberOfPages: number;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
    onChangePageRange: (event: any) => void;
}

export const TableNavigation = ({ page, numberOfPages, goToNextPage, goToPreviousPage, onChangePageRange }: ITableNavigationProps) => {
    const selectId = useId();

    return (
        <div className="table-navigation">
            <div className="main flex">
                <button className="previous-btn" onClick={goToPreviousPage} disabled={page <= 1}>Předchozí</button>
                <span className="paging">
                    <span className="current-page">{page}</span> / <span className="max-page">{numberOfPages}</span>
                </span>
                <button className="next-btn" onClick={goToNextPage}>Další</button>
            </div>

            <div className="per-page flex">
                <label htmlFor={`${selectId}-s`}>Počet výsledků</label>
                <select id={`${selectId}-s`} onChange={onChangePageRange}>
                    {PER_PAGE_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}