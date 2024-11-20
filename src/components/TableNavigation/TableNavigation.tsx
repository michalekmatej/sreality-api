import { PER_PAGE_OPTIONS } from "@/globals/globals";
import { useId } from "react";
import "./TableNavigation.scss";

interface ITableNavigationProps {
    page: number;
    numberOfPages: number;
    currentPerPage: number;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
    onChangePageRange: (event: React.ChangeEvent<HTMLSelectElement>) => void; // Use specific event type
}

export const TableNavigation = ({
    page,
    numberOfPages,
    currentPerPage,
    goToNextPage,
    goToPreviousPage,
    onChangePageRange,
}: ITableNavigationProps) => {
    const selectId = useId();

    // console.log(currentPerPage);

    return (
        <div className="table-navigation">
            <div className="main flex">
                <button className="previous-btn" onClick={goToPreviousPage} disabled={page <= 1}>
                    Předchozí
                </button>
                <span className="paging">
                    <span className="current-page">{page}</span> / <span className="max-page">{numberOfPages}</span>
                </span>
                <button className="next-btn" onClick={goToNextPage} disabled={page >= numberOfPages}>
                    Další
                </button>
            </div>

            <div className="per-page flex">
                <label htmlFor={`${selectId}-s`}>Počet výsledků</label>
                <select id={`${selectId}-s`} value={currentPerPage} onChange={onChangePageRange}>
                    {/* hidden option for the current value if it's not in PER_PAGE_OPTIONS */}
                    {!PER_PAGE_OPTIONS.includes(currentPerPage) && (
                        <option value={currentPerPage} style={{ display: 'none' }}>
                            {currentPerPage}
                        </option>
                    )}
                    {PER_PAGE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
