import { useState } from 'react';
import './JsonToTable.scss';

// -------------------------------------

export interface IJsonTableProps {
    rows: {
        [key: string]: any;
        "Název": string;
        "Typ": string;
        "Kategorie": string;
        "Typ nemovitosti": string;
        "Lokalita": string;
        "Cena": string;
        "Fotka": React.ReactNode;
        "Detail": React.ReactNode;
    }[];
}

interface ISortConfig {
    key: string | null;
    direction: 'ascending' | 'descending';
}

// -------------------------------------

export const JsonToTable = ({ data }: { data: IJsonTableProps }) => {
    const { rows } = data;

    // generate column titles based on the keys of the first row
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    // default values for sorting
    const [sortConfig, setSortConfig] = useState<ISortConfig>({
        key: columns[0],
        direction: 'ascending',
    });

    const handleSort = (column: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === column && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        setSortConfig({
            key: column,
            direction,
        });
    };

    const sortedRows = [...rows].sort((a, b) => {
        if (sortConfig.key === null) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    return (
        <table className="json-to-table">
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column}
                            className={sortConfig.key === column ? sortConfig.direction : ''}
                            onClick={() => handleSort(column)}
                        >
                            {column.charAt(0).toUpperCase() + column.slice(1)}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortedRows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((column) => (
                            <td key={column}>
                                {row[column]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};