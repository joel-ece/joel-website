export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: "Faculty" | "Student Lead" | "Mentor";
  bio: string;
  email?: string;
  specialization?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: "faculty-prajeesha",
    name: "Prof. Prajeesha",
    role: "Faculty Coordinator",
    category: "Faculty",
    bio: "Professor Prajeesha serves as the Faculty Coordinator for JoEL, guiding students in their pursuit of innovation and excellence. With extensive experience in electronics and communication engineering, she mentors projects spanning IoT, embedded systems, and signal processing.",
    email: "prajeesha@pes.edu",
    specialization: "Embedded Systems, IoT",
  },
  {
    id: "lead-aditya",
    name: "Aditya Verma",
    role: "Student Lead",
    category: "Student Lead",
    bio: "Final year ECE student leading JoEL's technical initiatives. Specializes in FPGA design and digital signal processing. Led the team that won Best Hardware Project at HackeZee 2024.",
    specialization: "FPGA, Digital Design",
  },
  {
    id: "lead-shreya",
    name: "Shreya Menon",
    role: "Student Lead - Events",
    category: "Student Lead",
    bio: "Passionate about bridging technology and community. Coordinates RoadShow events and outreach programs. Experienced in project management and technical communication.",
    specialization: "IoT, Event Management",
  },
  {
    id: "mentor-rajesh",
    name: "Rajesh Kumar",
    role: "Technical Mentor",
    category: "Mentor",
    bio: "Graduate student specializing in wireless communications. Mentors student projects in 5G technology and antenna design. Published researcher in IEEE conferences.",
    specialization: "Wireless Communications, RF Design",
  },
  {
    id: "mentor-ananya",
    name: "Ananya Deshmukh",
    role: "AI/ML Mentor",
    category: "Mentor",
    bio: "PhD candidate focusing on machine learning applications in signal processing. Guides students in implementing neural networks for embedded platforms.",
    specialization: "Machine Learning, Signal Processing",
  },
  {
    id: "mentor-kiran",
    name: "Kiran Patel",
    role: "Embedded Systems Mentor",
    category: "Mentor",
    bio: "Senior student with expertise in embedded systems and robotics. Has led multiple successful JIMPPS projects and provides hands-on guidance in hardware-software integration.",
    specialization: "Embedded Systems, Robotics",
  },
  {
    id: "mentor-priya",
    name: "Priya Sharma",
    role: "Web & Design Mentor",
    category: "Mentor",
    bio: "Experienced in full-stack development and UI/UX design. Helps students build web interfaces for their projects and ensures professional documentation.",
    specialization: "Web Development, UI/UX",
  },
  {
    id: "mentor-varun",
    name: "Varun Reddy",
    role: "Technical Mentor",
    category: "Mentor",
    bio: "Specializes in IoT architecture and cloud integration. Mentors teams on building scalable connected systems and data analytics platforms.",
    specialization: "IoT, Cloud Computing",
  },
];
