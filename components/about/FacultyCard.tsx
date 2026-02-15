import React from "react";
import Image from "next/image";
import { Mail, Linkedin, Github } from "lucide-react";

interface FacultyCardProps {
  name: string;
  role: string;
  bio: string;
  email?: string;
  image?: string;
  linkedin?: string;
  github?: string;
  specialization?: string;
}

export default function FacultyCard({
  name,
  role,
  bio,
  email,
  image,
  linkedin,
  github,
  specialization,
}: FacultyCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-joel-gradient h-32" />
      <div className="relative px-8 pb-8">
        {/* Photo or Initials Avatar */}
        <div className="absolute -top-16 left-8">
          {image ? (
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={image}
                alt={name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-32 h-32 bg-gradient-to-br from-joel-purple-400 to-joel-blue-400 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
              {initials}
            </div>
          )}
        </div>

        <div className="pt-20">
          <h3 className="text-3xl font-bold font-heading text-gray-900 mb-2">
            {name}
          </h3>
          <p className="text-lg text-joel-purple-600 font-semibold mb-4">
            {role}
          </p>

          {specialization && (
            <p className="text-sm text-gray-500 mb-4">
              <strong>Specialization:</strong> {specialization}
            </p>
          )}

          <p className="text-gray-600 leading-relaxed mb-6">{bio}</p>

          {/* Social Links */}
          <div className="flex items-center space-x-3">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600 hover:bg-joel-purple-100 hover:text-joel-purple-600 transition-colors"
                aria-label={`Email ${name}`}
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                aria-label={`${name}'s LinkedIn`}
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-800 hover:text-white transition-colors"
                aria-label={`${name}'s GitHub`}
              >
                <Github className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}