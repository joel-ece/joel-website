import type { Metadata } from "next";
import SectionHeader from "@/components/ui/SectionHeader";
import MentorCard from "@/components/team/MentorCard";
import { teamMembers } from "@/data/team";
import type { StudentMentor } from "@/data/team";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the JoEL team: faculty mentors and student mentors driving innovation at PES University.",
};

export default function TeamPage() {
  const facultyMentors = teamMembers.filter(
    (member) => member.category === "Faculty Mentor"
  );
  const studentMentors = teamMembers.filter(
    (member) => member.category === "Student Mentor"
  );

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-joel-purple-50 via-white to-joel-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Team"
            subtitle="Meet the dedicated faculty and student mentors driving innovation and excellence at JoEL"
            centered
          />
        </div>
      </section>

      {/* Faculty Mentors */}
      {facultyMentors.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-2 text-center">
              Faculty Mentors
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              Experienced faculty guiding students in their pursuit of
              innovation and technical excellence
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facultyMentors.map((member) => (
                <MentorCard
                  key={member.id}
                  name={member.name}
                  role={member.role}
                  category={member.category}
                  bio={member.bio}
                  email={member.email}
		  image={member.image}
                  linkedin={member.linkedin}
                  github={member.github}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Student Mentors */}
      {studentMentors.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-2 text-center">
              Student Mentors
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              Alumni and senior students who have contributed to JoEL's
              mission and continue to inspire the next generation
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {studentMentors.map((member) => {
                const studentData = member as StudentMentor;
                return (
                  <MentorCard
                    key={member.id}
                    name={member.name}
                    role={member.role}
                    category={member.category}
                    bio={member.bio}
                    email={member.email}	
 		    image={member.image}
                    linkedin={member.linkedin}
                    github={member.github}
                    currentWork={studentData.currentWork}
                    yearsAtJoEL={studentData.yearsAtJoEL}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Join Us CTA */}
      <section className="py-20 bg-joel-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-6">
            Want to Join Our Team?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            We're always looking for passionate students who want to contribute
            to JoEL's mission. Whether as a mentor or project contributor,
            there are many ways to get involved.
          </p>
          <a
            href="mailto:joel.ece@pes.edu"
            className="inline-flex items-center px-8 py-4 bg-white text-joel-purple-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}