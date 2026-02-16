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
    title: "HackeZee 2026",
    description: "Annual flagship hackathon fostering innovation and competitive problem-solving.",
    longDescription:
      "HackeZee is JoEL’s flagship annual hardware hackathon that brings together undergraduate Electronics and Communication Engineering students to design, build, and demonstrate innovative, real-world hardware solutions. The contest emphasizes hands-on engineering by requiring teams to develop fully functional prototypes using microcontrollers, sensors, actuators, and embedded systems, supported by simulation and design tools where necessary. Centered around impactful domains such as healthcare, smart systems, automation, and emerging technologies, HackeZee fosters problem-solving, interdisciplinary thinking, and practical implementation skills through structured mentorship, technical scrutiny, and live project demonstrations before a jury panel.",
    icon: "Zap",
    category: "Competition",
    status: "Upcoming",
  },
  {
    id: "roadshow",
    title: "RoadShow 2026",
    description: "Interactive demonstration and outreach events showcasing engineering innovations.",
    longDescription:
      "RoadShow is JoEL’s innovation-driven prototyping initiative that empowers undergraduate students to transform original engineering ideas into tangible, working hardware systems. Designed to encourage interdisciplinary collaboration and hands-on experimentation, RoadShow enables student teams to work closely with JoEL mentors, access lab resources, and develop real-world prototypes across domains such as healthcare, robotics, IoT, sustainable systems, embedded AI, and advanced sensing. The program emphasizes practical implementation over theory, requiring functional hardware solutions supported by simulation and design tools where necessary. RoadShow serves as a structured platform for creativity, technical growth, and research-oriented development, helping students move beyond classroom learning into impactful engineering practice.",
    icon: "TrendingUp",
    category: "Project Display",
    status: "Ongoing",
  },
  {
    id: "jimpps",
    title: "JIMPPS 2026",
    description: "JoEL Interdisciplinary MathWorks Projects for PES Students - collaborative learning platform.",
    longDescription:
      "JIMPPS (JoEL Interdisciplinary MathWorks Projects for PES Students) is an academic–industry collaborative initiative by JoEL that enables students to work on structured, interdisciplinary projects integrating MATLAB, Simulink, and hardware systems. Designed to bridge theoretical learning with practical implementation, JIMPPS brings together students from multiple engineering domains to develop industry-relevant solutions under faculty mentorship and technical guidance from MathWorks. The program emphasizes model-based design, simulation-driven development, and hardware validation, fostering strong analytical, system design, and research-oriented skills through real-world project execution.",
    icon: "Users",
    category: "Academic",
    status: "Ongoing",
  },
{
    id: "bootstrap",
    title: "Bootstrap 2026",
    description: "Bootstrap is an introductory hands-on program that introduces first-year students to real-world hardware, embedded systems, and innovation-driven learning.",
    longDescription:
      "Bootstrap is JoEL’s introductory hands-on module designed to give first-year students early exposure to practical engineering and hardware innovation. Through live project demonstrations, guided embedded system activities, and showcases of past competitions and prototypes, students experience how classroom concepts translate into real-world applications. The program fosters curiosity, technical confidence, and an interest in hardware-driven learning from the very beginning of their academic journey.",
    icon: "Users",
    category: "Academic",
    status: "Upcoming",
  },
{
    id: "udan",
    title: "UDAN 2024",
    description: "JoEL’s outreach initiative that introduces school students to real-world engineering through live hardware demonstrations and interactive sessions.",
    longDescription:
      "UDAN Outreach Initiative is JoEL’s school engagement program designed to introduce young students to practical engineering and innovation through live project demonstrations and interactive sessions. By showcasing working prototypes across robotics, IoT, automation, wireless systems, and embedded applications, the initiative provides early exposure to real-world technology and hands-on learning. The program aims to spark curiosity, build foundational technical awareness, and inspire the next generation of innovators to explore engineering as a future pathway.",
    icon: "TrendingUp",
    category: "Academic",
    status: "Completed",
  },
{
    id: "componentdistribution",
    title: "Components Distribution 2026",
    description: "JoEL’s initiative to provide electronic component kit to second year students.",
    longDescription:
      "Components Distribution is JoEL’s academic support initiative aimed at equipping second-year students with essential electronic component kits to kickstart their hands-on engineering journey. The kits include fundamental hardware elements such as microcontrollers, sensors, actuators, and supporting modules, enabling students to experiment, prototype, and build real-world systems beyond classroom learning. By providing structured access to practical resources early in their academic progression, the initiative empowers students to confidently explore embedded systems, hardware integration, and project development, fostering a strong foundation in experiential and innovation-driven engineering.",
    icon: "Cpu",
    category: "Academic",
    status: "Upcoming",
  },
{
    id: "engenium",
    title: "Engenium 2025",
    description: "HoPES’ annual technical exhibition where JoEL showcases interactive, student-built electronic games through engaging live demonstrations.",
    longDescription:
      "Engenium is an annual technical exhibition conducted by HoPES in celebration of Engineer’s Day, where JoEL participates by showcasing interactive, student-developed electronic systems and demonstrations. As part of the exhibition, JoEL presents engaging hardware-based games and models that illustrate core principles of embedded systems, circuit design, and user interaction in a practical and accessible format. Through these live demonstrations, the initiative highlights the creative and application-oriented side of electronics, encouraging participation from both technical and non-technical audiences while fostering curiosity, innovation, and hands-on learning.",
    icon: "Users",
    category: "Project Display",
    status: "Completed",
  },
];

