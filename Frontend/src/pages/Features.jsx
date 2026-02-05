import "../App.css";
import {featuresData , technicalSpecifications} from "../utils/FeaturesData.js";

function Features() {
  return (
    <div className="pt-32 text-center text-black w-screen bg-zinc-50">
      {/* ===== Header ===== */}
      <div className="w-full h-full text-center px-4 py-16 bg-zinc-50">
        <div className="text-5xl font-bold text-gray-900">System Features</div>
        <p className="mt-3 text-gray-500">
          Comprehensive traffic sign detection capabilities powered by advanced
          YOLO technology and intelligent data management systems.
        </p>
      </div>

      {/* ===== Technical Specifications ===== */}
      <div className="mt-20 bg-zinc-100 py-16">
        <h2 className="text-4xl font-semibold text-center mb-10 text-gray-900">
          Technical Specifications
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {technicalSpecifications.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm py-6 px-4 text-center"
            >
              <div className="text-sm text-gray-500">{item.label}</div>
              <div className="mt-2 font-semibold text-2xl text-yellow-500">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Features Grid ===== */}
      <div className="py-20 bg-zinc-50">
        <div className="text-black grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8 lg:gap-10 px-4 sm:px-12 md:px-16 lg:px-20">
          {featuresData.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-start bg-white text-left p-5 rounded gap-2 shadow"
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-6 h-6"
                />
              </div>

              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-3">
                {item.description}
              </p>

              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 marker:text-amber-400">
                <li>{item.DectectionModel1}</li>
                <li>{item.DectectionModel2}</li>
                <li>{item.DectectionModel3}</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;
