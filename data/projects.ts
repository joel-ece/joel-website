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
    id: "smart-iot-grid",
    title: "Smart IoT Energy Grid",
    description:
      "An intelligent energy monitoring system using IoT sensors and machine learning to optimize power consumption in campus buildings. Features real-time analytics, predictive maintenance alerts, and automated load balancing.",
    techStack: ["ESP32", "Python", "TensorFlow", "MQTT", "React", "Node.js"],
    team: ["Aarav Sharma", "Priya Nair", "Karthik Rao"],
    status: "Completed",
    category: "IoT",
  },
  {
    id: "5g-signal-analyzer",
    title: "5G Signal Propagation Analyzer",
    description:
      "Advanced signal processing tool for analyzing 5G mmWave propagation characteristics in urban environments. Implements ray-tracing algorithms and provides visualization of coverage patterns and interference analysis.",
    techStack: ["MATLAB", "Python", "C++", "OpenGL", "NumPy"],
    team: ["Ananya Kumar", "Rohan Desai"],
    status: "In Progress",
    category: "Signal Processing",
  },
  {
    id: "autonomous-robot",
    title: "Autonomous Navigation Robot",
    description:
      "Mobile robot platform with computer vision and SLAM capabilities for autonomous indoor navigation. Equipped with LiDAR, stereo cameras, and ultrasonic sensors for obstacle detection and path planning.",
    techStack: ["ROS", "Python", "OpenCV", "Arduino", "Raspberry Pi"],
    team: ["Neha Patel", "Arjun Singh", "Divya Menon", "Aditya Reddy"],
    status: "In Progress",
    category: "Robotics",
  },
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
