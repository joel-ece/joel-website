import React from "react";
import { Mail, Award } from "lucide-react";

interface FacultyCardProps {
  name: string;
  role: string;
  bio: string;
  email?: string;
  specialization?: string;
}

export default function FacultyCard({
  name,
  role,
  bio,
  email,
  specialization,
}: FacultyCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-joel-gradient h-32" />
      <div className="relative px-8 pb-8">
        <div className="absolute -top-16 left-8">
          <div className="w-32 h-32 bg-gradient-to-br from-joel-purple-400 to-joel-blue-400 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
            {name.split(" ").map((n) => n[0]).join("")}
          </div>
        </div>
        <div className="pt-20">
          <h3 className="text-3xl font-bold font-heading text-gray-900 mb-2">
            {name}
          </h3>
          <p className="text-lg text-joel-purple-600 font-semibold mb-4">{role}</p>
          {specialization && (
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <Award className="w-4 h-4 mr-2" />
              <span>{specialization}</span>
            </div>
          )}
          <p className="text-gray-600 leading-relaxed mb-6">{bio}</p>
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center text-joel-purple-600 font-semibold hover:text-joel-purple-700 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              {email}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
