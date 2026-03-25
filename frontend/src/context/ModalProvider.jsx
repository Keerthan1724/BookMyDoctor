import { useEffect, useState } from "react";
import CustomModal from "../components/CustomModal";

const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({ isOpen: false });

  useEffect(() => {
    const handler = (e) => {
      setModal({
        isOpen: true,
        ...e.detail,
      });
    };

    window.addEventListener("open-modal", handler);
    return () => window.removeEventListener("open-modal", handler);
  }, []);

  const closeModal = () => {
    setModal({ isOpen: false });
  };

  return (
    <>
      {children}

      <CustomModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        primaryBtnText={modal.primaryBtnText}
        secondaryBtnText={modal.secondaryBtnText}
        onPrimary={() => {
          modal.onPrimary?.();
          closeModal();
        }}
        onSecondary={() => {
          modal.onSecondary?.();
          closeModal();
        }}
        onClose={closeModal}
      />
    </>
  );
};

export default ModalProvider;