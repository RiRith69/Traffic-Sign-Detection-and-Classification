import upload from "../assets/upload.svg";
function ImageUpload() {
  return (
    <div className="col-span-1 sm:col-span-2 shadow-xl rounded-xl p-6 sm:p-10 bg-white">
      <div className="flex flex-col items-center p-6 sm:p-10 rounded-xl border-2 border-dashed border-neutral-300 gap-3 sm:gap-5">
        <img
          src={upload}
          alt="upload"
          className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
        />
        <div className="text-xl sm:text-3xl font-bold">Upload Image</div>
        <div className="text-sm sm:text-base">
          Detect traffic signs in static images
        </div>
        <div className="text-xs sm:text-sm text-gray-500">
          Support formats: JPG, PNG (Max 100MB)
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
