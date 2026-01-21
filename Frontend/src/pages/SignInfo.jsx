export default function SignInfo() {
  return (
    <div className="bg-[#fafafa] pt-32 pb-24">
      {/* ===== Header ===== */}
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900">
          System Features
        </h1>
        <p className="mt-3 text-gray-500">
          Comprehensive traffic sign detection capabilities powered by advanced
          YOLO technology and intelligent data management systems.
        </p>
      </div>

      {/* ===== Technical Specifications ===== */}
      <div className="mt-20">
        <h2 className="text-2xl font-semibold text-center mb-10 text-gray-900 ">
          Technical Specifications
        </h2>

        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { label: "Detection Model", value: "YOLOv8" },
            { label: "Supported Signs", value: "33+" },
            { label: "Accuracy Rate", value: "95%+" },
            { label: "Input Formats", value: "Images, Video, Streams" },
            { label: "Output Formats", value: "JSON, CSV" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm py-6 px-4 text-center"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="mt-2 font-semibold text-yellow-500">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Features Grid ===== */}
      <div className="mt-20">
        <div className="text-black grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols34 gap-3 sm:gap-6 md:gap-8 lg:gap-10 px-4 sm:px-12 md:px-16 lg:px-20">
          {[
            "Image Detection",
            "Video Detection",
            "Webcam Detection",
            "YOLO Model",
            "Accuracy",
            "Data Validation",
            "Data Export",
            "Multi-Format Support",
            "Signs Information",
          ].map((title, i) => (
            <div
              key={i}
              className="flex flex-col items-start bg-white text-left p-5 rounded gap-2 shadow"
            >
              {/* Icon placeholder */}
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-yellow-600 font-bold">■</span>
              </div>

              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-500 mb-3">
                Process images and video streams instantly with our optimized
                YOLO model for live traffic sign identification.
              </p>

              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 marker:text-amber-400">
                <li> Detection Model</li>
                <li> Detection Model</li>
                <li> Detection Model</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
