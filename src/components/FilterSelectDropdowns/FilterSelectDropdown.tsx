import { useId } from "react";
import "./FilterSelectDropdowns.scss";

interface IFilterSelectDropdownProps {
    fieldKey: string;
    fieldConfig: {
        name: string;
        data: Record<string, string>;
    };
    selectedValue: string;
    onChange: (field: string, value: string) => void;
}

const FilterSelectDropdown = ({
    fieldKey,
    fieldConfig,
    selectedValue,
    onChange,
}: IFilterSelectDropdownProps) => {
    const id = useId();

    return (
        <div className="filter-select-dropdown">
            <label className="filter-label" htmlFor={`${id}-${fieldKey}`}>
                {fieldConfig.name}
            </label>
            <select
                className="filter-select"
                id={`${id}-${fieldKey}`}
                value={selectedValue || ""}
                onChange={(e) => onChange(fieldKey, e.target.value)}
            >
                <option value="">Vše</option>
                {Object.entries(fieldConfig.data).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export { FilterSelectDropdown };
