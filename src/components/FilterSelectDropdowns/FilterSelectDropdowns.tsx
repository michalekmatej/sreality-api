import { API_FIELDS_MAPPING } from "@/globals/globals";
import { useState } from "react";
import "./FilterSelectDropdowns.scss";

interface IFiltersProps {
    updateState: (value: any) => void;
}

export interface IFilters {
    [key: string]: string;
}

const FilterSelectDropdowns = ({ updateState }: IFiltersProps) => {
    const [selectedValues, setSelectedValues] = useState<IFilters>({});

    const handleChange = (field: string, value: string) => {
        setSelectedValues((prev) => ({
            ...prev,
            [field]: value,
        }));
        updateState((prev: any) => ({
            ...prev,
            [field]: value,
        }));
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
            {/* <pre>Selected Values: {JSON.stringify(selectedValues, null, 2)}</pre> */}
        </div>
    );
};

export { FilterSelectDropdowns };