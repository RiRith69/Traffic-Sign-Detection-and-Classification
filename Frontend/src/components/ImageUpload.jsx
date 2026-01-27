import { useRef, useState } from "react";
import upload from "../assets/upload.svg";
function ImageUpload() {
  const fileInput = useRef(null);
  const [image, setImage] = useState(null);

  const handleClick = () => {
    fileInput.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: validate type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setImage(URL.createObjectURL(file));
  };

  return (
    // <div className="col-span-1 sm:col-span-2 shadow-xl rounded-xl p-6 sm:p-10 bg-white">
    <div
      onClick={handleClick}
      className="flex flex-col items-center p-6 sm:p-10 rounded-xl border-2 border-dashed border-neutral-300 gap-3 sm:gap-5"
    >
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
      <input
        ref={fileInput}
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>

    // </div>
  );
}

export default ImageUpload;
