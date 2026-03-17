import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  StopCircle,
  Play,
  Settings2,
  Activity,
  Loader2,
} from "lucide-react";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";
import { enSigns } from "../locales/en/signContent"; // adjust path if needed

const socket = io("http://localhost:5000");

function WebcamCapture() {
  const { t } = useTranslation();

  const [isLive, setIsLive] = useState(false);
  const [frameSkipRate, setFrameSkipRate] = useState(1);
  const [detection, setDetection] = useState({
    label: t("webcam.processing"),
    confidence: "0%",
  });
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const frameCountRef = useRef(0);

  // translate sign name using signContent.js
  const translateSign = (label) => {
    const signs = enSigns.signs;

    const key = Object.keys(signs).find(
      (k) => signs[k].name.toLowerCase() === label?.toLowerCase(),
    );

    if (!key) return label;

    return t(`signs.${key}.name`, { defaultValue: signs[key].name });
  };

  useEffect(() => {
    socket.on("result", (data) => {
      setDetection({
        label: data.label ? translateSign(data.label) : t("webcam.processing"),
        confidence: data.confidence
          ? (data.confidence * 100).toFixed(1) + "%"
          : "0%",
      });

      drawBoxes(data.boxes || []);
      setLoading(false);
    });

    return () => socket.off("result");
  }, []);

  const drawBoxes = (boxes) => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const rect = video.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = rect.width / video.videoWidth;
    const scaleY = rect.height / video.videoHeight;

    boxes.forEach((box) => {
      const x = box.x * scaleX;
      const y = box.y * scaleY;
      const width = box.width * scaleX;
      const height = box.height * scaleY;

      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = "red";
      ctx.font = "14px Arial";
      ctx.fillText(
        `${translateSign(box.label)} ${(box.confidence * 100).toFixed(0)}%`,
        x,
        y - 5,
      );
    });
  };

  const startWebcam = async () => {
    setIsLive(true);
    setLoading(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      intervalRef.current = setInterval(captureAndSendFrame, 100);
    } catch (err) {
      console.error("Webcam error:", err);
      setIsLive(false);
      setLoading(false);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }

    clearInterval(intervalRef.current);
    setIsLive(false);

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const captureAndSendFrame = () => {
    if (!videoRef.current) return;

    frameCountRef.current += 1;

    if (frameCountRef.current % frameSkipRate !== 0) return;

    const video = videoRef.current;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        socket.emit("frame", reader.result);
      };

      reader.readAsDataURL(blob);
    }, "image/jpeg");
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="w-full bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
        {!isLive ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <Settings2 className="text-amber-500" size={20} />
              <h2 className="text-lg font-bold">{t("webcam.config")}</h2>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-neutral-500">
                {t("webcam.frameSkip")}
              </label>

              <select
                value={frameSkipRate}
                onChange={(e) => setFrameSkipRate(Number(e.target.value))}
                className="w-full p-3 mt-2 border rounded-xl"
              >
                <option value={1}>{t("webcam.frames.f1")}</option>
                <option value={2}>{t("webcam.frames.f2")}</option>
                <option value={3}>{t("webcam.frames.f3")}</option>
                <option value={4}>{t("webcam.frames.f4")}</option>
                <option value={5}>{t("webcam.frames.f5")}</option>
              </select>
            </div>

            <button
              onClick={startWebcam}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 rounded-xl font-bold flex justify-center gap-2"
            >
              <Play size={18} /> {t("webcam.start")}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-bold text-sm">{t("webcam.live")}</span>
              </div>

              <button
                onClick={stopWebcam}
                className="flex gap-2 text-red-500 border px-3 py-1 rounded-lg"
              >
                <StopCircle size={14} /> {t("webcam.stop")}
              </button>
            </div>

            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                  <Loader2 className="animate-spin text-white w-10 h-10" />
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute w-full h-full object-cover"
              />

              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
            </div>

            <div className="p-4 bg-neutral-50 border rounded-xl flex justify-between">
              <span className="text-xs italic text-neutral-500">
                {detection.label}
              </span>

              <span className="bg-amber-100 text-amber-700 px-2 rounded text-xs font-bold">
                {detection.confidence}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebcamCapture;
