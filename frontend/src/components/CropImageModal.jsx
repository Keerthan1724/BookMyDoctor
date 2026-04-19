import Cropper from "react-easy-crop";

const CropImageModal = ({
  imageSrc,
  crop,
  zoom,
  setCrop,
  setZoom,
  onCropComplete,
  onClose,
  onSave,
}) => {
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 p-3 sm:p-4">

      <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl w-full max-w-[500px] h-[420px] sm:h-[500px]">

        <div className="relative w-full h-[260px] sm:h-[350px]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full mt-4 accent-primary"
        />

        <div className="flex justify-between gap-3 mt-4">

          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition text-sm sm:text-base"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="flex-1 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition text-sm sm:text-base"
          >
            Save Image
          </button>

        </div>

      </div>
    </div>
  );
};

export default CropImageModal;