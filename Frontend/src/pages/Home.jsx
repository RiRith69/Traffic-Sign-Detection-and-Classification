import { NavLink } from "react-router-dom";
import leftArrow from "../assets/arrow-right.svg";
import "../App.css";
function Home() {
  return (
    <div class="relative isolate px-6 lg:px-8">
      <div className="px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-24 sm:py-32 lg:py-40">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="rounded-full px-4 py-1 text-sm font-bold text-amber-300 ring-1 ring-amber-900/10 hover:ring-gray-900/20 bg-amber-100">
              Yolo-Powered Traffic Sign Detection
            </div>
          </div>

          {/* Main content */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Khmer Traffic Sign <br></br> Detection System
            </h1>

            <p className="mt-6 text-base text-gray-500 sm:text-lg">
              This system uses YOLO-based deep learning to detect and classify
              Khmer traffic signs from images and videos. It helps drivers,
              researchers, and intelligent transport systems understand road
              signs accurately and improve road safety.
            </p>

            <div className="mt-8 flex items-center justify-center gap-x-6">
              <NavLink
                to="/detectionCenter"
                className="flex items-center gap-2 rounded-md bg-amber-300 px-4 py-2 text-sm font-semibold text-black shadow hover:bg-amber-400"
              >
                <div className="text-black">Launch Detection Center</div>
                <img src={leftArrow} alt="arrow" className="w-5 h-5" />
              </NavLink>

              <NavLink
                to="features"
                className="flex items-center gap-2 rounded-md border border-black px-4 py-2 text-sm font-semibold justify-center hover:bg-amber-100"
              >
                <div className="text-black">Explore Feature</div>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
