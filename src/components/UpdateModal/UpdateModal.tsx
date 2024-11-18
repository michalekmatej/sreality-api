import { Modal } from "@mui/material";

interface IModalComponentProps {
  open: boolean;
  handleClose: () => void;
  renderFields: JSX.Element[];
  onConfirm: () => void;
}

export const UpdateModal = ({ open, handleClose, renderFields, onConfirm }: IModalComponentProps) => {
  return (
    <Modal className="update-modal" open={open} onClose={handleClose}>
      <div className="content">
        <button onClick={handleClose} className="close-button">×</button>
        <h2 className="title">Úprava nemovitosti</h2>
        <div className="values">{renderFields}</div>
        <button onClick={onConfirm} className="confirm-button">Uložit změny</button>
      </div>
    </Modal>
  );
};
