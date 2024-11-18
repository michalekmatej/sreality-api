import { Modal } from "@mui/material";
import { useState, useCallback } from "react";
import { IJsonTableProp } from "@components/JsonToTable/JsonToTable";
import { FilterSelectDropdown } from "@components/FilterSelectDropdowns/FilterSelectDropdown";
import { API_FIELDS_MAPPING, translateAPIField, translateAPIFieldReverse } from "@/globals/globals";
import "./UpdateButton.scss";

// Types for props
interface IUpdateButtonProps {
  dataToDisplay: IJsonTableProp;
  onUpdate: (newData: IJsonTableProp) => void;
}

const UpdateButton = ({ dataToDisplay, onUpdate }: IUpdateButtonProps) => {
  // State hooks for modal and data
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<IJsonTableProp>(dataToDisplay);

  // Modal open/close handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle the confirm button click to update data
  const onConfirm = () => {
    onUpdate(data);
    handleClose();
  };

  // Handle changes in filter dropdown and update the corresponding data field
  const handleFilterChange = useCallback(
    (humanField: string, apiField: string, value: string) => {
      setData((prevData) => ({
        ...prevData,
        [humanField]: translateAPIField(apiField, Number(value)),
      }));
    },
    []
  );

  // Render a field input (text or dropdown) based on the data value type
  const renderField = (key: string, value: any) => {
    // Check if the field has a mapping in API_FIELDS_MAPPING
    const fieldMapping = Object.entries(API_FIELDS_MAPPING).find(
      ([, config]) => config.name === key
    );

    // If mapping exists, render FilterSelectDropdown
    if (fieldMapping) {
      const [apiFieldKey, apiFieldOptions] = fieldMapping;
      const apiFieldValue = translateAPIFieldReverse(apiFieldKey, value);

      return (
        <div className="value" key={key}>
          <label>{key}</label>
          <FilterSelectDropdown
            fieldKey={apiFieldKey}
            fieldConfig={apiFieldOptions}
            selectedValue={String(apiFieldValue) || ""}
            onChange={(_, newValue) => handleFilterChange(key, apiFieldKey, newValue)}
          />
        </div>
      );
    }

    // If it's not a mapped field, render a text input
    if (typeof value !== "object") {
      return (
        <div className="value" key={key}>
          <label>{key}</label>
          <input
            type="text"
            value={data[key]}
            onChange={(e) => setData({ ...data, [key]: e.target.value })}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <button onClick={handleOpen} className="update-button">
        <EditSVG />
      </button>

      <Modal className="update-modal" open={open} onClose={handleClose}>
        <div className="content">
          <button onClick={handleClose} className="close-button">×</button>
          <h2 className="title">Úprava nemovitosti</h2>

          <div className="values">
            {Object.entries(data).map(([key, value]) => renderField(key, value))}
          </div>

          <button onClick={onConfirm} className="confirm-button">
            Uložit změny
          </button>
        </div>
      </Modal>
    </>
  );
};

export default UpdateButton;

// SVG component for edit button
const EditSVG = () => (
  <svg
    className="feather feather-edit"
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
