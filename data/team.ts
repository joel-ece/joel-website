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
    image: "/team/prajeesha.jpg",
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
    image: "/team/rajasekar.png",
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
    image: "/team/shagun.png",
    linkedin: "https://www.linkedin.com/in/dr-shagun-gupta-34841b88/",
    github: "",
  },

  // ===== STUDENT MENTORS =====
  {
    id: "student-1",
    name: "Dhanush M R",
    role: "Ex - Student Head",
    category: "Student Mentor",
    bio: "",
    currentWork: "Firmware Engineer at Connect-X",
    yearsAtJoEL: "2023–2025",
    email: "dhanushmeda03@gmail.com",
    image: "/team/dhanush.jpeg",
    linkedin: "https://www.linkedin.com/in/dhanush-meda-00a965227",
    github: "",
  },
  {
    id: "student-2",
    name: "Spoorthi Shetty",
    role: "Ex - Student Head",
    category: "Student Mentor",
    bio: "",
    yearsAtJoEL: "2023–2025",
    email: "spoorthisetty@yahoo.com",
    currentWork: "AI Engineer at NeuAlto",
    image: "/team/spoorthi.jpg",
    linkedin: "https://www.linkedin.com/in/spoorthi-shetty-454859257/",
    github: "https://github.com/spoorthisetty99",
  },
{
    id: "student-3",
    name: "Vilas V",
    role: "Student Head",
    category: "Student Mentor",
    bio: "",
    yearsAtJoEL: "2024–2026",
    email: "vvilas231@gmail.com",
    currentWork: "Intern at DUXES LABS PVT LTD",
    image: "/team/vilas.png",
    linkedin: "https://www.linkedin.com/in/vilas-v-ba5631282/",
    github: "",
  },
{
    id: "student-4",
    name: "Kaavya Katuri",
    role: "Student Head",
    category: "Student Mentor",
    bio: "",
    yearsAtJoEL: "2024–2026",
    email: "kaavya.katuri@gmail.com",
    currentWork: "Corporate services Intern at KPMG India",
    image: "/team/kaavya.jpg",
    linkedin: "https://www.linkedin.com/in/kaavyakaturi/",
    github: "",
  },
{
    id: "student-5",
    name: "Yashwant N J",
    role: "Ex - Student Mentor",
    category: "Student Mentor",
    bio: "",
    yearsAtJoEL: "2024–2025",
    email: "njyashwant@gmail.com",
    currentWork: "Power Electronics Intern at Havells India Ltd",
    image: "/team/yashwant.png",
    linkedin: "https://www.linkedin.com/in/yashwantnj/",
    github: "",
  },
{
    id: "student-6",
    name: "Samhitha Ramarathnam",
    role: "Ex - Student Mentor",
    category: "Student Mentor",
    bio: "",
    yearsAtJoEL: "2024–2025",
    email: "rsamram04@gmail.com",
    currentWork: "Intern at Zoho Corp",
    image: "/team/samhitha.jpg",
    linkedin: "https://www.linkedin.com/in/samhitha-ramarathnam-980b74265/",
    github: "",
  },
{
    id: "student-7",
    name: "Hitesh Pranav",
    role: "Student Mentor",
    category: "Student Mentor",
    bio: "",
    yearsAtJoEL: "2024–2026",
    email: "hiteshpranavreddy.d@gmail.com",
    currentWork: "",
    image: "/team/hitesh.jpg",
    linkedin: "https://www.linkedin.com/in/hitesh-pranav-reddy-379371264/",
    github: "https://github.com/HiteshPranav267",
  },
{
    id: "student-8",
    name: "Keerthi Abeestitha",
    role: "Student Mentor",
    category: "Student Mentor",
    bio: "",
    yearsAtJoEL: "2024–2026",
    email: "keerthiabeestithatncks@gmail.com",
    currentWork: "",
    image: "/team/keerthi.png",
    linkedin: "https://www.linkedin.com/in/keerthi-abeestitha-t-n-67188b284/",
    github: "",
  },
{
    id: "student-9",
    name: "Pruthvi",
    role: "Student Mentor",
    category: "Student Mentor",
    bio: "",
    yearsAtJoEL: "2025–2026",
    email: "p7504214@gmail.com",
    currentWork: "",
    image: "/team/pruthvi.png",
    linkedin: "https://www.linkedin.com/in/pruthvi-30a1852b6/",
    github: "",
  },

{
    id: "student-10",
    name: "Manasa Ajit",
    role: "Ex - Student Mentor",
    category: "Student Mentor",
    bio: "",
    yearsAtJoEL: "2024–2025",
    email: "manasaajit.j@gmail.com",
    currentWork: "",
    image: "/team/manasa.jpg",
    linkedin: "https://www.linkedin.com/in/manasa-ajit/",
    github: "",
  },
{
    id: "student-11",
    name: "Chinmay Grandhi",
    role: "Student Mentor",
    category: "Student Mentor",
    bio: "",
    yearsAtJoEL: "2025–2026",
    email: "chinmaygrandhi2006@gmail.com",
    currentWork: "",
    image: "/team/chinmay.jpg",
    linkedin: "https://www.linkedin.com/in/chinmay-grandhi-19466a351/",
    github: "",
  },

  // Add more members following the same pattern...
];