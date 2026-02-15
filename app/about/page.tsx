import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import VisionMission from "@/components/about/VisionMission";
import FacultyCard from "@/components/about/FacultyCard";
import { teamMembers } from "@/data/team";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about JoEL (Joy of Engineering Lab), our vision, mission, and the team driving innovation at PES University's ECE Department.",
};

export default function AboutPage() {
  const facultyCoordinator = teamMembers.find(
    (member) => member.category === "Faculty Mentor"
  );

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-joel-purple-50 via-white to-joel-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="About JoEL"
            subtitle="Fostering innovation and excellence in Electronics & Communication Engineering"
            centered
          />
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VisionMission />
        </div>
      </section>

      {/* About JoEL */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-6">
            What is JoEL?
          </h2>
          <div className="prose prose-lg text-gray-600 space-y-4">
            <p>
              The <strong>Joy of Engineering Lab (JoEL)</strong> is a student-driven innovation and prototyping ecosystem under the Department of Electronics and Communication Engineering at PES University. It was established to bridge the gap between theoretical coursework and real-world engineering practice by creating a structured environment where students design, build, and validate functional hardware systems. JoEL emphasizes hands-on learning, technical rigor, and problem-solving through practical implementation rather than simulation-only exploration.
            </p>
            <p>
              JoEL operates through flagship initiatives such as hardware hackathons, interdisciplinary project programs, and structured prototyping platforms that integrate embedded systems, IoT, signal processing, robotics, artificial intelligence, and hardware–software co-design. Students work in teams under mentorship, undergo technical scrutiny, and develop demonstrable prototypes that address real-world challenges. The lab promotes model-based design, hardware validation, and system-level thinking, often in collaboration with industry and academic partners.
            </p>
            <p>
              More than a laboratory space, JoEL represents a culture of experimentation, accountability, and engineering leadership. It provides mentorship, infrastructure support, and opportunities for publication, competition, and industry engagement. By encouraging interdisciplinary collaboration and innovation-driven execution, JoEL enables students to transition from learners to builders—developing technical depth, research orientation, and industry readiness.
            </p>
          </div>
        </div>
      </section>

      {/* Faculty Coordinator */}
      {facultyCoordinator && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
                Faculty Coordinator
              </h2>
              <p className="text-lg text-gray-600">
                Meet the faculty member guiding our journey of innovation
              </p>
            </div>
            <FacultyCard
              name={facultyCoordinator.name}
              role={facultyCoordinator.role}
              bio={facultyCoordinator.bio}
              email={facultyCoordinator.email}
	      image={facultyCoordinator.image}
	      linkedin={facultyCoordinator.linkedin}
              github={facultyCoordinator.github}
            />
          </div>
        </section>
      )}

      {/* Department & University Context */}
      <section className="py-20 bg-gradient-to-br from-joel-purple-50 to-joel-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-6 text-center">
            Our Home
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">
              Department of Electronics & Communication Engineering
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              The ECE Department at PES University is renowned for its emphasis on
              hands-on learning, industry collaboration, and cutting-edge research.
              With state-of-the-art laboratories, experienced faculty, and a
              curriculum aligned with industry needs, the department prepares
              students for leadership roles in technology and innovation.
            </p>
            <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4">
              PES University
            </h3>
            <p className="text-gray-600 leading-relaxed">
              PES University is one of India's leading institutions for engineering
              and technology education. Located in Bangalore, the university fosters
              a culture of innovation, research, and entrepreneurship. With a strong
              focus on holistic development, PES University prepares students to be
              global citizens and problem solvers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
