import { useRef, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import videoIcon from "../assets/DetectionCenter/video.svg";
import {
  Trash2,
  CheckCircle,
  ChevronDown,
  Download,
  Loader2,
} from "lucide-react";
import { signInforData } from "../utils/SignInfoData";

// Build a fast lookup map for sign info
const signMap = {};
signInforData.forEach((sign) => {
  signMap[sign.id] = sign;
});

function VideoUpload() {
  const { t } = useTranslation();

  const fileInput = useRef(null);
  const videoPlayerRef = useRef(null);

  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [skipRate, setSkipRate] = useState(1); // default 1 frame interval
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [detections, setDetections] = useState([]);
  const [processedVideoUrl, setProcessedVideoUrl] = useState("");

  const handleClick = () => fileInput.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFile(file);
    setProcessedVideoUrl("");
    startUpload(file);
  };

  const startUpload = (file) => {
    setStatus("uploading");
    let val = 0;
    const interval = setInterval(() => {
      val += 5;
      setProgress(val);
      if (val >= 100) {
        clearInterval(interval);
        setStatus("ready");
      }
    }, 30);
  };

  const startProcessing = async () => {
    if (!videoFile) return;
    setStatus("processing");
    setProgress(0);
    setDetections([]);
    setProcessedVideoUrl("");

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("frame_interval", skipRate);

    try {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 2, 95));
      }, 50);

      const res = await axios.post(
        "http://127.0.0.1:5000/api/detect/video",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 0,
        },
      );

      clearInterval(interval);
      setProgress(100);

      const { results, video_url } = res.data;
      setDetections(results || []);

      setProcessedVideoUrl(video_url);

      setStatus("completed");
    } catch (err) {
      console.error(err);
      setStatus("ready");
      setProgress(0);
      alert("Video processing failed.");
    }
  };

  const exportCSV = () => {
    if (!Array.isArray(detections) || detections.length === 0) {
      alert("No detections to export.");
      return;
    }

    const rows = [["Frame ID", "Time (s)", "Sign Name", "Confidence (%)"]];
    detections.forEach((frame) => {
      frame.results.forEach((det) => {
        const signName = t(`signs.${det.id}.name`, `Unknown (${det.id})`);
        rows.push([
          frame.frame_id,
          (frame.frame_id / 30).toFixed(2),
          signName,
          (det.confidence * 100).toFixed(1),
        ]);
      });
    });

    const csvContent = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "video_detections.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload area */}
      {status === "idle" && (
        <div
          onClick={handleClick}
          className="w-full flex flex-col items-center p-6 sm:p-10 rounded-xl border-2 border-dashed border-neutral-300 gap-3 sm:gap-5 cursor-pointer hover:bg-neutral-50 transition-colors"
        >
          <img
            src={videoIcon}
            alt="video"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
          />
          <div className="text-xl sm:text-3xl font-bold">
            {t("video.upload")}
          </div>
          <div className="text-sm sm:text-base">{t("video.drag")}</div>
          <div className="text-xs sm:text-sm text-gray-500">
            {t("video.format")}
          </div>
          <input
            type="file"
            accept="video/*"
            className="hidden"
            ref={fileInput}
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Upload/progress card */}
      {status !== "idle" && (
        <div className="w-full border-2 border-dashed border-neutral-300 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              {status === "ready" || status === "completed" ? (
                <CheckCircle className="text-emerald-500 w-6 h-6" />
              ) : (
                <Loader2 className="animate-spin text-neutral-400 w-6 h-6" />
              )}
              <div>
                <div className="font-bold text-lg">
                  {status === "uploading" && t("video.uploading")}
                  {status === "ready" && t("video.success")}
                  {status === "processing" && t("video.processing")}
                  {status === "completed" && t("video.completed")}
                </div>
                <div className="text-xs text-gray-500">
                  {videoFile?.name || t("video.noVideo")}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setStatus("idle");
                setProgress(0);
                setVideoFile(null);
                setDetections([]);
                setProcessedVideoUrl("");
              }}
              className="p-2 hover:bg-neutral-100 rounded-full"
            >
              <Trash2 className="w-5 h-5 text-neutral-400" />
            </button>
          </div>

          <div className="w-full bg-neutral-100 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                status === "ready" || status === "completed"
                  ? "bg-emerald-500"
                  : "bg-yellow-500"
              }`}
              style={{
                width: `${status === "ready" || status === "completed" ? 100 : progress}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Video processing controls */}
      {(status === "ready" ||
        status === "processing" ||
        status === "completed") && (
        <div className="w-full bg-white border border-neutral-200 rounded-xl p-8 shadow-sm space-y-6">
          {/* Frame skip and process button */}
          {status !== "completed" && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-neutral-800">
                  {t("video.frameSkip")}
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex justify-between items-center p-3 border border-neutral-300 rounded-lg bg-white"
                  >
                    {skipRate} {t("video.frames")}
                    <ChevronDown
                      className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute w-full mt-1 border border-neutral-200 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
                      {[1, 2, 5, 10].map((rate) => (
                        <div
                          key={rate}
                          onClick={() => {
                            setSkipRate(rate);
                            setIsDropdownOpen(false);
                          }}
                          className={`p-3 cursor-pointer hover:bg-yellow-500 hover:text-white ${
                            skipRate === rate ? "bg-yellow-500 text-white" : ""
                          }`}
                        >
                          {rate} {t("video.frames")}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={startProcessing}
                disabled={status === "processing"}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-neutral-900 font-bold py-3 rounded-lg transition-colors"
              >
                {status === "processing"
                  ? t("video.processingBtn")
                  : t("video.start")}
              </button>
            </div>
          )}

          {/* Processed video & detections */}
          {status === "completed" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold">{t("video.results")}</h3>

              {/* Video playback */}
              {processedVideoUrl && (
                <video
                  key={processedVideoUrl}
                  controls
                  preload="auto"
                  className="w-full rounded-lg border"
                >
                  <source src={processedVideoUrl} type="video/mp4" />
                </video>
              )}

              {/* Export CSV */}
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50"
              >
                <Download className="w-4 h-4" /> {t("video.export")}
              </button>

              {/* Detection list */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {Array.isArray(detections) &&
                  detections.map((item) => {
                    const det = item.results?.[0];
                    if (!det) return null;
                    const signInfo = signMap[det.id] || { img: null };
                    const signName = t(
                      `signs.${det.id}.name`,
                      `Unknown (${det.id})`,
                    );

                    return (
                      <div
                        key={item.frame_id}
                        className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          {signInfo.img && (
                            <img
                              src={signInfo.img}
                              alt={signName}
                              className="w-12 h-12 object-contain rounded"
                            />
                          )}
                          <div>
                            <p className="font-bold text-neutral-800">
                              {t("video.frame")} {item.frame_id}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {(item.frame_id / 30).toFixed(2)}s
                            </p>
                            <p className="font-medium mt-1">{signName}</p>
                          </div>
                        </div>
                        <div className="bg-yellow-100 px-3 py-1 rounded text-sm font-bold text-yellow-700">
                          {(det.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoUpload;
