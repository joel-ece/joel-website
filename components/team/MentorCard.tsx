import React from "react";
import Image from "next/image";
import { Mail, Linkedin, Github, Briefcase, Calendar } from "lucide-react";

interface MentorCardProps {
  name: string;
  role: string;
  category: "Faculty Mentor" | "Student Mentor";
  bio: string;
  email: string;
  image?: string;
  linkedin?: string;
  github?: string;
  currentWork?: string;
  yearsAtJoEL?: string;
}

export default function MentorCard({
  name,
  role,
  category,
  bio,
  email,
  image,
  linkedin,
  github,
  currentWork,
  yearsAtJoEL,
}: MentorCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const avatarGradient =
    category === "Faculty Mentor"
      ? "from-joel-purple-500 to-joel-purple-700"
      : "from-joel-blue-500 to-joel-blue-700";

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-6 flex-grow">
        {/* Header: Photo/Avatar + Name */}
        <div className="flex items-start space-x-4 mb-4">
          {image ? (
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200">
              <Image
                src={image}
                alt={name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className={`w-16 h-16 bg-gradient-to-br ${avatarGradient} rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}
            >
              {initials}
            </div>
          )}
          <div className="flex-grow">
            <h3 className="text-xl font-bold font-heading text-gray-900 mb-1">
              {name}
            </h3>
            <p className="text-joel-purple-600 font-semibold text-sm mb-2">
              {role}
            </p>
            <span
              className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                category === "Faculty Mentor"
                  ? "bg-joel-purple-100 text-joel-purple-700"
                  : "bg-joel-blue-100 text-joel-blue-700"
              }`}
            >
              {category}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{bio}</p>

        {/* Student Mentor specific: Current Work & Years */}
        {category === "Student Mentor" && (
          <div className="space-y-2 mb-4">
            {currentWork && (
              <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                <Briefcase className="w-4 h-4 mr-2 text-joel-blue-600 flex-shrink-0" />
                <span>
                  <strong>Currently:</strong> {currentWork}
                </span>
              </div>
            )}
            {yearsAtJoEL && (
              <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                <Calendar className="w-4 h-4 mr-2 text-joel-blue-600 flex-shrink-0" />
                <span>
                  <strong>At JoEL:</strong> {yearsAtJoEL}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Social Links */}
        <div className="flex items-center space-x-3 pt-2 border-t border-gray-100">
          <a
            href={`mailto:${email}`}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-joel-purple-100 hover:text-joel-purple-600 transition-colors"
            aria-label={`Email ${name}`}
          >
            <Mail className="w-4 h-4" />
          </a>
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
              aria-label={`${name}'s LinkedIn`}
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-800 hover:text-white transition-colors"
              aria-label={`${name}'s GitHub`}
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}