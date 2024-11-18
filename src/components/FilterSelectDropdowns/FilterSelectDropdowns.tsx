import { useEffect, useState } from "react";
import { FilterSelectDropdown } from "./FilterSelectDropdown";
import { API_FIELDS_MAPPING } from "@/globals/globals";
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

    useEffect(() => {
        setSelectedValues(filters);
    }, [filters]);

    const handleChange = (field: string, value: string) => {
        setSelectedValues((prev) => ({
            ...prev,
            [field]: value,
        }));

        setFilters((prev: any) => {
            const updatedFilters = { ...prev };

            if (value === "") {
                delete updatedFilters[field];
            } else {
                updatedFilters[field] = value;
            }

            return updatedFilters;
        });
    };

    return (
        <div className="filters">
            {Object.entries(API_FIELDS_MAPPING).map(([fieldKey, fieldConfig]) => (
                <FilterSelectDropdown
                    key={fieldKey}
                    fieldKey={fieldKey}
                    fieldConfig={fieldConfig}
                    selectedValue={selectedValues[fieldKey] || ""}
                    onChange={handleChange}
                />
            ))}
        </div>
    );
};

export { FilterSelectDropdowns };
