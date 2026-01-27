import data from "../assets/Home/data.svg";
import img from "../assets/Home/img.svg";
import lighting from "../assets/Home/lighting.svg";
import security from "../assets/Home/security.svg";

export const informationdata = [
  {
    id: 1,
    value: "95%+",
    label: "Detection Accuracy"
  },
  {
    id: 2,
    value: "33+",
    label: "Sign Types"
  },
  {
    id: 3,
    value: "Image",
    label: "Processing"
  },
  {
    id: 4,
    value: "Real-Time",
    label: "Processing"
  },
  {
    id: 5,
    value: "Validated",
    label: "Data Output"
  }
];


export const coreCapabilities = [
  {
    id: 1,
    title: "Image Detection",
    description:"Process images and video streams instantly with our optimized YOLO model for live traffic sign identification.",
    img: img, 
  },
   {
    id: 2,
    title: "Real-Time Detection",
    description:"Automatically fetch verified information for detected signs from our comprehensive database.",
    img: lighting, 
  },
   {
    id: 3,
    title: "Data Validation",
    description:"Validate detection outputs against consistent reference data to ensure quality and accuracy.",
    img: security, 
  },
   {
    id: 4,
    title: "Data Export",
    description:"Generate and export high-quality, validated datasets for training and analysis purposes.",
    img: data, 
  },
];

export const howItWorks = [
  {
    id: 1,
    number: 1,
    title: "Upload Media",
    description: "Upload an image, video file, or connect a live video stream containing traffic signs for analysis.",
  },
  {
    id: 2,
    number: 2,
    title: "YOLO Detection",
    description: "Our advanced YOLO model detects and classifies all traffic signs with bounding boxes and confidence scores.",
  },
  {
    id: 3,
    number: 3,
    title: "Data & Export",
    description: "Retrieve sign information, validate results, and export structured datasets for your applications.",
  },
];