import { useRef, useState, useEffect } from "react";
import axios from "axios";
import upload from "../assets/DetectionCenter/upload.svg";
import { signInforData } from "../utils/SignInfoData";
import { CheckCircle, Trash2, LayoutGrid, Info, FileJson } from "lucide-react";

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
      file.type.startsWith("image/")
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
        const response = await axios.post("http://localhost:5000/api/detect/images", formData);
        const detectedResults = response.data.results.find((r) => r.filename === updatedImages[i].name)?.results || [];

        updatedImages[i].result = detectedResults.map((d) => ({
          ...signMap[d.id],
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
      // Calculate display size while maintaining aspect ratio
      const maxWidth = 800;
      const scale = Math.min(maxWidth / imgElement.width, 1);
      canvas.width = imgElement.width * scale;
      canvas.height = imgElement.height * scale;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

      if (currentImg.result) {
        currentImg.result.forEach((sign) => {
          const [x1, y1, x2, y2] = sign.bbox.map(val => val * scale);
          ctx.strokeStyle = "#f3cc4c";
          ctx.lineWidth = 3;
          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
          
          ctx.fillStyle = "#f3cc4c";
          ctx.font = "bold 14px sans-serif";
          ctx.fillText(`${sign.name} ${(sign.confidence * 100).toFixed(1)}%`, x1, y1 > 20 ? y1 - 8 : y1 + 20);
        });
      }
    };
  }, [currentImg, currentImg?.result]);

  // --- UI RENDER LOGIC ---

  // STEP 1: IDLE (D1)
  if (imageList.length === 0) {
    return (
      <div
        onClick={handleClick}
        className="w-full flex flex-col items-center p-12 rounded-2xl border-2 border-dashed border-neutral-300 gap-5 cursor-pointer hover:bg-neutral-50 transition-all group"
      >
        <img src={upload} alt="upload" className="w-24 h-24 object-contain group-hover:scale-110 transition-transform" />
        <div className="text-3xl font-bold text-neutral-800">Upload Image</div>
        <div className="text-gray-500">Detection traffic sign in static images</div>
        <div className="text-sm text-gray-400">Support formats: JPG, PNG (Max 100MB)</div>
        <input ref={fileInput} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
    );
  }

  // STEP 2 & 3: QUEUE & RESULTS (D2, D3, D4)
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
      
      {/* Left Column: Upload Queue */}
      <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-neutral-200 h-fit sticky top-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">Upload Queue <span className="bg-neutral-100 text-neutral-400 text-xs px-2 py-0.5 rounded-full">{imageList.length}</span></h2>
        </div>

        <div className="grid grid-cols-1 gap-3 max-h-112.5 overflow-y-auto pr-2 mb-6 custom-scrollbar">
          {imageList.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedIdx(index)}
              className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                selectedIdx === index ? "border-amber-400 ring-4 ring-amber-50" : "border-transparent hover:border-neutral-200"
              }`}
            >
              <img src={item.url} className="w-full h-24 object-cover" alt="thumb" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5 text-[10px] text-white truncate">
                {item.name}
              </div>
              {item.status === "Completed" && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                  <CheckCircle size={12} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button onClick={startDetection} className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-neutral-900 font-bold rounded-xl shadow-md transition-all active:scale-[0.98]">
            Start Detection
          </button>
          <button onClick={handleClick} className="w-full py-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-semibold rounded-xl border border-neutral-200 text-sm transition-all">
            Add More Images
          </button>
          <button onClick={handleCleanAll} className="w-full py-2 text-neutral-400 hover:text-red-500 text-xs font-medium flex items-center justify-center gap-2">
            <Trash2 size={14} /> Clean All
          </button>
        </div>
      </div>

      {/* Right Column: Main View & Results */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Image Display */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b pb-4 border-neutral-50">
            <div className="flex items-center gap-2">
               <h3 className="font-bold text-neutral-800 truncate max-w-50">{currentImg?.name}</h3>
               <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                 currentImg?.status === "Completed" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
               }`}>
                 {currentImg?.status}
               </span>
            </div>
          </div>

          <div className="flex items-center justify-center bg-neutral-50 rounded-xl overflow-hidden min-h-100">
            {currentImg ? (
              <canvas ref={canvasRef} className="max-w-full rounded-lg shadow-sm" />
            ) : (
              <div className="text-center text-neutral-400">
                <LayoutGrid size={48} className="mx-auto mb-2 opacity-20" />
                <p>Select an image to view results</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel (D4) */}
        {currentImg?.status === "Completed" && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-4">
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle className="text-emerald-500" />
              <div>
                <p className="text-emerald-800 font-bold">Detection Successful</p>
                <p className="text-emerald-600 text-xs">{currentImg.result?.length || 0} traffic signs identified and classified</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl border border-neutral-200">
                <p className="text-xs text-neutral-400 font-medium mb-1 uppercase tracking-wider">Average Confidence</p>
                <p className="text-3xl font-black text-amber-400">
                  {currentImg.result?.length > 0 
                    ? (currentImg.result.reduce((s, r) => s + r.confidence, 0) / currentImg.result.length * 100).toFixed(1)
                    : "0.0"}%
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-neutral-200">
                <p className="text-xs text-neutral-400 font-medium mb-1 uppercase tracking-wider">Total Detections</p>
                <p className="text-3xl font-black text-amber-400">{currentImg.result?.length || 0}</p>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-neutral-100 bg-neutral-50/50">
                <h4 className="font-bold text-neutral-800 flex items-center gap-2"><Info size={18} /> Sign Information</h4>
              </div>
              <div className="p-6 space-y-6">
                {currentImg.result?.map((det, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-6 bg-amber-400 rounded-full"></div>
                      <span className="font-bold text-neutral-800">{det.name}</span>
                      <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded">
                        {(det.confidence * 100).toFixed(1)}% Match
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 leading-relaxed pl-3.5 border-l border-neutral-100">
                      {det.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-neutral-50 border-t border-neutral-100">
                 <button className="w-full flex items-center justify-center gap-2 py-3 bg-amber-400 text-neutral-900 font-bold rounded-xl hover:bg-amber-500 transition-colors">
                   <FileJson size={18} /> Export as JSON
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <input ref={fileInput} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}

export default ImageUpload;