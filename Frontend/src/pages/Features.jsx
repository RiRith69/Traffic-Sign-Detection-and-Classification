import "../App.css";
import { featuresData, technicalSpecifications } from "../utils/FeaturesData.js";
import { motion } from "framer-motion";

function Features() {
  return (
    <div className="pt-32 text-black w-screen bg-zinc-50">

      {/* ===== Header ===== */}
      <motion.div
        className="w-full text-center px-4 py-16"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-7xl font-bold text-gray-900">System Features</div>
        <p className="mt-6 text-gray-500 max-w-3xl mx-auto">
          Comprehensive traffic sign detection capabilities powered by advanced
          YOLO technology and intelligent data management systems.
        </p>
      </motion.div>

      {/* ===== Technical Specifications ===== */}
      <motion.div
        className="mt-20 bg-zinc-100 py-16"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-4xl font-semibold text-center mb-10 text-gray-900">
          Technical Specifications
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4">
          {technicalSpecifications.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-sm py-6 px-4 text-center cursor-pointer"
              whileHover={{
                scale: 1.03,
                y: -3
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-sm text-gray-500">{item.label}</div>
              <div className="mt-2 font-semibold text-2xl text-yellow-500">
                {item.value}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===== Features Grid ===== */}
      <motion.div
        className="py-20 bg-zinc-50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-12 md:px-16 lg:px-20">
          {featuresData.map((item) => (
            <motion.div
              key={item.id}
              className="flex flex-col items-start bg-white p-5 rounded-lg gap-3 shadow cursor-pointer"
              whileHover={{ scale: 1.03, y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <img src={item.icon} alt={item.title} className="w-6 h-6" />
              </div>

              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>

              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 marker:text-amber-400">
                {item.DectectionModel1 && <li>{item.DectectionModel1}</li>}
                {item.DectectionModel2 && <li>{item.DectectionModel2}</li>}
                {item.DectectionModel3 && <li>{item.DectectionModel3}</li>}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Features;