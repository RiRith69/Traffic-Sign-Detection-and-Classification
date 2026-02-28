import searchIcon from "../assets/SignInformation/Search.svg";
import Filtering from "../assets/SignInformation/filter.svg";
import { signInforData, TotalSign } from "../utils/SignInfoData";
import Warning_Signs from "../assets/SignInformation/Warning_Signs.svg";
import Guide_Signs from "../assets/SignInformation/Guide_Sign.svg";
import Give_way_Signs from "../assets/SignInformation/Give_way.svg";
import Give_way_and_stop from "../assets/SignInformation/stop.svg";
import Mandatory_Signs from "../assets/SignInformation/Mandatory_Signs.svg";
import Prohibitory_Signs from "../assets/SignInformation/Prohibitory_Signs.svg";
import { useState } from "react";
import "../App.css";
import { motion } from "framer-motion";

export default function SignInfo() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Filtered signs based on search + filter
  const filteredSigns = signInforData.filter((item) => {
    const searchText = search.toLowerCase().trim();
    const name = item.name ? item.name.toLowerCase() : "";
    const desc = item.description ? item.description.toLowerCase() : "";
    const matchesSearch =
      name.includes(searchText) || desc.includes(searchText);
    const matchesFilter = filterType ? item.type.name === filterType : true;
    return matchesSearch && matchesFilter;
  });

  // Get unique types for filter buttons
  const uniqueTypes = Array.from(
    new Set(signInforData.map((item) => item.type.name))
  );

  // Helper function to get real-time count per category
  const getCount = (typeName) => {
    return signInforData.filter((item) => item.type.name === typeName).length;
  };

  return (
    <div className="text-black w-screen pt-20 bg-zinc-50 min-h-screen">
      {/* Header */}
      <motion.div
        className="w-full px-4 py-10 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-7xl font-bold text-gray-900">
          Explore Information <br /> About Signs
        </div>
        <p className="text-gray-500 mt-6 max-w-2xl mx-auto">
          Comprehensive reference catalog of traffic signs in our system, with
          detailed meanings, regulations, and classification information.
        </p>
      </motion.div>

      <div className="w-full h-px bg-gray-300 my-6"></div>

      {/* Search */}
      <div className="w-full bg-white px-5 relative">
        <input
          type="text"
          value={search}
          placeholder="Search by sign name, or meaning..."
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => search && setShowDropdown(true)}
          className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <img
          src={searchIcon}
          alt="search"
          className="absolute left-8 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60"
        />

        {showDropdown && search && (
          <motion.div
            className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-x-hidden overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredSigns.length > 0 ? (
              filteredSigns.slice(0, 10).map((item) => (
                <motion.div
                  key={item.id}
                  onClick={() => {
                    setSearch(item.name);
                    setShowDropdown(false);
                  }}
                  className="flex gap-3 items-start px-3 py-2 cursor-pointer hover:bg-gray-100"
                  whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="h-10 w-10 object-contain"
                  />
                  <div className="text-left">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-xs text-blue-500">{item.type.name}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-gray-500">
                No matches found
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Filter Buttons with Hover Animation */}
      <div className="px-5 flex gap-1.5 flex-wrap mt-4">
        {/* All Button */}
        <motion.div
          className={`flex flex-row bg-white rounded py-2 px-2 justify-center items-center gap-0.5 cursor-pointer ${
            filterType === "" ? "bg-blue-100" : ""
          }`}
          onClick={() => setFilterType("")}
          whileHover={{ scale: 1.05, backgroundColor: "#e0f2ff" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img src={Filtering} alt="Filtering" className="w-3 h-3" />
          <div>All</div>
        </motion.div>

        {uniqueTypes.map((type, index) => (
          <motion.div
            key={index}
            className={`flex flex-row bg-white rounded py-2 px-2 justify-center items-center gap-0.5 cursor-pointer ${
              filterType === type ? "bg-blue-100" : ""
            }`}
            onClick={() => setFilterType(type)}
            whileHover={{ scale: 1.05, backgroundColor: "#e0f2ff" }}
            transition={{ type: "spring", stiffness: 300, delay: index * 0.03 }}
          >
            <img src={Filtering} alt="Filtering" className="w-3 h-3" />
            <div>{type}</div>
          </motion.div>
        ))}
      </div>

      {/* Total Info */}
      <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 px-5">
        {TotalSign.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-xl shadow-sm py-6 px-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, delay: item.id * 0.05 }}
          >
            <div className="text-sm text-gray-500">{item.label}</div>
            <div className="mt-2 font-semibold text-2xl text-yellow-500">
              {item.id === 0 ? signInforData.length : item.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Results Count Label */}
      <motion.div
        className="px-5 mt-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="text-xl font-medium text-gray-900">
          Showing <span className="font-bold">{filteredSigns.length}</span> of{" "}
          <span className="font-bold">{signInforData.length}</span> signs
        </p>
      </motion.div>

      {/* Signs Grid */}
      <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 pt-6 px-5 pb-10 pr-10">
        {filteredSigns.length > 0 ? (
          filteredSigns.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-5 relative flex flex-col gap-4 py-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -3 }}
              transition={{ type: "spring", stiffness: 300, delay: index * 0.03 }}
            >
              <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-600 text-xs font-semibold px-2 py-1 rounded">
                {item.type.name}
              </span>
              <img
                src={item.img}
                alt={item.name}
                className="h-16 w-16 object-contain mb-2"
              />
              <h2 className="font-bold text-xl text-left">{item.name}</h2>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No signs found.
          </p>
        )}
      </div>

      {/* How to Identify */}
      <div className="w-full bg-gray-100 pt-20 pb-20 px-5 border-t border-gray-200">
        <div className="text-center mb-12">
          <motion.h1
            className="text-5xl font-bold text-gray-900"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            How to Identify
          </motion.h1>
          <motion.p
            className="text-black mt-2 max-w-2xl mx-auto text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Understanding traffic sign categories and what information is
            available for each
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-10 text-left justify-center ">
          {[
            { icon: Warning_Signs, title: "Warning Signs", type: "Warning", desc: "Alert drivers to potential hazards. Typically yellow diamond-shaped with black symbols." },
            { icon: Guide_Signs, title: "Guide Signs", type: "Guide", desc: "Designed to tell you information, directions, and locations to help you navigate safely." },
            { icon: Prohibitory_Signs, title: "Prohibitory Signs", type: "Prohibitory", desc: "Prohibit certain maneuvers or traffic. Noted by red circles with slashes or solid borders." },
            { icon: Mandatory_Signs, title: "Mandatory Signs", type: "Mandatory", desc: "Required actions you must take. Usually white symbols on a blue circular background." },
            { icon: Give_way_Signs, title: "Informational Signs", type: "Give Way", desc: "Provide guidance about routes and services. Typically blue or green rectangles." },
            { icon: Give_way_and_stop, title: "Stop And Give WaySigns", type: "Stop And Give Way", desc: "Provide guidance about routes and services. Typically blue or green rectangles." },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex gap-4 p-4 items-start bg-white rounded-2xl shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -3 }}
              transition={{ type: "spring", stiffness: 300, delay: index * 0.05 }}
            >
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center">
                <img src={item.icon} alt={item.title} className="w-16 h-auto" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                <p className="text-gray-500 text-xs mt-3 font-medium">
                  Sign Count: {getCount(item.type)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}