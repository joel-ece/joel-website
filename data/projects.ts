export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  team: string[];
  status: "Completed" | "In Progress" | "Planning";
  category: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Fingerprint-based Licensing for Driving",
    description:
      "Biometric-based driving license verification system using fingerprint authentication to enhance road safety and prevent identity fraud. The system integrates fingerprint sensors with a centralized verification database.",
    techStack: ["Fingerprint Sensor", "Arduino", "Embedded C", "Biometric Authentication", "Database Systems"],
    team: ["Prajeesha", "R. B S", "N. Nagabhushan", "T. Madhavi"],
    status: "Completed",
    category: "IoT",
  },
  {
    id: "2",
    title: "Positioning Optimization of Drones using IMU and Securing UAV Communication using Hybrid Cryptosystem",
    description:
      "Drone positioning system using IMU sensor fusion for improved navigation accuracy, combined with secure UAV communication using a hybrid cryptographic framework for enhanced data protection.",
    techStack: ["IMU Sensors", "Kalman Filter", "Hybrid Cryptography", "Embedded Systems", "Wireless Communication"],
    team: ["A. Madhu", "H. M. B. Kumar", "Prajeesha"],
    status: "Completed",
    category: "Signal Processing",
  },
  {
    id: "3",
    title: "Prevention of FDI Attacks in Smart Meter using Multi-Layer Authentication",
    description:
      "Security framework to prevent False Data Injection (FDI) attacks in smart meters by implementing multi-layer authentication using ElGamal encryption and SHA hashing algorithms.",
    techStack: ["ElGamal Encryption", "SHA", "Smart Grid", "Cybersecurity", "Embedded Systems"],
    team: ["A. Madhu", "P. Prajeesha"],
    status: "Completed",
    category: "Cybersecurity",
  },
  {
    id: "4",
    title: "Smart Home Surveillance System using LDR Technology",
    description:
      "Low-cost smart home surveillance system using Light Dependent Resistors (LDR) to detect lighting variations and trigger security alerts for intrusion detection.",
    techStack: ["LDR Sensor", "Arduino", "IoT", "Embedded C", "Wireless Alerts"],
    team: ["H. K. M. B", "A. G. Kaushik", "Prajeesha"],
    status: "Completed",
    category: "IoT",
  },
  {
    id: "5",
    title: "Hazardous Material Informatics System using Spatial Profiler",
    description:
      "IoT-based hazardous material monitoring and spatial profiling system to analyze and manage risk zones using data-driven analytics and location-aware processing.",
    techStack: ["IoT", "Spatial Analytics", "Data Processing", "Sensors", "Cloud Integration"],
    team: ["Prajeesha", "Bagur Mohit N", "Pranav Sankar M", "Amrita Ramesh", "Siddhanth Srikanth"],
    status: "Completed",
    category: "IoT",
  },
  {
    id: "6",
    title: "Self-Propelling Baby Jogger with Obstacle Avoidance using Zigbee",
    description:
      "Smart baby jogger system with obstacle detection and autonomous movement capabilities using Zigbee communication and sensor-based navigation.",
    techStack: ["Zigbee", "Ultrasonic Sensors", "Microcontroller", "Embedded C", "Wireless Communication"],
    team: ["Prajeesha", "Aryan Jain", "Avani Avinash", "Anusree H", "Rahul Gangarapu"],
    status: "Completed",
    category: "Robotics",
  },
  {
    id: "7",
    title: "Virtual Eye for Visually Impaired using OCR",
    description:
      "Assistive device employing Optical Character Recognition (OCR) to convert printed text into speech, enabling visually impaired users to access textual information independently.",
    techStack: ["OCR", "Python", "Text-to-Speech", "Computer Vision", "Raspberry Pi"],
    team: ["Preethi Devan", "Varshini D", "Varsha Kulkarni", "Prajeesha"],
    status: "Completed",
    category: "AI/ML",
  },
  {
    id: "8",
    title: "Intelligent Packaging System using IoT",
    description:
      "IoT-enabled smart packaging system for monitoring environmental conditions such as temperature and humidity to ensure product safety during transport.",
    techStack: ["IoT", "Temperature Sensors", "Cloud Monitoring", "Microcontroller", "Wireless Modules"],
    team: ["Akash G", "Ashish Shetty", "Anoop P Nagarmunoli", "Prajeesha"],
    status: "Completed",
    category: "IoT",
  },
  {
    id: "9",
    title: "Electric Vehicle Security and Rider Safety System",
    description:
      "Integrated EV security and rider safety solution incorporating theft detection, rider monitoring, and emergency alert mechanisms.",
    techStack: ["IoT", "GPS", "Embedded Systems", "Wireless Communication", "Security Systems"],
    team: ["Ravi Kiran H R", "Jashwanth K", "Hemanth Gowda B V", "Rajesh S A", "Prajeesha"],
    status: "Completed",
    category: "Embedded Systems",
  },
  {
    id: "10",
    title: "3D Visualization of Microwave Components using Mobile AR",
    description:
      "Augmented Reality (AR) mobile application for interactive 3D visualization of microwave components to enhance engineering education and conceptual understanding.",
    techStack: ["Augmented Reality", "Unity", "Mobile AR", "3D Modeling", "Android Development"],
    team: ["T. J. Bellary", "R. R. Walake", "V. Joshi", "Y. K. Adi", "Prajeesha"],
    status: "Completed",
    category: "AR/VR",
  },
  {
    id: "11",
    title: "Real-Time Threat Detection and Analysis of FANET Networks",
    description:
      "Security monitoring and threat detection framework for Flying Ad Hoc Networks (FANET) to analyze network vulnerabilities and prevent malicious attacks in UAV swarms.",
    techStack: ["FANET", "Network Security", "Intrusion Detection", "Machine Learning", "Wireless Networks"],
    team: ["Vikyath B", "Vismaya N", "Varshana P", "Vedic R", "Prajeesha"],
    status: "Completed",
    category: "Cybersecurity",
  },
  {
    id: "12",
    title: "Real-Time Monitoring of Soil Nutrients using Machine Learning",
    description:
      "Precision agriculture system using IoT sensors and machine learning models to monitor soil nutrients in real time and maximize crop yield.",
    techStack: ["Machine Learning", "IoT Sensors", "Python", "Data Analytics", "Precision Agriculture"],
    team: ["Sujal L", "Akanksha S", "Aaditya N", "Y. Aditya B", "Prajeesha"],
    status: "Completed",
    category: "AI/ML",
  },
  {
    id: "13",
    title: "Braille to Speech Conversion for Blind Education",
    description:
      "Assistive educational tool that converts Braille input into speech output to improve accessibility and learning experiences for visually impaired students.",
    techStack: ["Embedded Systems", "Text-to-Speech", "Microcontroller", "Accessibility Tech"],
    team: ["Smruthi Sajan Varier", "Sowmyashree Mukunda", "Prajeesha"],
    status: "Completed",
    category: "Assistive Technology",
  },

  // Existing demo projects retained
  {
    id: "neural-voice-assistant",
    title: "Neural Voice Assistant for Regional Languages",
    description:
      "AI-powered voice assistant with support for Kannada, Hindi, and Tamil. Utilizes deep learning for speech recognition and natural language processing to provide voice-controlled device interactions.",
    techStack: ["PyTorch", "Transformers", "FastAPI", "React Native"],
    team: ["Lakshmi Iyer", "Vikram Joshi"],
    status: "Completed",
    category: "AI/ML",
  },
  {
    id: "fpga-image-processor",
    title: "FPGA-Based Real-Time Image Processor",
    description:
      "Hardware-accelerated image processing pipeline on FPGA for real-time video filtering, edge detection, and object recognition. Achieves processing speeds of 60+ FPS at 1080p resolution.",
    techStack: ["Verilog", "FPGA", "OpenCV", "C++"],
    team: ["Rahul Krishnan", "Sneha Bhat", "Ajay Kumar"],
    status: "In Progress",
    category: "Embedded Systems",
  },
];
