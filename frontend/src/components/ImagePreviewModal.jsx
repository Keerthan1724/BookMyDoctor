import { FiTrash2, FiX } from "react-icons/fi";

const ImagePreviewModal = ({ previewImage, onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/70 flex items-center justify-center z-50">
      <div className="relative w-[60vw] h-[60vh] flex items-center justify-center">
        <img
          src={previewImage}
          className="w-full h-full object-contain"
          alt="preview"
        />

        <button
          onClick={onClose}
          className="mr-60 absolute top-1 right-3 bg-black/50 text-white p-3 rounded-full hover:bg-black"
        >
          <FiX size={22} />
        </button>

        <button
          onClick={onDelete}
          className="mr-60 absolute bottom-1 right-3 bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
        >
          <FiTrash2 size={22} />
        </button>
      </div>
    </div>
  );
};

export default ImagePreviewModal;