export interface LiveEvent {
  id: string;
  name: string;
  description: string;
  registrationDeadline: string; // Format: "YYYY-MM-DD"
  registrationLink: string;
  isActive: boolean;
}

export const liveEvents: LiveEvent[] = [
  {
    id: "hackezee-2026",
    name: "HackeZee 2026",
    description: "Annual flagship hackathon fostering innovation and competitive problem-solving. Join us for 24 hours of coding, collaboration, and prizes!",
    registrationDeadline: "2026-03-15",
    registrationLink: "https://forms.google.com/YOUR_FORM_ID_HERE",
    isActive: true,
  },
  {
    id: "workshop-iot",
    name: "IoT Workshop Series",
    description: "Learn hands-on IoT development with Arduino and ESP32. Build real projects over 3 sessions.",
    registrationDeadline: "2026-02-28",
    registrationLink: "https://forms.google.com/YOUR_FORM_ID_HERE",
    isActive: true,
  },
  // Add more events here - just copy the block above and change the values
];
