import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import ImageUpload from "../components/ImageUpload";
import VideoUpload from "../components/VideoUpload";
import WebcameCapture from "../components/WebcameCapture";

import upload from "../assets/DetectionCenter/upload.svg";
import webcam from "../assets/DetectionCenter/webcam.svg";

import "../App.css";

function DetectionCenter() {

  const { t } = useTranslation();

  const [mode, setMode] = useState("image");
  const [videoOption, setVideoOption] = useState(null);

  return (
    <div className="pt-30 text-black w-screen bg-neutral-100 pb-5 sm:pb-10 ">
      <div className="px-4 sm:px-10 lg:px-20 text-left">

        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl lg:text-7xl font-bold mb-4"
        >
          {t("detectPage.title")}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-sm sm:text-base lg:text-lg mb-6 text-black/60"
        >
          {t("detectPage.description")}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Upload Image Card */}
          <motion.div
            whileHover={{ scale: 1.03, y: -3 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => {
              setMode("image");
              setVideoOption(null);
            }}
            className="shadow-xl rounded-xl p-6 sm:p-10 bg-white text-left cursor-pointer"
          >
            <div className="text-2xl sm:text-3xl font-bold mb-2">
              {t("detectPage.uploadImage")}
            </div>

            <div className="text-sm sm:text-base">
              {t("detectPage.uploadImageDesc")}
            </div>
          </motion.div>

          {/* Video Card */}
          <motion.div
            whileHover={{ scale: 1.03, y: -3 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => {
              setMode("video");
              setVideoOption("upload");
            }}
            className="shadow-xl rounded-xl p-6 sm:p-10 bg-white text-left cursor-pointer"
          >
            <div className="text-2xl sm:text-3xl font-bold mb-2">
              {t("detectPage.video")}
            </div>

            <div className="text-sm sm:text-base">
              {t("detectPage.videoDesc")}
            </div>
          </motion.div>

          {/* Video Options / Image Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-1 sm:col-span-2 shadow-xl rounded-xl p-6 sm:p-10 bg-white"
          >

            {mode === "video" && (
              <div className="flex gap-3 mb-10">

                <motion.div
                  whileHover={{ scale: 1.03, y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => setVideoOption("upload")}
                  className="shadow-[0_4px_10px_rgba(0,0,0,0.3)] rounded-xl p-6 sm:p-10 bg-white text-left w-1/2 flex flex-col gap-1 cursor-pointer"
                >
                  <img src={upload} alt="upload" className="w-8 h-8" />

                  <div className="text-2xl font-bold">
                    {t("detectPage.uploadVideo")}
                  </div>

                  <div>
                    {t("detectPage.uploadVideoDesc")}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03, y: -3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => setVideoOption("realtime")}
                  className="shadow-[0_4px_10px_rgba(0,0,0,0.3)] rounded-xl p-6 sm:p-10 bg-white text-left w-1/2 flex flex-col gap-1 cursor-pointer"
                >
                  <img src={webcam} alt="webcam" className="w-8 h-8" />

                  <div className="text-2xl font-bold">
                    {t("detectPage.webcam")}
                  </div>

                  <div>
                    {t("detectPage.webcamDesc")}
                  </div>
                </motion.div>

              </div>
            )}

            {mode === "image" && <ImageUpload />}
            {mode === "video" && videoOption === "upload" && <VideoUpload />}
            {mode === "video" && videoOption === "realtime" && <WebcameCapture />}

          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default DetectionCenter;