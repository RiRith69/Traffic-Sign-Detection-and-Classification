import React, { useState, useRef, useEffect } from "react";
import { Camera, StopCircle, Play, Settings2, Activity, Loader2 } from "lucide-react";
import axios from "axios";

function WebcameCapture() {
  const [isLive, setIsLive] = useState(false);
  const [frameSkipRate, setFrameSkipRate] = useState(1); // numeric for backend
  const [detection, setDetection] = useState({
    label: "Detection processing...",
    confidence: "0%",
  });
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const frameCountRef = useRef(0);

  // Start webcam and frame capture
  const startWebcam = async () => {
    setIsLive(true);
    setLoading(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      if (!canvasRef.current) canvasRef.current = document.createElement("canvas");

      // Start sending frames every 100ms
      intervalRef.current = setInterval(() => captureAndSendFrame(), 100);
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setIsLive(false);
      setLoading(false);
    }
  };

  // Stop webcam and frame capture
  const stopWebcam = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setIsLive(false);
    clearInterval(intervalRef.current);

    try {
      await axios.post("http://localhost:5000/api/realtime/stop");
    } catch (err) {
      console.error("Error stopping camera:", err);
    }
  };

  // Capture a frame and send to backend
  const captureAndSendFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    frameCountRef.current += 1;
    if (frameCountRef.current % frameSkipRate !== 0) return; // skip frames

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("frame", blob, "frame.jpg");

      try {
        await axios.post("http://localhost:5000/api/realtime/frame", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (err) {
        console.error("Error sending frame, retrying...", err);
        // Retry once after 100ms
        setTimeout(async () => {
          try {
            await axios.post("http://localhost:5000/api/realtime/frame", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          } catch (e) {
            console.error("Retry failed:", e);
          }
        }, 100);
      }
    }, "image/jpeg");
  };

  // Poll latest detection every 500ms
  useEffect(() => {
    if (!isLive) return;

    const poll = setInterval(async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/realtime/latest");
        const data = res.data;
        setDetection({
          label: data.label || "Detection processing...",
          confidence: data.confidence
            ? (data.confidence * 100).toFixed(1) + "%"
            : "0%",
        });
        setLoading(false); // hide loading once detection arrives
      } catch (err) {
        console.error("Error fetching detection:", err);
      }
    }, 500);

    return () => clearInterval(poll);
  }, [isLive]);

  return (
    <div className="w-full px-4 py-6 animate-in fade-in duration-500">
      <div className="w-full bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
        {!isLive ? (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
              <Settings2 className="text-amber-500" size={20} />
              <h2 className="text-lg font-bold text-neutral-800">Webcam Configuration</h2>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Frame Skip Rate
              </label>
              <select
                value={frameSkipRate}
                onChange={(e) => setFrameSkipRate(Number(e.target.value))}
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 outline-none appearance-none cursor-pointer"
              >
                <option value={1}>Every frame (default)</option>
                <option value={3}>Every 3 frames</option>
                <option value={5}>Every 5 frames</option>
                <option value={10}>Every 10 frames</option>
              </select>
            </div>

            <button
              onClick={startWebcam}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-neutral-900 font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Play fill="currentColor" size={18} /> Start Webcam
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-bold text-sm text-neutral-800">Live Detection Active</span>
              </div>
              <button
                onClick={stopWebcam}
                className="flex items-center gap-2 px-4 py-1.5 border border-red-100 text-red-500 hover:bg-red-50 font-bold rounded-lg transition-colors text-xs"
              >
                <StopCircle size={14} /> Stop
              </button>
            </div>

            <div className="relative w-full max-h-[70vh] aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                  <Loader2 className="animate-spin text-white w-10 h-10" />
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={18} className="text-amber-500" />
                <h3 className="font-bold text-neutral-800 text-sm">Real Time Detection</h3>
              </div>
              <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl flex justify-between items-center">
                <span className="text-neutral-500 text-xs font-medium italic">{detection.label}</span>
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-black">
                  {detection.confidence}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebcameCapture;