import React from "react";
import { Calendar, ExternalLink, Clock } from "lucide-react";
import { liveEvents } from "@/data/events";

export default function LiveEvents() {
  // Only show active events
  const activeEvents = liveEvents.filter((event) => event.isActive);

  // Don't show the section if no active events
  if (activeEvents.length === 0) {
    return null;
  }

  // Helper function to format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper function to check if deadline is soon (within 7 days)
  const isDeadlineSoon = (dateString: string) => {
    const deadline = new Date(dateString);
    const today = new Date();
    const daysUntil = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntil <= 7 && daysUntil > 0;
  };

  // Helper to check if registration deadline has passed.
  // This treats the deadline as inclusive for the day — registrations close after the deadline day ends.
  const isRegistrationClosed = (dateString: string) => {
    const deadline = new Date(dateString);
    // set to end of day of the deadline
    deadline.setHours(23, 59, 59, 999);
    return deadline.getTime() < Date.now();
  };

  return (
    <section className="py-20 bg-gradient-to-br from-joel-purple-50 via-white to-joel-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-joel-gradient text-white px-4 py-2 rounded-full mb-4">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">HAPPENING NOW</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-4">
            Live Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't miss out on our upcoming events and opportunities
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeEvents.map((event) => {
            const closed = isRegistrationClosed(event.registrationDeadline);
            const soon = isDeadlineSoon(event.registrationDeadline);

            return (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-joel-purple-400 transition-all duration-300 overflow-hidden group"
              >
                {/* Deadline Badge */}
                <div className={closed ? "bg-gray-300 p-4" : "bg-joel-gradient p-4"}>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm font-semibold">
                        {closed ? "REGISTRATIONS CLOSED" : "REGISTRATION DEADLINE"}
                      </span>
                    </div>
                  </div>
                  <p className="text-white font-bold text-lg mt-2">
                    {formatDate(event.registrationDeadline)}
                  </p>
                  {soon && !closed && (
                    <p className="text-yellow-300 text-sm font-semibold mt-1 animate-pulse">
                      ⚡ Closing Soon!
                    </p>
                  )}
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold font-heading text-gray-900 mb-3 group-hover:text-joel-purple-600 transition-colors">
                    {event.name}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Register Button / Closed state */}
                  {closed ? (
                    <div className="w-full">
                      <button
                        type="button"
                        disabled
                        className="w-full px-6 py-3 bg-gray-100 text-gray-500 font-semibold rounded-lg shadow-sm cursor-not-allowed"
                      >
                        Registrations Closed
                      </button>
                    </div>
                  ) : (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-6 py-3 bg-joel-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg group"
                    >
                      Register Here
                      <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Note at bottom */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Registration links open in a new tab. Make sure to complete your registration before the deadline!
          </p>
        </div>
      </div>
    </section>
  );
}