import searchIcon from "../assets/SignInformation/Search.svg";
import Filtering from "../assets/SignInformation/filter.svg";
import { signInforData, TotalSign } from "../utils/SignInfoData";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../App.css";
import { motion } from "framer-motion";

export default function SignInfo() {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Filtered signs
  const filteredSigns = signInforData.filter((item) => {
    const searchText = search.toLowerCase().trim();

    const name = t(item.nameKey).toLowerCase();
    const desc = t(item.descriptionKey).toLowerCase();

    const matchesSearch =
      name.includes(searchText) || desc.includes(searchText);

    const matchesFilter = filterType ? item.type.key === filterType : true;

    return matchesSearch && matchesFilter;
  });

  const uniqueTypes = Array.from(
    new Set(signInforData.map((item) => item.type.key)),
  );

  const getCount = (typeKey) => {
    return signInforData.filter((item) => item.type.key === typeKey).length;
  };

  return (
    <div className="text-black w-screen pt-40 bg-zinc-50 min-h-screen">
      {/* Header */}
      <motion.div
        className="w-full px-4 py-10 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-7xl font-bold text-gray-900">
          {t("signPage.title")}
        </div>

        <p className="text-gray-500 mt-6 max-w-2xl mx-auto">
          {t("signPage.description")}
        </p>
      </motion.div>

      <div className="w-full h-px bg-gray-300 my-6"></div>

      {/* Search */}
      <div className="w-full bg-white px-5 relative">
        <input
          type="text"
          value={search}
          placeholder={t("signPage.search")}
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
            className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {filteredSigns.length > 0 ? (
              filteredSigns.slice(0, 10).map((item) => (
                <motion.div
                  key={item.id}
                  onClick={() => {
                    setSearch(t(item.nameKey));
                    setShowDropdown(false);
                  }}
                  className="flex gap-3 items-start px-3 py-2 cursor-pointer hover:bg-gray-100"
                >
                  <img
                    src={item.img}
                    alt={t(item.nameKey)}
                    className="h-10 w-10 object-contain"
                  />

                  <div className="text-left">
                    <p className="font-medium">{t(item.nameKey)}</p>

                    <p className="text-xs text-gray-500 line-clamp-2">
                      {t(item.descriptionKey)}
                    </p>

                    <p className="text-xs text-blue-500">{t(item.type.key)}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-gray-500">
                {t("signPage.noMatch")}
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="px-5 flex gap-1.5 flex-wrap mt-4">
        <motion.div
          className={`flex flex-row bg-white rounded py-2 px-2 items-center gap-1 cursor-pointer ${
            filterType === "" ? "bg-blue-100" : ""
          }`}
          onClick={() => setFilterType("")}
        >
          <img src={Filtering} alt="Filtering" className="w-3 h-3" />
          <div>{t("signPage.all")}</div>
        </motion.div>

        {uniqueTypes.map((type, index) => (
          <motion.div
            key={index}
            className={`flex flex-row bg-white rounded py-2 px-2 items-center gap-1 cursor-pointer ${
              filterType === type ? "bg-blue-100" : ""
            }`}
            onClick={() => setFilterType(type)}
          >
            <img src={Filtering} alt="Filtering" className="w-3 h-3" />
            <div>{t(type)}</div>
          </motion.div>
        ))}
      </div>

      {/* Total Info */}
      <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 px-5">
        {TotalSign.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-xl shadow-sm py-6 px-4 text-center"
          >
            <div className="text-sm text-gray-500">{t(item.labelKey)}</div>

            <div className="mt-2 font-semibold text-2xl text-yellow-500">
              {item.id === 1 ? signInforData.length : item.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Results Count */}
      <motion.div className="px-5 mt-10">
        <p className="text-xl font-medium text-gray-900">
          {t("signPage.showing", {
            current: filteredSigns.length,
            total: signInforData.length,
          })}
        </p>
      </motion.div>

      {/* Signs Grid */}
      <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6 px-5 pb-10 text-left">
        {filteredSigns.length > 0 ? (
          filteredSigns.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-5 relative flex flex-col gap-4 py-10"
            >
              <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-600 text-xs font-semibold px-2 py-1 rounded">
                {t(item.type.key)}
              </span>

              <img
                src={item.img}
                alt={t(item.nameKey)}
                className="h-16 w-16 object-contain"
              />

              <h2 className="font-bold text-xl text-left">{t(item.nameKey)}</h2>

              <p className="text-gray-600 text-sm">{t(item.descriptionKey)}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            {t("signPage.noSigns")}
          </p>
        )}
      </div>
    </div>
  );
}
