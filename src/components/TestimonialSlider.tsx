import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Define the type directly in the component file
interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatarUrl: string;
}

// Testimonials Data
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Junaid MV",
    role: "IT Consultant",
    content: "Zipvisas made my business visa application seamless and stress-free. Their expertise is unmatched.",
    rating: 5,
    avatarUrl: "/images/testimonials/junaid-mv.jpg",
  },
  {
    id: 2,
    name: "Anas Rahman PK",
    role: "Software Engineer",
    content: "I highly recommend Zipvisas for their fast and reliable service. They guided me through every step of the process.",
    rating: 5,
    avatarUrl: "/images/testimonials/anas-rahman-pk.jpg",
  },
  {
    id: 3,
    name: "Fayis Kallingal",
    role: "Engineer at OQ, Oman",
    content: "Thanks to Zipvisas, my work visa for Oman was processed efficiently. Their team is truly professional.",
    rating: 5,
    avatarUrl: "/images/testimonials/fayis-kallingal.jpg",
  },
  {
    id: 4,
    name: "Hanna Garcia",
    role: "Healthcare Worker",
    content: "Zipvisas simplified the complexities of my work visa application. Their support is top-notch.",
    rating: 5,
    avatarUrl: "/images/testimonials/hanna-garcia.jpg",
  },
  {
    id: 5,
    name: "Sophia Reyes",
    role: "Nurse",
    content: "The team at Zipvisas ensured my healthcare visa was approved without any delays. I couldn’t be happier.",
    rating: 5,
    avatarUrl: "/images/testimonials/sophia-reyes.jpg",
  },
];

const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const visibleCount = window.innerWidth >= 768 ? 3 : 1;

  return (
    <div className="relative max-w-7xl mx-auto py-12 md:py-20 px-4 md:px-6">
      <div className="text-center mb-12">
        <span className="inline-block mb-4">
          <Quote className="h-8 w-8 text-blue-900 rotate-180" />
        </span>
        <h2 className="text-2xl md:text-3xl font-bold font-serif text-slate-900 mb-4">
          Trusted by Thousands of Travelers
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
          Join our community of satisfied clients who have experienced seamless visa processing.
        </p>
      </div>

      <div className="relative">
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 bg-white shadow-lg p-2 md:p-3 rounded-full hover:bg-slate-50 transition-colors z-10 text-blue-900"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
        </button>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${(currentIndex * 100) / visibleCount}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`w-full ${visibleCount > 1 ? "md:w-1/3" : ""} flex-shrink-0 px-4 md:px-8`}
              >
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.avatarUrl}
                      alt={testimonial.name}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-serif font-medium text-slate-900 text-base md:text-lg">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-slate-500 font-serif">{testimonial.role}</p>
                    </div>
                  </div>
                  <blockquote>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4 font-serif">
                      "{testimonial.content}"
                    </p>
                  </blockquote>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-sm md:text-base">⭐</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 bg-white shadow-lg p-2 md:p-3 rounded-full hover:bg-slate-50 transition-colors z-10 text-blue-900"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialSlider;
