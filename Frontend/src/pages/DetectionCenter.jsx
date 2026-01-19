import { useState } from "react";
import ImageUpload from "../components/ImageUpload";
import VideoUpload from "../components/VideoUpload";
import WebcameCapture from "../components/WebcameCapture";
import upload from "../assets/upload.svg";
import webcam from "../assets/webcam.svg";
import "../App.css";

function DetectionCenter() {
  const [mode, setMode] = useState("image");
  const [videoOption, setVideoOption] = useState(null);
  return (
    <div className="pt-30 text-black w-screen bg-neutral-100 pb-5 sm:pb-10 ">
      <div className="px-4 sm:px-10 lg:px-20 text-left">
        <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
          Detection Center
        </div>
        <div className="text-sm sm:text-base lg:text-lg mb-6">
          Select a detection mode to analyze traffic signs with YOLO-powered
          precision
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div
            onClick={() => {
              setMode("image");
              setVideoOption(null);
            }}
            className="shadow-xl rounded-xl p-6 sm:p-10 bg-white text-left"
          >
            <div className="text-2xl sm:text-3xl font-bold mb-2">
              Upload Image
            </div>
            <div className="text-sm sm:text-base">
              Detect traffic signs in static images
            </div>
          </div>
          <div
            onClick={() => {
              setMode("video");
              setVideoOption("upload");
            }}
            className="shadow-xl rounded-xl p-6 sm:p-10 bg-white text-left"
          >
            <div className="text-2xl sm:text-3xl font-bold mb-2">Video</div>
            <div className="text-sm sm:text-base">
              Process video files or in real time
            </div>
          </div>
          <div className="col-span-1 sm:col-span-2 shadow-xl rounded-xl p-6 sm:p-10 bg-white">
            {mode === "video" && (
              <div className="flex gap-3 mb-10">
                <div
                  onClick={() => setVideoOption("upload")}
                  className="shadow-[0_4px_10px_rgba(0,0,0,0.3)] rounded-xl p-6 sm:p-10 bg-white text-left w-1/2 flex flex-col gap-1"
                >
                  <img src={upload} alt="upload" className="w-8 h-8"  />
                  <div className="text-2xl font-bold">Upload Video File </div>
                  <div>Process pre-recorded video files </div>
                </div>
                <div
                  onClick={() => setVideoOption("realtime")}
                  className="shadow-[0_4px_10px_rgba(0,0,0,0.3)] rounded-xl p-6 sm:p-10 bg-white text-left w-1/2 flex flex-col gap-1"
                >
                  <img src={webcam} alt="webcam" className="w-8 h-8"  />
                  <div className="text-2xl font-bold">Webcam Live</div>
                  <div>Connect to real-time video stream</div>
                </div>
              </div>
            )}

            {mode === "image" && <ImageUpload />}
            {mode === "video" && videoOption === "upload" && <VideoUpload />}
            {mode === "video" && videoOption === "realtime" && (
              <WebcameCapture />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetectionCenter;
