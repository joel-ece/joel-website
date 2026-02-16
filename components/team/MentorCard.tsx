import React from "react";
import Image from "next/image";
import { Mail, Linkedin, Github, Briefcase, Calendar } from "lucide-react";

type MentorCardProps = {
  name: string;
  role: string;
  category: string;
  bio?: string;
  email?: string;
  image?: string;
  linkedin?: string;
  github?: string;
  currentWork?: string;
  yearsAtJoEL?: string;
  associatedEvent?: string;
};

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
  associatedEvent,
}: MentorCardProps) {
  // Show full bio for faculty, clamp for students/others
  const isFaculty = category === "Faculty Mentor";

  return (
    <article className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow h-full flex flex-col">
      {/* Top: avatar + name/role */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {image ? (
            <Image
              src={image}
              alt={`${name} photo`}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <span className="font-semibold text-sm">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">{name}</h3>

          <p className="text-sm text-joel-purple-600 mt-1">{role}</p>

          <div className="mt-2">
            <span className="inline-block text-xs bg-joel-purple-50 text-joel-purple-600 px-3 py-1 rounded-full">
              {category}
            </span>
          </div>
        </div>
      </div>

      {/* Bio: full for faculty, shortened for others */}
      {bio ? (
        <p
          className={`text-sm text-gray-600 mt-4 ${isFaculty ? "" : "line-clamp-3"}`}
        >
          {bio}
        </p>
      ) : null}

      {/* Info pills (Currently / At JoEL / Event) */}
      {(currentWork || yearsAtJoEL || associatedEvent) && (
        <div className="mt-4 space-y-2">
          {currentWork && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-md px-3 py-2 w-full">
              <div className="p-2 rounded-md bg-white shadow-sm">
                <Briefcase className="w-4 h-4 text-joel-purple-600" />
              </div>
              <div className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">Currently: </span>
                <span>{currentWork}</span>
              </div>
            </div>
          )}

          {yearsAtJoEL && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-md px-3 py-2 w-full">
              <div className="p-2 rounded-md bg-white shadow-sm">
                <Calendar className="w-4 h-4 text-joel-purple-600" />
              </div>
              <div className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">At JoEL: </span>
                <span>{yearsAtJoEL}</span>
              </div>
            </div>
          )}

          {associatedEvent && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-md px-3 py-2 w-full">
              <div className="p-2 rounded-md bg-white shadow-sm">
                <Briefcase className="w-4 h-4 text-joel-purple-600" />
              </div>
              <div className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">Event: </span>
                <span>{associatedEvent}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="mt-4 border-t border-gray-100"></div>

      {/* Footer actions */}
      <div className="mt-3 flex items-center gap-3">
        {email && (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-50 hover:bg-gray-100 transition"
            aria-label={`Email ${name}`}
          >
            <Mail className="w-4 h-4 text-gray-700" />
          </a>
        )}

        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-50 hover:bg-gray-100 transition"
            aria-label={`${name} on LinkedIn`}
          >
            <Linkedin className="w-4 h-4 text-gray-700" />
          </a>
        )}

        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-gray-50 hover:bg-gray-100 transition"
            aria-label={`${name} on GitHub`}
          >
            <Github className="w-4 h-4 text-gray-700" />
          </a>
        )}
      </div>
    </article>
  );
}