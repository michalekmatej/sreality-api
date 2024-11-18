import { Modal } from "@mui/material";
import { useState } from "react";
import { IJsonTableProp } from "@components/JsonToTable/JsonToTable";
import { FilterSelectDropdown } from "@components/FilterSelectDropdowns/FilterSelectDropdown";
import { API_FIELDS_MAPPING, translateAPIField, translateAPIFieldReverse } from "@/globals/globals";
import "./UpdateButton.scss";

interface IUpdateButtonProps {
  dataToDisplay: IJsonTableProp;
  onUpdate: (newData: IJsonTableProp) => void;
}

const UpdateButton = ({ dataToDisplay, onUpdate }: IUpdateButtonProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [data, setData] = useState<IJsonTableProp>(dataToDisplay);


  const onConfirm = () => {
    onUpdate(data);
    handleClose();
  };


  const handleFilterChange = (humanField: string, apiField: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [humanField]: translateAPIField(apiField, Number(value)),
    }));
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
            {Object.entries(data).map(([key, value]) => {
              // Render FilterSelectDropdown if key matches mapped field
              const fieldMapping = Object.entries(API_FIELDS_MAPPING).find(
                ([, config]) => config.name === key
              );

              if (fieldMapping) {
                const [apiFieldKey, apiFieldOptions] = fieldMapping;

                // conveft value to API field value
                const apiFieldValue = translateAPIFieldReverse(apiFieldKey, value);

                return (
                  <div className="value" key={key}>
                    <label>{key}</label>
                    <FilterSelectDropdown
                      fieldKey={apiFieldKey}
                      fieldConfig={apiFieldOptions}
                      selectedValue={String(apiFieldValue) || ""}
                      // onChange={(key, value) => handleFilterChange(key, value)}
                      onChange={(_, value) => handleFilterChange(key, apiFieldKey, value)}
                    />
                  </div>
                );
              }

              // Default to text input for other fields
              if (typeof value !== "object") {
                return (
                  <div className="value" key={key}>
                    <label>{key}</label>
                    <input
                      type="text"
                      value={data[key]}
                      onChange={(e) =>
                        setData({ ...data, [key]: e.target.value })
                      }
                    />
                  </div>
                );
              }

              return null;
            })}
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

const EditSVG = () => {
  return (
    <svg className="feather feather-edit" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}