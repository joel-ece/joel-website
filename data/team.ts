export interface FacultyMentor {
  id: string;
  name: string;
  role: string;
  category: "Faculty Mentor";
  bio: string;
  email: string;
  image?: string;
  linkedin?: string;
  github?: string;
}

export interface StudentMentor {
  id: string;
  name: string;
  role: string;
  category: "Student Mentor";
  bio: string;
  currentWork: string;
  yearsAtJoEL: string;
  email: string;
  image?: string;
  linkedin?: string;
  github?: string;
}

export type TeamMember = FacultyMentor | StudentMentor;

export const teamMembers: TeamMember[] = [
  // ===== FACULTY MENTORS =====
  {
    id: "faculty-1",
    name: "Prof. Prajeesha",
    role: "Faculty Mentor",
    category: "Faculty Mentor",
    bio: "Professor Prajeesha serves as a Faculty Mentor for JoEL, guiding students in their pursuit of innovation and excellence.",
    email: "prajeeshaemmanuel@pes.edu",
    image: "/team/prajeesha.jpg",
    linkedin: "https://www.linkedin.com/in/prajeesha-prajeesha-2aa6111ba/",
    github: "",
  },

  // ===== STUDENT MENTORS =====
  {
    id: "student-1",
    name: "Dhanush M R",
    role: "Ex - Student Head",
    category: "Student Mentor",
    bio: "Led JoEL's technical initiatives including HackeZee hackathon. Specializes in FPGA design and digital signal processing.",
    currentWork: "Software Engineer at Intel",
    yearsAtJoEL: "2023–2025",
    email: "aditya.verma@gmail.com",
    image: "/team/dhanush.jpeg",
    linkedin: "https://www.linkedin.com/in/dhanush-meda-00a965227",
    github: "",
  },
  {
    id: "student-2",
    name: "Shreya Menon",
    role: "Student Mentor",
    category: "Student Mentor",
    bio: "Coordinated RoadShow events and outreach programs. Passionate about bridging technology and community.",
    currentWork: "Graduate Student at IISc Bangalore",
    yearsAtJoEL: "2021–2023",
    email: "shreya.menon@gmail.com",
    image: "/team/shreya.jpg",
    linkedin: "https://linkedin.com/in/shreyamenon",
    github: "https://github.com/shreyamenon",
  },
  // Add more members following the same pattern...
];