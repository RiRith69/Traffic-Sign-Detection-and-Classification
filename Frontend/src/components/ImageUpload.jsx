import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

import upload from "../assets/DetectionCenter/upload.svg";
import { signInforData } from "../utils/SignInfoData";

import { CheckCircle, Trash2, LayoutGrid, Info, FileJson } from "lucide-react";

const signMap = {};
signInforData.forEach((sign) => {
  signMap[sign.id] = sign;
});

function ImageUpload() {
  const { t } = useTranslation();

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

  const startDetection = async () => {
    if (imageList.length === 0) return;

    const updatedImages = [...imageList];

    for (let i = 0; i < updatedImages.length; i++) {
      if (updatedImages[i].status === "Completed") continue;

      setSelectedIdx(i);

      updatedImages[i].status = "Detecting...";
      setImageList([...updatedImages]);

      try {
        const formData = new FormData();
        formData.append("images", updatedImages[i].file);

        const response = await axios.post(
          "http://localhost:5000/api/detect/images",
          formData,
        );

        const detectedResults =
          response.data.results.find(
            (r) => r.filename === updatedImages[i].name,
          )?.results || [];

        updatedImages[i].result = detectedResults.map((d) => ({
          id: d.id,
          confidence: d.confidence,
          bbox: d.bbox,
        }));

        updatedImages[i].status = "Completed";

        setImageList([...updatedImages]);
      } catch (err) {
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

  useEffect(() => {
    if (!currentImg || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const imgElement = new Image();
    imgElement.src = currentImg.url;

    imgElement.onload = () => {
      const maxWidth = 800;
      const scale = Math.min(maxWidth / imgElement.width, 1);

      canvas.width = imgElement.width * scale;
      canvas.height = imgElement.height * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

      if (currentImg.result) {
        currentImg.result.forEach((sign) => {
          const [x1, y1, x2, y2] = sign.bbox.map((v) => v * scale);

          ctx.strokeStyle = "#ef4444"; // Tailwind red-500
          ctx.lineWidth = 3;

          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

          ctx.fillStyle = "#ef4444"; // text color
          ctx.font = "bold 14px sans-serif";

          ctx.fillText(
            `${t(`signs.${sign.id}.name`, sign.id)} ${(sign.confidence * 100).toFixed(1)}%`,
            x1,
            y1 > 20 ? y1 - 8 : y1 + 20,
          );
        });
      }
    };
  }, [currentImg, currentImg?.result, t]);

  if (imageList.length === 0) {
    return (
      <div
        onClick={handleClick}
        className="w-full flex flex-col items-center p-12 rounded-2xl border-2 border-dashed border-neutral-300 gap-5 cursor-pointer hover:bg-neutral-50 transition-all group"
      >
        <img
          src={upload}
          alt="upload"
          className="w-24 h-24 object-contain group-hover:scale-110 transition-transform"
        />

        <div className="text-3xl font-bold text-neutral-800">
          {t("imageDetect.uploadTitle")}
        </div>

        <div className="text-gray-500">
          {t("imageDetect.uploadDescription")}
        </div>

        <div className="text-sm text-gray-400">
          {t("imageDetect.supportFormat")}
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
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT PANEL */}
      <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-neutral-200 h-fit sticky top-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            {t("imageDetect.queue")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 max-h-112.5 overflow-y-auto pr-2 mb-6">
          {imageList.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedIdx(index)}
              className={`relative cursor-pointer rounded-xl overflow-hidden border-2 ${
                selectedIdx === index
                  ? "border-amber-400"
                  : "border-transparent"
              }`}
            >
              <img src={item.url} className="w-full h-24 object-cover" />

              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-[10px] text-white truncate">
                {item.name}
              </div>

              {item.status === "Completed" && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full">
                  <CheckCircle size={12} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={startDetection}
            className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-neutral-900 font-bold rounded-xl"
          >
            {t("imageDetect.startDetection")}
          </button>

          <button
            onClick={handleClick}
            className="w-full py-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-semibold rounded-xl border"
          >
            {t("imageDetect.addMore")}
          </button>

          <button
            onClick={handleCleanAll}
            className="w-full py-2 text-neutral-400 hover:text-red-500 text-xs flex items-center justify-center gap-2"
          >
            <Trash2 size={14} />
            {t("imageDetect.cleanAll")}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white border rounded-2xl p-6">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold truncate">{currentImg?.name}</h3>
          </div>

          <div className="flex items-center justify-center bg-neutral-50 rounded-xl min-h-100">
            {currentImg ? (
              <canvas ref={canvasRef} className="max-w-full rounded-lg" />
            ) : (
              <div className="text-center text-neutral-400">
                <LayoutGrid size={48} className="mx-auto mb-2 opacity-20" />
                <p>{t("imageDetect.selectImage")}</p>
              </div>
            )}
          </div>
        </div>

        {currentImg?.status === "Completed" && (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle className="text-emerald-500" />
              <div>
                <p className="text-emerald-800 font-bold">
                  {t("imageDetect.success")}
                </p>
                <p className="text-emerald-600 text-xs">
                  {t("imageDetect.detectedSigns", {
                    count: currentImg.result?.length || 0,
                  })}
                </p>
              </div>
            </div>

            <div className="bg-white border rounded-2xl overflow-hidden">
              <div className="p-5 border-b">
                <h4 className="font-bold flex items-center gap-2">
                  <Info size={18} />
                  {t("imageDetect.signInfo")}
                </h4>
              </div>

              <div className="p-6 space-y-6">
                {currentImg.result?.map((det, idx) => (
                  <div key={idx}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-6 bg-amber-400 rounded-full"></div>

                      <span className="font-bold">
                        {t(`signs.${det.id}.name`, det.id)}
                      </span>

                      <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded">
                        {(det.confidence * 100).toFixed(1)}%
                      </span>
                    </div>

                    <p className="text-sm text-neutral-500 pl-3 border-l">
                      {t(`signs.${det.id}.desc`)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-neutral-50 border-t">
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-amber-400 font-bold rounded-xl">
                  <FileJson size={18} />
                  {t("imageDetect.exportJson")}
                </button>
              </div>
            </div>
          </div>
        )}
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
