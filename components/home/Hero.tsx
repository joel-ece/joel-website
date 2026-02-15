"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/joel-website/public/hero/slide1.jpeg",
    alt: "JoEL Lab Activities",
  },
  {
    image: "/joel-website/public/hero/slide2.jpeg",
    alt: "HackeZee Hackathon",
  },
  {
    image: "/joel-website/public/hero/slide3.jpeg",
    alt: "Student Projects",
  },
  {
    image: "/joel-website/public/hero/slide4.jpeg",
    alt: "Team Collaboration",
  },
  {
    image: "/joel-website/public/hero/slide5.png",
    alt: "Team Collaboration",
  },
  // Add or remove slides as needed
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ===== BACKGROUND IMAGE CAROUSEL ===== */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* ===== DARK OVERLAY ===== */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* ===== GRADIENT OVERLAY (keeps the purple/blue tint) ===== */}
      <div className="absolute inset-0 bg-gradient-to-br from-joel-purple-900/50 via-transparent to-joel-blue-900/50 z-10" />

      {/* ===== HERO CONTENT ===== */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8">
          <span className="text-white/90 text-sm font-medium">
            ⚙️ Department of Electronics & Communication Engineering •
            PES University
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-heading text-white mb-6 drop-shadow-lg">
          Joy of Engineering Lab
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
          Fostering innovation, collaboration, and excellence through hands-on
          projects, competitive initiatives, and interdisciplinary learning
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/initiatives"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-joel-purple-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg text-lg"
          >
            Explore Initiatives
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-8 py-4 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/25 transition-colors text-lg"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* ===== CAROUSEL CONTROLS ===== */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* ===== SLIDE INDICATOR DOTS ===== */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* ===== BOTTOM WAVE ===== */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0,64 C480,120 960,0 1440,64 L1440,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}