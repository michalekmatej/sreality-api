import { useState, useCallback } from "react";
import { UpdateModal } from "@components/UpdateModal/UpdateModal";
import { EditSVG } from "@components/EditSVG/EditSVG";
import { IJsonTableProp } from "@components/JsonToTable/JsonToTable";
import { API_FIELDS_MAPPING, translateAPIField, translateAPIFieldReverse } from "@/globals/globals";
import "./UpdateButton.scss";
import { FilterSelectDropdown } from "../FilterSelectDropdowns/FilterSelectDropdown";


interface IUpdateButtonProps {
  dataToDisplay: IJsonTableProp;
  onUpdate: (newData: IJsonTableProp) => void;
}

const UpdateButton = ({ dataToDisplay, onUpdate }: IUpdateButtonProps) => {

  // -------- state --------
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<IJsonTableProp>(dataToDisplay);

  // -------- handlers --------
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // -------- on confirm --------
  const onConfirm = () => {
    onUpdate(data);
    handleClose();
  };

  // -------- handle filter dropdown changes --------
  const handleFilterChange = useCallback(
    (humanField: string, apiField: string, value: string) => {
      setData((prevData) => ({
        ...prevData,
        [humanField]: translateAPIField(apiField, Number(value)),
      }));
    },
    []
  );

  // -------- rendering input or dropdown --------
  const renderField = (key: string, value: any) => {
    const fieldMapping = Object.entries(API_FIELDS_MAPPING).find(
      ([, config]) => config.name === key
    );

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

    // if not a mapped field, render a text input
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

  // -------- render --------
  return (
    <>
      <button onClick={handleOpen} className="update-button">
        <EditSVG />
      </button>

      <UpdateModal
        open={open}
        handleClose={handleClose}
        renderFields={Object.entries(data).map(([key, value]) => renderField(key, value)).filter(field => field !== null)}
        onConfirm={onConfirm}
      />
    </>
  );
};

export default UpdateButton;
