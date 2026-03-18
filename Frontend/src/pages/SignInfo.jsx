import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

// Asset Imports
import searchIcon from "../assets/SignInformation/Search.svg";
import Filtering from "../assets/SignInformation/filter.svg";
import Warning_Signs from "../assets/SignInformation/Warning_Signs.svg";
import Guide_Signs from "../assets/SignInformation/Guide_Sign.svg";
import Give_way_Signs from "../assets/SignInformation/Give_way.svg";
import Give_way_and_stop from "../assets/SignInformation/stop.svg";
import Mandatory_Signs from "../assets/SignInformation/Mandatory_Signs.svg";
import Prohibitory_Signs from "../assets/SignInformation/Prohibitory_Signs.svg";

// Data Imports
import { signInforData } from "../utils/SignInfoData";
import "../App.css";

export default function SignInfo() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  // --- SOFTEST YELLOW PALETTE ---
  const ultraSoftYellow = "#fefce8"; // Background (Yellow-50)
  const softBorder = "#fef08a";      // Active Border (Yellow-200)
  const hoverGray = "#f9fafb";       // Very light gray for non-active hover

  // Filter Logic
  const filteredSigns = useMemo(() => {
    return signInforData.filter((item) => {
      const searchText = search.toLowerCase().trim();
      const name = item.name ? item.name.toLowerCase() : "";
      const desc = item.description ? item.description.toLowerCase() : "";
      const matchesSearch = name.includes(searchText) || desc.includes(searchText);
      const matchesFilter = filterType ? item.type.name === filterType : true;
      return matchesSearch && matchesFilter;
    });
  }, [search, filterType]);

  const uniqueTypes = Array.from(new Set(signInforData.map((item) => item.type.name)));

  // Helper to get correct icon for the filter buttons
  const getIconForType = (type) => {
    const t = type.toLowerCase();
    if (t.includes("warning")) return Warning_Signs;
    if (t.includes("guide")) return Guide_Signs;
    if (t.includes("prohibitory")) return Prohibitory_Signs;
    if (t.includes("mandatory")) return Mandatory_Signs;
    if (t.includes("give way")) return Give_way_Signs;
    if (t.includes("stop")) return Give_way_and_stop;
    return Filtering;
  };

  return (
    <div className="text-black w-screen pt-20 bg-zinc-50 min-h-screen font-sans">
      {/* Header Section */}
      <motion.div
        className="w-full px-4 py-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight">
          Explore Information <br /> <span className="text-gray-400">About Signs</span>
        </h1>
      </motion.div>

      {/* Search Input Container */}
      <div className="max-w-4xl mx-auto px-5 relative mb-8">
        <div className="relative group">
          <input
            type="text"
            value={search}
            placeholder="Search traffic signs..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-200 transition-all"
          />
          <img
            src={searchIcon}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 opacity-40 group-focus-within:opacity-100 transition-opacity"
            alt="search"
          />
        </div>
      </div>

      {/* Filter Buttons Section */}
      <div className="max-w-6xl mx-auto px-5 flex gap-3 flex-wrap select-none justify-center">
        {/* All Button */}
        <motion.div
          className="flex items-center gap-2 bg-white rounded-xl py-2.5 px-5 cursor-pointer border shadow-sm transition-colors"
          onClick={() => setFilterType("")}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98, backgroundColor: ultraSoftYellow }}
          animate={{
            backgroundColor: filterType === "" ? ultraSoftYellow : "#ffffff",
            borderColor: filterType === "" ? softBorder : "#f3f4f6",
          }}
        >
          <img src={Filtering} className="w-4 h-4 opacity-60" alt="all" />
          <span className="text-sm font-bold text-gray-700">All Signs</span>
        </motion.div>

        {/* Dynamic Buttons */}
        {uniqueTypes.map((type, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-2 bg-white rounded-xl py-2.5 px-5 cursor-pointer border shadow-sm"
            onClick={() => setFilterType(type)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98, backgroundColor: ultraSoftYellow }}
            animate={{
              backgroundColor: filterType === type ? ultraSoftYellow : "#ffffff",
              borderColor: filterType === type ? softBorder : "#f3f4f6",
            }}
          >
            <img src={getIconForType(type)} className="w-5 h-5 object-contain" alt={type} />
            <span className="text-sm font-bold text-gray-700">{type}</span>
          </motion.div>
        ))}
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-12 px-5 pb-20">
        {filteredSigns.length > 0 ? (
          filteredSigns.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="bg-white rounded-3xl shadow-sm p-8 relative flex flex-col gap-5 border border-gray-100 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ y: -5, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
              whileTap={{ backgroundColor: ultraSoftYellow }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex justify-between items-start">
                <div className="bg-zinc-50 p-4 rounded-2xl">
                  <img src={item.img} alt={item.name} className="h-16 w-16 object-contain" />
                </div>
                <span className="bg-zinc-100 text-gray-500 text-[10px] uppercase font-black px-3 py-1 rounded-full tracking-tighter">
                  {item.type.name}
                </span>
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-800 mb-2">{item.name}</h2>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-400 font-medium">
            No signs found matching your search.
          </div>
        )}
      </div>

      {/* Categories Overview Section */}
      <div className="bg-white border-t border-gray-100 py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Sign Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Warning_Signs, title: "Warning Signs", desc: "Alert drivers to potential hazards ahead." },
              { icon: Guide_Signs, title: "Guide Signs", desc: "Provide directions and distance information." },
              { icon: Prohibitory_Signs, title: "Prohibitory Signs", desc: "Indicate actions that are strictly forbidden." },
              { icon: Mandatory_Signs, title: "Mandatory Signs", desc: "Display instructions that must be followed." },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex gap-5 p-8 items-center bg-zinc-50 rounded-3xl cursor-pointer border border-transparent"
                whileTap={{ backgroundColor: ultraSoftYellow, borderColor: softBorder }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  <img src={item.icon} className="w-10 h-10 object-contain" alt={item.title} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}