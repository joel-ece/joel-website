export interface Initiative {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  category: string;
  status: "Active" | "Upcoming" | "Ongoing" | "Completed";
}

export const initiatives: Initiative[] = [
  {
    id: "hackezee",
    title: "HackeZee",
    description: "Annual flagship hackathon fostering innovation and competitive problem-solving.",
    longDescription:
      "HackeZee is JoEL’s flagship annual hardware hackathon that brings together undergraduate Electronics and Communication Engineering students to design, build, and demonstrate innovative, real-world hardware solutions. The contest emphasizes hands-on engineering by requiring teams to develop fully functional prototypes using microcontrollers, sensors, actuators, and embedded systems, supported by simulation and design tools where necessary. Centered around impactful domains such as healthcare, smart systems, automation, and emerging technologies, HackeZee fosters problem-solving, interdisciplinary thinking, and practical implementation skills through structured mentorship, technical scrutiny, and live project demonstrations before a jury panel.",
    icon: "Zap",
    category: "Competition",
    status: "Completed",
  },
  {
    id: "roadshow",
    title: "RoadShow",
    description: "Interactive demonstration and outreach events showcasing engineering innovations.",
    longDescription:
      "RoadShow is JoEL’s innovation-driven prototyping initiative that empowers undergraduate students to transform original engineering ideas into tangible, working hardware systems. Designed to encourage interdisciplinary collaboration and hands-on experimentation, RoadShow enables student teams to work closely with JoEL mentors, access lab resources, and develop real-world prototypes across domains such as healthcare, robotics, IoT, sustainable systems, embedded AI, and advanced sensing. The program emphasizes practical implementation over theory, requiring functional hardware solutions supported by simulation and design tools where necessary. RoadShow serves as a structured platform for creativity, technical growth, and research-oriented development, helping students move beyond classroom learning into impactful engineering practice.",
    icon: "TrendingUp",
    category: "Project Display",
    status: "Ongoing",
  },
  {
    id: "jimpps",
    title: "JIMPPS",
    description: "JoEL Interdisciplinary MathWorks Projects for PES Students - collaborative learning platform.",
    longDescription:
      "JIMPPS (JoEL Interdisciplinary MathWorks Projects for PES Students) is an academic–industry collaborative initiative by JoEL that enables students to work on structured, interdisciplinary projects integrating MATLAB, Simulink, and hardware systems. Designed to bridge theoretical learning with practical implementation, JIMPPS brings together students from multiple engineering domains to develop industry-relevant solutions under faculty mentorship and technical guidance from MathWorks. The program emphasizes model-based design, simulation-driven development, and hardware validation, fostering strong analytical, system design, and research-oriented skills through real-world project execution.",
    icon: "Users",
    category: "Academic",
    status: "Ongoing",
  },
{
    id: "bootstrap",
    title: "Bootstrap",
    description: "Bootstrap is an introductory hands-on program that introduces first-year students to real-world hardware, embedded systems, and innovation-driven learning.",
    longDescription:
      "Bootstrap is JoEL’s introductory hands-on module designed to give first-year students early exposure to practical engineering and hardware innovation. Through live project demonstrations, guided embedded system activities, and showcases of past competitions and prototypes, students experience how classroom concepts translate into real-world applications. The program fosters curiosity, technical confidence, and an interest in hardware-driven learning from the very beginning of their academic journey.",
    icon: "Users",
    category: "Academic",
    status: "Completed",
  },

];
