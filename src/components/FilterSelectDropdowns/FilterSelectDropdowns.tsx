import { API_FIELDS_MAPPING } from "@/globals/globals";
import { useEffect, useState } from "react";
import "./FilterSelectDropdowns.scss";

interface IFiltersProps {
    filters: IFilters;
    setFilters: (value: any) => void;
}

export interface IFilters {
    [key: string]: string;
}

const FilterSelectDropdowns = ({ filters, setFilters }: IFiltersProps) => {
    const [selectedValues, setSelectedValues] = useState<IFilters>({});

    // Set selected values and filters
    useEffect(() => {
        setSelectedValues(filters);
    }, [filters]);

    const handleChange = (field: string, value: string) => {
        setSelectedValues((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Only set the filter if the value is not empty
        setFilters((prev: any) => {
            const updatedFilters = { ...prev };

            if (value === '') {
                // Remove the filter if value is empty
                delete updatedFilters[field];
            } else {
                // Otherwise, update the filter
                updatedFilters[field] = value;
            }

            return updatedFilters;
        });
    };

    return (
        <div className="filters">
            {Object.entries(API_FIELDS_MAPPING).map(([fieldKey, fieldConfig]) => (
                <div key={fieldKey} className="filter">
                    <label className="filter-label" htmlFor={fieldKey}>{fieldConfig.name}</label>
                    <select
                        className="filter-select"
                        id={fieldKey}
                        value={selectedValues[fieldKey] || ''}
                        onChange={(e) => handleChange(fieldKey, e.target.value)}
                    >
                        <option value="">Vše</option>
                        {Object.entries(fieldConfig.data).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
};

export { FilterSelectDropdowns };
