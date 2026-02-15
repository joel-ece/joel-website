export interface Initiative {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  category: string;
  status: "Active" | "Upcoming" | "Ongoing";
}

export const initiatives: Initiative[] = [
  {
    id: "hackezee",
    title: "HackeZee",
    description: "Annual flagship hackathon fostering innovation and competitive problem-solving.",
    longDescription:
      "HackeZee is JoEL's premier hackathon initiative, bringing together students from diverse disciplines to tackle real-world challenges through innovative engineering solutions. The event features 24-hour coding sprints, mentorship from industry experts, and prizes for the most impactful projects. Participants work in teams to prototype solutions across domains including IoT, AI/ML, web development, and embedded systems.",
    icon: "Zap",
    category: "Competition",
    status: "Active",
  },
  {
    id: "roadshow",
    title: "RoadShow",
    description: "Interactive demonstration and outreach events showcasing engineering innovations.",
    longDescription:
      "RoadShow is an outreach initiative designed to bridge the gap between academic innovation and the broader community. Through interactive demonstrations, workshops, and exhibitions, student teams present their projects to schools, colleges, and public venues. The program aims to inspire future engineers, promote STEM education, and showcase the practical applications of electronics and communication engineering.",
    icon: "TrendingUp",
    category: "Outreach",
    status: "Ongoing",
  },
  {
    id: "jimpps",
    title: "JIMPPS",
    description: "Joint Interdisciplinary Mini Projects for PES Students - collaborative learning platform.",
    longDescription:
      "JIMPPS (Joint Interdisciplinary Mini Projects for PES Students) is a structured program that enables students from different engineering branches to collaborate on short-term, impactful projects. The initiative emphasizes hands-on learning, cross-disciplinary teamwork, and rapid prototyping. Projects span diverse areas including robotics, IoT applications, signal processing, wireless communications, and automation systems. Each project cycle runs for 8-10 weeks with faculty mentorship.",
    icon: "Users",
    category: "Academic",
    status: "Active",
  },
];
