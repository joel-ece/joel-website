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
    bio: "Prof. Prajeesha serves as a core faculty mentor and driving force behind JoEL, leading its vision of hands-on, hardware-centered innovation. With expertise in IoT, intelligent electronic devices, smart grid technologies, machine learning, and cybersecurity, she guides students in developing research-oriented, real-world prototypes that integrate embedded systems with advanced analytics. At JoEL, she emphasizes structured project execution, technical depth, and interdisciplinary collaboration, encouraging students to move beyond simulations toward validated hardware implementations. Her mentorship combines strong academic grounding with industry-aligned thinking, fostering innovation, research publication, and participation in national and international technical platforms.",
    email: "prajeeshaemmanuel@pes.edu",
    image: "joel-website/team/prajeesha.jpg",
    linkedin: "https://www.linkedin.com/in/prajeesha-prajeesha-2aa6111ba/",
    github: "",
  }, 
{
    id: "faculty-2",
    name: "Prof. Rajasekar Mohan",
    role: "Faculty Mentor",
    category: "Faculty Mentor",
    bio: "Prof. Rajasekar Mohan serves as an industry-focused mentor at JoEL, bringing extensive expertise in IT and telecommunications infrastructure, network operations, system integration, and data center management. With experience in large-scale infrastructure projects, information security, and hybrid telecom networks, he provides strategic guidance on real-world implementation, system planning, and operational excellence. At JoEL, he supports students in developing industry-relevant hardware and infrastructure-oriented projects, emphasizing structured execution, scalability, and professional engineering practices.",
    email: "rajasekarmohan@pes.edu",
    image: "joel-website/team/rajasekar.png",
    linkedin: "https://www.linkedin.com/in/mohanrajasekar/",
    github: "",
  },
{
    id: "faculty-3",
    name: "Prof. Shagun Gupta",
    role: "Faculty Mentor",
    category: "Faculty Mentor",
    bio: "Dr. Shagun Gupta serves as a faculty mentor at JoEL, guiding students in developing research-oriented and healthcare-focused hardware innovations. With expertise in signal processing, biomedical systems, IoT, AI/ML, and VLSI, she supports interdisciplinary projects that integrate electronics with real-world applications. At JoEL, she actively mentors teams in system design, prototyping, and analytical validation, fostering technical depth, structured thinking, and innovation-driven development among students.",
    email: "shagungupta@pes.edu",
    image: "joel-website/team/shagun.png",
    linkedin: "https://www.linkedin.com/in/dr-shagun-gupta-34841b88/",
    github: "",
  },

  // ===== STUDENT MENTORS =====
  {
    id: "student-1",
    name: "Dhanush M R",
    role: "Ex - Student Head",
    category: "Student Mentor",
    bio: "Dhanush M R was an active member and Project Mentor at JoEL, where he guided student teams in developing hardware prototypes and encouraged hands-on learning through structured project execution. He played a key role in organizing hardware hackathons, mentoring teams through troubleshooting and implementation challenges, and fostering a strong culture of disciplined, application-oriented innovation within the lab. Currently, he works as a Firmware Engineer at Connect-X, contributing to the development and deployment of firmware for edge gateway and IoT-based systems. His work involves communication protocols, device integration, and end-to-end firmware lifecycle management, reflecting the strong foundation in practical system development and technical leadership built during his time at JoEL.",
    currentWork: "Software Engineer at Connect-X",
    yearsAtJoEL: "2023–2025",
    email: "dhanushmercury123@gmail.com",
    image: "joel-website/team/dhanush.jpeg",
    linkedin: "https://www.linkedin.com/in/dhanush-meda-00a965227",
    github: "",
  },
  {
    id: "student-2",
    name: "Spoorthi Shetty",
    role: "Ex - Student Head",
    category: "Student Mentor",
    bio: "Spoorthi Shetty was an active core member of JoEL who significantly contributed to organizing and coordinating major initiatives such as HackeZee and RoadShow. She was involved in streamlining event operations, facilitating team coordination, assisting with technical reviews, and ensuring structured execution of large-scale student innovation programs. Her efforts helped strengthen JoEL’s event management framework and participant engagement. Currently, she is working as an AI Engineer, building intelligent systems and contributing to real-world technology solutions. Her professional journey reflects the strong foundation in structured thinking, technical discipline, and innovation-driven execution that she cultivated during her time at JoEL.",
    yearsAtJoEL: "2023–2025",
    email: "spoorthisetty@yahoo.com",
    currentWork: "AI Engineer at NeuAlto",
    image: "joel-website/team/spoorthi.jpg",
    linkedin: "https://www.linkedin.com/in/spoorthi-shetty-454859257/",
    github: "https://github.com/spoorthisetty99",
  },
  // Add more members following the same pattern...
];