import data from "../assets/Home/data.svg";
import img from "../assets/Home/img.svg";
import lighting from "../assets/Home/lighting.svg";
import security from "../assets/Home/security.svg";

export const informationdata = [
  { id: 1, value: "95%+", tKey: "stat1" },
  { id: 2, value: "40+",   tKey: "stat2" },
  { id: 3, value: "valImage", tKey: "stat3" }, 
  { id: 4, value: "valRealTime", tKey: "stat4" },
  { id: 5, value: "valValidated", tKey: "stat5" }
];

export const coreCapabilities = [
  { id: 1, tKey: "cap1", img: img },
  { id: 2, tKey: "cap2", img: lighting },
  { id: 3, tKey: "cap3", img: security },
  { id: 4, tKey: "cap4", img: data }
];

export const howItWorks = [
  { id: 1, number: 1, tKey: "step1" },
  { id: 2, number: 2, tKey: "step2" },
  { id: 3, number: 3, tKey: "step3" }
];