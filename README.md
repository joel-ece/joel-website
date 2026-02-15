# JoEL Official Website

Official website for **JoEL (Joy of Engineering Lab)**, Department of Electronics & Communication Engineering, PES University. Built to showcase initiatives, projects, and interdisciplinary engineering activities.

## 🚀 About JoEL

The Joy of Engineering Lab (JoEL) is a student-driven innovation hub under the ECE Department at PES University. We foster innovation, collaboration, and excellence through:

- **HackeZee** - Annual flagship hackathon
- **RoadShow** - Interactive outreach and demonstration events
- **JIMPPS** - Joint Interdisciplinary Mini Projects for PES Students

## 🛠️ Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.x
- **UI Components:** Custom components with accessible patterns
- **Icons:** Lucide React
- **Fonts:** Inter (body) + Plus Jakarta Sans (headings) via `next/font/google`

## 🎨 Design Theme

The website features a professional purple/blue gradient theme:

- **Primary Purple:** `#7c3aed` (joel-purple-600)
- **Primary Blue:** `#2563eb` (joel-blue-600)
- **Main Gradient:** `linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)`

## 📁 Project Structure

```
joel-website/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── initiatives/       # Initiatives page
│   ├── projects/          # Projects page
│   ├── team/              # Team page
│   └── contact/           # Contact page
├── components/            # React components
│   ├── layout/           # Navbar, Footer
│   ├── home/             # Home page components
│   ├── about/            # About page components
│   ├── initiatives/      # Initiative components
│   ├── projects/         # Project components
│   ├── team/             # Team components
│   └── ui/               # Reusable UI components
├── data/                 # Static data files
│   ├── initiatives.ts    # Initiatives data
│   ├── projects.ts       # Projects data
│   └── team.ts           # Team members data
├── lib/                  # Utility functions
│   └── utils.ts          # Class name merger
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/joel-ece/joel-website.git
cd joel-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📄 Available Pages

- **Home** (`/`) - Hero, initiatives preview, featured projects, stats
- **About** (`/about`) - Vision, mission, history, faculty coordinator
- **Initiatives** (`/initiatives`) - HackeZee, RoadShow, JIMPPS details
- **Projects** (`/projects`) - Student project showcase
- **Team** (`/team`) - Faculty, student leads, and mentors
- **Contact** (`/contact`) - Contact form and information

## 🤝 Contributing

We welcome contributions from the JoEL community! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

**Email:** joel.ece@pes.edu

**Location:** Department of Electronics & Communication Engineering, PES University, Bangalore

## 📝 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

---

Built with ❤️ by the JoEL Team at PES University
