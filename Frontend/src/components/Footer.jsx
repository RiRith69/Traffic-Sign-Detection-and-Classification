import "../App.css";
import { Link } from "react-router-dom";
import logoFooter from "../assets/Footer/logo-footer.png";
import discord from "../assets/Footer/discord.svg";
import facebook from "../assets/Footer/facebook.svg";
import telegram from "../assets/Footer/telegram.svg";

function Footer() {
  return (
    <footer className="w-full text-black">
      <div className="bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 sm:px-10 lg:px-20 py-8">
        <div className="flex flex-col gap-2 text-center lg:text-left">
          <img
            src={logoFooter}
            alt="logoFooter"
            className="w-50 mx-auto lg:mx-0"
          />
          <p className="text-sm text-black/70 font-semibold">
            Khmer YOLO-powered traffic sign detection system.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-center lg:text-left">
          <h4 className="font-bold">Product</h4>
          <Link to="/detectionCenter">Detection Center</Link>
          <Link to="/features">Features</Link>
          <Link to="/signInfo">Sign Database</Link>
        </div>
        <div className="flex flex-col gap-3 text-center lg:text-left ">
          <h4 className="font-bold">Get in touch</h4>
          <div className="flex justify-center lg:justify-start gap-5">
            <Link to=""><img src={discord} alt="discord" /></Link>
            <Link to=""><img src={facebook} alt="facebook" /></Link>
            <Link to=""><img src={telegram} alt="telegram" /></Link>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-center lg:text-left">
          <h4 className="font-bold">Team</h4>
          <Link to="">GitHub</Link>
          <Link to="">Telegram</Link>
          <Link to="">Google Meet</Link>
        </div>
      </div>
      <div className="bg-amber-400 py-3 text-center text-sm font-semibold">
        © 2025 TrafficSign. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
