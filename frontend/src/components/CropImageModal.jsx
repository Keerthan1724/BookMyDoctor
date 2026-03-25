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
    <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-[500px] h-[500px]">
        
        <div className="relative w-full h-[350px]">
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
          onChange={(e) => setZoom(e.target.value)}
          className="w-full mt-4"
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Save Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropImageModal;