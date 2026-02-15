import React from "react";
import { Mail, Award } from "lucide-react";

interface MentorCardProps {
  name: string;
  role: string;
  category: string;
  bio: string;
  specialization?: string;
  email?: string;
}

export default function MentorCard({
  name,
  role,
  category,
  bio,
  specialization,
  email,
}: MentorCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const getCategoryColor = () => {
    switch (category) {
      case "Faculty":
        return "from-purple-500 to-purple-600";
      case "Student Lead":
        return "from-blue-500 to-blue-600";
      case "Mentor":
        return "from-indigo-500 to-indigo-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor()} rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}
          >
            {initials}
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold font-heading text-gray-900 mb-1">
              {name}
            </h3>
            <p className="text-joel-purple-600 font-semibold text-sm mb-2">
              {role}
            </p>
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              {category}
            </span>
          </div>
        </div>

        {specialization && (
          <div className="flex items-center text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded-lg">
            <Award className="w-4 h-4 mr-2 text-joel-purple-600 flex-shrink-0" />
            <span>{specialization}</span>
          </div>
        )}

        <p className="text-gray-600 text-sm leading-relaxed mb-4">{bio}</p>

        {email && (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center text-joel-purple-600 font-semibold text-sm hover:text-joel-purple-700 transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact
          </a>
        )}
      </div>
    </div>
  );
}
