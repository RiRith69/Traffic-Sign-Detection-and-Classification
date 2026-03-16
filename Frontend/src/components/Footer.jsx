import "../App.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Added for translation
import logoFooter from "../assets/Footer/logo-footer.png";
import discord from "../assets/Footer/discord.svg";
import facebook from "../assets/Footer/facebook.svg";
import telegram from "../assets/Footer/telegram.svg";
import { motion } from "framer-motion";

function Footer() {
  const { t } = useTranslation(); // Added Hook

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  return (
    <footer className="w-full text-black">
      <div className="bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 sm:px-10 lg:px-20 py-8">
        <motion.div
          className="flex flex-col gap-2 text-center lg:text-left"
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={footerVariants}
        >
          <img
            src={logoFooter}
            alt="logoFooter"
            className="w-50 mx-auto lg:mx-0"
          />
          <p className="text-sm text-black/70 font-semibold leading-relaxed">
            {t("footer.description")}
          </p>
        </motion.div>

        {/* Updated Product Column */}
        <motion.div
          className="flex flex-col gap-2 text-center lg:text-left"
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={footerVariants}
        >
          <h4 className="font-bold mb-1">{t("footer.product")}</h4>
          <Link to="/detectionCenter" className="leading-loose">{t("nav.detection")}</Link>
          <Link to="/features" className="leading-loose">{t("nav.features")}</Link>
          <Link to="/signInfo" className="leading-loose">{t("nav.info")}</Link>
        </motion.div>

        <motion.div
          className="flex flex-col gap-3 text-center lg:text-left"
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={footerVariants}
        >
          <h4 className="font-bold">{t("footer.getInTouch")}</h4>
          <div className="flex justify-center lg:justify-start gap-5">
            <Link to="">
              <img src={discord} alt="discord" className="hover:scale-110 transition-transform" />
            </Link>
            <Link to="">
              <img src={facebook} alt="facebook" className="hover:scale-110 transition-transform" />
            </Link>
            <Link to="">
              <img src={telegram} alt="telegram" className="hover:scale-110 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col gap-2 text-center lg:text-left"
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={footerVariants}
        >
          <h4 className="font-bold">{t("footer.team")}</h4>
          <Link to="">GitHub</Link>
          <Link to="">Telegram</Link>
          <Link to="">Google Meet</Link>
        </motion.div>
      </div>

      <motion.div
        className="bg-amber-400 py-3 text-center text-sm font-semibold"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
       © 2025 Traffic Sign. All rights reserved.
      </motion.div>
    </footer>
  );
}

export default Footer;