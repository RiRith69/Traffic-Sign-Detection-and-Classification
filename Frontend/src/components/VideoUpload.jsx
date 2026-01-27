import video from "../assets/DetectionCenter/video.svg";

function VideoUpload() {
  return (
    <div className="flex flex-col items-center p-6 sm:p-10 rounded-xl border-2 border-dashed border-neutral-300 gap-3 sm:gap-5">
      <img
        src={video}
        alt="video"
        className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
      />
      <div className="text-xl sm:text-3xl font-bold">Upload Video</div>
      <div className="text-sm sm:text-base">
        Drag and drop your video here, or click to browse
      </div>
      <div className="text-xs sm:text-sm text-gray-500">
        Supported formats: MP4, AVI, MOV (max 500MB)
      </div>
    </div>
  );
}

export default VideoUpload;
