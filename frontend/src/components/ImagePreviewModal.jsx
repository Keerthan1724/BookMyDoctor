import { FiTrash2, FiX } from "react-icons/fi";

const ImagePreviewModal = ({ previewImage, onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4">

      <div className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center">

        <img
          src={previewImage}
          className="w-full h-full object-contain"
          alt="preview"
        />

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-14 right-3 sm:top-2 sm:right-48 bg-black/60 text-white p-3 rounded-full hover:bg-black transition"
        >
          <FiX size={20} />
        </button>

        {/* DELETE BUTTON */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="absolute bottom-14 right-3 sm:bottom-2 sm:right-48 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition"
          >
            <FiTrash2 size={20} />
          </button>
        )}

      </div>
    </div>
  );
};

export default ImagePreviewModal;
