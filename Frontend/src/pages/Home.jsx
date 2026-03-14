import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next"; // Added hook
import leftArrow from "../assets/Home/arrow-right.svg";
import check from "../assets/Home/check.svg";
import trafficSign from "../assets/Home/trafficSign.png";
import {
  informationdata,
  coreCapabilities,
  howItWorks,
} from "../utils/HomeData.js";
import "../App.css";

function Home() {
  const { t } = useTranslation(); // Initialize translation

  return (
    <div className="relative isolate mt-10 lg:mt-0 w-screen ">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl pt-20 pb-8 sm:pt-26 sm:pb-8 lg:pt-40 lg:pb-10">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="rounded-full px-4 py-1 text-sm font-bold text-amber-500 ring-1 ring-amber-900/10 hover:ring-gray-900/20 bg-amber-100"
            >
              {t("badge")}
            </motion.div>
          </div>

          {/* Main content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="text-5xl [&:lang(kh)]:text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
              {t("heroTitle")}
            </div>

            <p className="mt-6 text-base text-black/60 sm:text-lg">
              {t("heroDescription")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
                <Link
                  to="/detectionCenter"
                  className="flex items-center gap-2 rounded-md bg-amber-300 px-4 py-2 text-sm font-semibold text-black shadow hover:bg-amber-400"
                >
                  <div className="text-black">{t("btnLaunch")}</div>
                  <img src={leftArrow} alt="arrow" className="w-5 h-5" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
                <Link
                  to="/features"
                  className="flex items-center gap-2 rounded-md border border-black px-4 py-2 text-sm font-semibold justify-center hover:bg-amber-100"
                >
                  <div className="text-black">{t("btnExplore")}</div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 5 part show */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full h-px bg-gray-300 my-6"
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mt-10 mb-10 sm:ml-30 sm:mr-30 sm:gap-10 gap-10 p-2 text-amber-400"
      >
        {informationdata.map((item) => (
          <motion.div key={item.id} whileHover={{ scale: 1.05 }} className="flex flex-col items-center text-center">
            <div className="font-bold text-4xl [&:lang(kh)]:text-4xl">
              {item.value.startsWith("val") ? t(`stats.${item.value}`) : item.value}
            </div>
            <div className="text-sm text-black/60">{t(`stats.${item.tKey}`)}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Core Capabilities */}
      <div className="flex flex-col w-full h-auto bg-zinc-100 gap-20 py-20">
        <div className="flex flex-col gap-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="text-black font-bold text-5xl">{t("core.title")}</div>
            <div className="text-black text-lg">
              {t("core.subtitle")}
            </div>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-4 sm:px-12 md:px-16 lg:px-20">
          {coreCapabilities.map((item) => (
            <motion.div 
              key={item.id} 
              whileHover={{ scale: 1.03, y: -3 }} 
              transition={{ type: "spring", stiffness: 300 }}
              className="flex flex-col items-start bg-white text-left p-5 rounded gap-2 shadow"
            >
              <div className="p-3 bg-amber-400 rounded">
                <img src={item.img} alt="icon" className="w-5 h-5" />
              </div>
              <div className="text-black font-bold">{t(`capabilities.${item.tKey}.title`)}</div>
              <p className="text-black/60">{t(`capabilities.${item.tKey}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="w-full h-auto bg-white text-black py-20 px-30">
        <div className="text-5xl font-bold">{t("howItWorksTitle")}</div>
        <div className="grid grid-cols-1 sm:grid-col-2 md:grid-cols-3 gap-12 lg:gap-40 mt-10">
          {howItWorks.map((item) => (
            <motion.div key={item.id} whileHover={{ scale: 1.05 }} className="flex flex-col items-center gap-5">
              <div className="flex justify-center items-center text-3xl font-bold bg-amber-400 rounded-full w-15 h-15">
                <div> {item.number}</div>
              </div>
              <div className="font-bold">{t(`steps.${item.tKey}.title`)}</div>
              <div className="text-black/60">{t(`steps.${item.tKey}.desc`)}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Professional-Grade Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-20 bg-zinc-100 items-stretch text-left">
        <div className="text-black/60 flex flex-col gap-8">
          <h2 className="font-bold text-5xl text-black">
            {t("professional.title")}
          </h2>

          <p>{t("professional.desc")}</p>

          <p>{t("professional.support")}</p>
          <p className="flex gap-0.5">
            <img src={check} alt="check" className="w-5 mr-0.5" />
            {t("professional.f1")}
          </p>
          <p className="flex gap-0.5">
            <img src={check} alt="check " className="w-5 mr-0.5" />
            {t("professional.f2")}
          </p>
          <p className="flex gap-0.5">
            <img src={check} alt="check" className="w-5 mr-0.5"/>
            {t("professional.f3")}
          </p>
          <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
            <Link
              to="/detectionCenter"
              className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2 text-sm font-semibold text-black shadow hover:bg-amber-400 w-fit"
            >
              <div className="text-black">{t("professional.btn")}</div>
            </Link>
          </motion.div>
        </div>

        <div className="flex justify-center h-full">
          <img
            src={trafficSign}
            alt="trafficsign"
            className="h-full w-auto object-contain"
          />
        </div>
      </div>

      {/* Ready to Transform Your Traffic Analysis? */}
      <div className="bg-amber-400 p-15 flex flex-col gap-10 items-center">
        <div className="text-5xl [&:lang(kh)]:text-4xl font-bold text-black">{t("cta.title")}</div>
        <div className="text-black">
          {t("cta.subtitle")}
        </div>
        <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
          <Link
            to="/detectionCenter"
            className="flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black shadow hover:bg-gray-100 w-fit"
          >
            <div className="text-black">{t("cta.btndown")}</div>
            <img src={leftArrow} alt="arrow" className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
      <div className="bg-neutral-100 p-3"></div>
    </div>
  );
}

export default Home;