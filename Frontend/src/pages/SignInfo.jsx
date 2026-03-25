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
import { motion, AnimatePresence } from "framer-motion";

export default function SignInfo() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredSigns = signInforData.filter((item) => {
    const searchText = search.toLowerCase().trim();
    const name = item.name ? item.name.toLowerCase() : "";
    const desc = item.description ? item.description.toLowerCase() : "";
    const matchesSearch = name.includes(searchText) || desc.includes(searchText);
    const matchesFilter = filterType ? item.type.name === filterType : true;
    return matchesSearch && matchesFilter;
  });

  const uniqueTypes = Array.from(new Set(signInforData.map((item) => item.type.name)));

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

      {/* Search Bar */}
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
          className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <img
          src={searchIcon}
          alt="search"
          className="absolute left-8 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60"
        />

        {showDropdown && search && (
          <motion.div
            className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
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
                  whileHover={{ scale: 1.02, backgroundColor: "#fefce8" }}
                >
                  <img src={item.img} alt={item.name} className="h-10 w-10 object-contain" />
                  <div className="text-left">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-yellow-600 font-semibold">{item.type.name}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-gray-500">No matches found</p>
            )}
          </motion.div>
        )}
      </div>

      {/* Filter Buttons Section */}
      <div className="px-5 flex gap-1.5 flex-wrap mt-4">
        {/* All Button */}
        <motion.div
          className={`flex flex-row rounded py-2 px-3 justify-center items-center gap-1.5 cursor-pointer border transition-all duration-200 ${
            filterType === "" ? "bg-yellow-100 border-yellow-200 text-yellow-800 shadow-sm" : "bg-white border-gray-200 text-gray-600"
          }`}
          onClick={() => setFilterType("")}
          whileHover={{ scale: 1.05, backgroundColor: "#FEF9C3" }}
          whileTap={{ backgroundColor: "#FEFCE8", scale: 0.95 }}
        >
          <img src={Filtering} alt="Filtering" className="w-3 h-3 opacity-70" />
          <div className="text-sm font-medium">All</div>
        </motion.div>

        {/* Dynamic Type Buttons */}
        {uniqueTypes.map((type, index) => (
          <motion.div
            key={index}
            className={`group flex flex-row rounded py-2 px-3 justify-center items-center gap-1.5 cursor-pointer border transition-all duration-200 ${
              filterType === type ? "bg-yellow-100 border-yellow-200 text-yellow-800 shadow-sm" : "bg-white border-gray-200 text-gray-600"
            }`}
            onClick={() => setFilterType(type)}
            whileHover={{ scale: 1.05, backgroundColor: "#FEF9C3" }}
            whileTap={{ backgroundColor: "#FEFCE8", scale: 0.98 }} // Full soft yellow on tap
          >
            <img src={Filtering} alt="Filtering" className="w-3 h-3 opacity-70" />
            <div className="text-sm font-medium">{type}</div>
            
            {/* Tap Icon: Appears only when the button is pressed */}
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileTap={{ opacity: 1, scale: 1 }}
              className="ml-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 px-5">
        {TotalSign.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-xl shadow-sm py-6 px-4 text-center border border-transparent hover:border-yellow-100 transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{item.label}</div>
            <div className="mt-2 font-bold text-3xl text-yellow-500">
              {item.id === 0 ? signInforData.length : item.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Results Count */}
      <div className="px-5 mt-10">
        <p className="text-xl font-medium text-gray-900">
          Showing <span className="text-yellow-600 font-bold">{filteredSigns.length}</span> of <span className="font-bold">{signInforData.length}</span> signs
        </p>
      </div>

      {/* Signs Grid */}
      <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6 px-5 pb-10">
        {filteredSigns.length > 0 ? (
          filteredSigns.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-5 relative flex flex-col gap-4 py-10 border border-gray-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ backgroundColor: "#FEFCE8" }} // Apply softest yellow here too
            >
              <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded">
                {item.type.name}
              </span>
              <img src={item.img} alt={item.name} className="h-20 w-20 object-contain mb-2" />
              <h2 className="font-bold text-xl text-left text-gray-800">{item.name}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))
        ) : (
          <div className="text-gray-500 col-span-full text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
            No signs found matching your search.
          </div>
        )}
      </div>

      {/* How to Identify (Footer Section) */}
      <div className="w-full bg-gray-100 pt-20 pb-20 px-5 border-t border-gray-200">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900">How to Identify</h1>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-10">
          {[
            { icon: Warning_Signs, title: "Warning Signs", type: "Warning", desc: "Alert drivers to potential hazards." },
            { icon: Guide_Signs, title: "Guide Signs", type: "Guide", desc: "Designed to tell you information and locations." },
            { icon: Prohibitory_Signs, title: "Prohibitory Signs", type: "Prohibitory", desc: "Prohibit certain maneuvers or traffic." },
            { icon: Mandatory_Signs, title: "Mandatory Signs", type: "Mandatory", desc: "Required actions you must take." },
            { icon: Give_way_Signs, title: "Informational Signs", type: "Give Way", desc: "Provide guidance about routes." },
            { icon: Give_way_and_stop, title: "Stop And Give Way Signs", type: "Stop And Give Way", desc: "Indicating where you must halt." },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex gap-4 p-6 items-start bg-white rounded-2xl shadow-sm border border-transparent hover:border-yellow-200 transition-all"
              whileTap={{ backgroundColor: "#FEFCE8", scale: 0.98 }}
            >
              <div className="bg-gray-50 p-4 rounded-xl shrink-0">
                <img src={item.icon} alt={item.title} className="w-16 h-auto" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                <span className="text-yellow-600 font-bold text-sm bg-yellow-50 px-2 py-0.5 rounded mt-4 inline-block">
                  {getCount(item.type)} signs available
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}