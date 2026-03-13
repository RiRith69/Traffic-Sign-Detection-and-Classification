import { useRef, useState, useEffect } from "react";
import axios from "axios";
import upload from "../assets/DetectionCenter/upload.svg";
import { signInforData } from "../utils/SignInfoData";

// Create a lookup map for fast ID -> sign info mapping
const signMap = {};
signInforData.forEach((sign) => {
  signMap[sign.id] = sign;
});

function ImageUpload() {
  const fileInput = useRef(null);
  const canvasRef = useRef(null);
  const [imageList, setImageList] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);

  const handleClick = () => fileInput.current.click();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (files.length === 0) return;

    const newEntries = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name,
      file,
      status: "Pending",
      result: null,
    }));

    setImageList((prev) => [...prev, ...newEntries]);
    if (selectedIdx === null) setSelectedIdx(0);
    e.target.value = null;
  };

  // Sequential detection for all images
  const startDetection = async () => {
    if (imageList.length === 0) return;

    const updatedImages = [...imageList];

    for (let i = 0; i < updatedImages.length; i++) {
      setSelectedIdx(i); // automatically select current image
      const img = updatedImages[i];
      updatedImages[i].status = "Detecting...";
      setImageList([...updatedImages]);

      try {
        const formData = new FormData();
        formData.append("images", img.file);

        const response = await axios.post(
          "http://localhost:5000/api/detect/images",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const detectedResults =
          response.data.results.find((r) => r.filename === img.name)?.results || [];

        const mappedResults = detectedResults.map((d) => {
          const signInfo = signMap[d.id];
          return signInfo
            ? { ...signInfo, confidence: d.confidence, bbox: d.bbox }
            : {
                id: d.id,
                name: `Unknown Sign (${d.id})`,
                confidence: d.confidence,
                bbox: d.bbox,
              };
        });

        updatedImages[i].status = "Completed";
        updatedImages[i].result = mappedResults;
        setImageList([...updatedImages]);
      } catch (err) {
        console.error("Detection error:", err);
        updatedImages[i].status = "Failed";
        setImageList([...updatedImages]);
      }
    }
  };

  const handleCleanAll = () => {
    setImageList([]);
    setSelectedIdx(null);
  };

  const currentImg = selectedIdx !== null ? imageList[selectedIdx] : null;

  // Draw bounding boxes on canvas whenever result changes
  useEffect(() => {
    if (!currentImg || !currentImg.result || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imgElement = new Image();
    imgElement.src = currentImg.url;

    imgElement.onload = () => {
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgElement, 0, 0);

      currentImg.result.forEach((sign) => {
        const [x1, y1, x2, y2] = sign.bbox;
        ctx.strokeStyle = "#f3cc4c";
        ctx.lineWidth = 2;
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

        ctx.fillStyle = "#f3cc4c";
        ctx.font = "16px Arial";
        ctx.fillText(
          `${sign.name} ${(sign.confidence * 100).toFixed(1)}%`,
          x1,
          y1 > 20 ? y1 - 5 : y1 + 15
        );
      });
    };
  }, [currentImg?.result]);

  if (imageList.length === 0) {
    return (
      <div
        onClick={handleClick}
        className="flex flex-col items-center p-6 sm:p-10 rounded-xl border-2 border-dashed border-neutral-300 gap-3 sm:gap-5 cursor-pointer hover:bg-neutral-50 transition-colors"
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
        <div className="text-xs sm:text-sm text-gray-500 text-center">
          Support formats: JPG, PNG (Max 100MB)
        </div>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto text-left animate-in fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-neutral-800">
          Detection Center
        </h1>
        <p className="text-gray-500 text-sm">
          Select a detection mode to analyze traffic signs with YOLO-powered
          precision
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload Queue */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-neutral-800">Upload Queue</h2>
            <span className="bg-neutral-100 px-2 py-0.5 rounded text-sm font-bold text-neutral-500">
              {imageList.length}
            </span>
          </div>

          <div className="space-y-4 max-h-100 overflow-y-auto pr-2 mb-6 scrollbar-hide">
            {imageList.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedIdx(index)}
                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                  selectedIdx === index
                    ? "border-amber-400 shadow-md"
                    : "border-transparent opacity-60"
                }`}
              >
                <img
                  src={item.url}
                  className="w-full h-28 object-cover"
                  alt="thumb"
                />
                <div className="p-2 bg-neutral-50 text-[10px] text-gray-400 truncate italic">
                  {item.name}
                </div>
                <div className="p-1 text-[10px] text-gray-500">{item.status}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={startDetection}
              className="w-full py-3 bg-[#f3cc4c] hover:bg-[#e2bb3b] font-bold rounded-xl shadow-sm transition-all text-neutral-900"
            >
              Start Detection
            </button>
            <button
              onClick={handleClick}
              className="w-full py-3 bg-neutral-50 hover:bg-neutral-100 font-semibold rounded-xl text-sm transition-all text-neutral-700"
            >
              Add More Images
            </button>
            <button
              onClick={handleCleanAll}
              className="w-full py-2 text-gray-400 hover:text-red-500 text-sm font-medium"
            >
              Clean All
            </button>
          </div>
        </div>

        {/* Right Column: Main View */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm relative">
            <div className="flex justify-between items-center mb-4 pr-16">
              <span className="font-bold text-sm truncate">{currentImg?.name}</span>
              <span
                className={`px-3 py-1 rounded-md text-[10px] font-bold ${
                  currentImg?.status === "Completed"
                    ? "bg-green-100 text-green-600"
                    : currentImg?.status === "Detecting..."
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {currentImg?.status}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center min-h-87.5">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-112.5 rounded-lg shadow-sm"
              />
            </div>
          </div>

          {/* Result Panel */}
          {currentImg?.status === "Completed" && currentImg?.result && (
            <div className="space-y-4 animate-in slide-in-from-bottom-2">
              <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-700 font-bold">
                <span className="text-xl">✅</span> Detection Successful
                <span className="text-xs font-normal text-green-500 ml-auto">
                  {currentImg.result.length} traffic sign(s) identified and classified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-neutral-100">
                  <div className="text-xs text-gray-400 mb-1">Average Confidence</div>
                  <div className="text-3xl font-bold text-[#f3cc4c]">
                    {(
                      (currentImg.result.reduce((sum, s) => sum + s.confidence, 0) /
                        currentImg.result.length) *
                      100
                    ).toFixed(1)}
                    %<span className="text-lg">📈</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-neutral-100">
                  <div className="text-xs text-gray-400 mb-1">Total Detections</div>
                  <div className="text-3xl font-bold text-[#f3cc4c]">
                    {currentImg.result.length} <span className="text-lg text-amber-300">✔</span>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50/50 p-6 rounded-xl border border-neutral-100 text-left">
                <h4 className="font-bold mb-4">Sign Information</h4>
                <div className="space-y-4">
                  {currentImg.result.map((det, idx) => {
                    const info = signInforData.find((s) => s.id === det.id);
                    if (!info) return null;
                    return (
                      <div key={idx}>
                        <div>
                          <div className="text-[10px] text-gray-400 font-bold mb-1">Sign</div>
                          <div className="font-bold text-neutral-800 text-sm">{info.name}</div>
                        </div>
                        <div className="h-px bg-neutral-100 w-full my-2" />
                        <div>
                          <div className="text-[10px] text-gray-400 font-bold mb-1">Information</div>
                          <p className="text-xs text-gray-500 leading-relaxed">{info.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInput}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default ImageUpload;