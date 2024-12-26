// src/components/TestimonialSlider.tsx

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, StarHalf } from 'lucide-react';

interface Testimonial {
 id: number;
 name: string;
 role: string;
 content: string;
 rating: number;
}

const testimonials: Testimonial[] = [
 {
   id: 1,
   name: "Junaid MV",
   role: "IT Consultant",
   content: "The process for completing the application was so simple, they came back to me very quickly to advise me of a couple of errors I had made and the following day I received my visa.",
   rating: 4.5
 },
 {
   id: 2,
   name: "Anas Rahman PK",
   role: "Software Engineer", 
   content: "Very friendly, professional and excellent service! The very short time for the issue of the visa was surprisingly fast!",
   rating: 4.0
 },
 {
   id: 3,
   name: "Fayis Kallingal",
   role: "Engineer at OQ, Oman",
   content: "Very quick to respond. Explain everything clearly. I'm extremely happy dealing with this company.",
   rating: 4.5
 },
 {
   id: 4,
   name: "Hanna Garcia",
   role: "Healthcare Worker",
   content: "The system is much improved and it took about 20 minutes to apply. The response was very quick and we were approved in two days.",
   rating: 4.0
 },
 {
   id: 5,
   name: "Sophia Reyes",
   role: "Nurse",
   content: "The support from the company was excellent. It took only a few minutes to complete the form.",
   rating: 4.0
 }
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
 const fullStars = Math.floor(rating);
 const hasHalfStar = rating % 1 !== 0;

 return (
   <div className="flex items-center space-x-0.5">
     {[...Array(fullStars)].map((_, i) => (
       <Star key={`full-${i}`} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
     ))}
     {hasHalfStar && (
       <StarHalf className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
     )}
     {[...Array(5 - Math.ceil(rating))].map((_, i) => (
       <Star key={`empty-${i}`} className="w-3.5 h-3.5 text-yellow-400" />
     ))}
     <span className="ml-1.5 text-xs text-gray-500">({rating.toFixed(1)})</span>
   </div>
 );
};

const TestimonialSlider: React.FC = () => {
 const [currentIndex, setCurrentIndex] = useState(0);
 const [visibleCount, setVisibleCount] = useState(3);

 useEffect(() => {
   const handleResize = () => {
     if (window.innerWidth >= 1280) {
       setVisibleCount(3);
     } else if (window.innerWidth >= 768) {
       setVisibleCount(2);
     } else {
       setVisibleCount(1);
     }
   };

   handleResize();
   window.addEventListener('resize', handleResize);
   return () => window.removeEventListener('resize', handleResize);
 }, []);

 const handlePrev = () => {
   setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
 };

 const handleNext = () => {
   setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
 };

 return (
   <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
     <div className="flex flex-col md:flex-row md:items-center md:justify-end mb-12">
       <div className="hidden md:flex items-center gap-4">
         <button
           onClick={handlePrev}
           className="p-3 rounded-full bg-white shadow-sm hover:shadow-md transition-all text-gray-700 
                    hover:scale-105 active:scale-95"
           aria-label="Previous testimonial"
         >
           <ChevronLeft className="w-5 h-5" />
         </button>
         <button
           onClick={handleNext}
           className="p-3 rounded-full bg-white shadow-sm hover:shadow-md transition-all text-gray-700 
                    hover:scale-105 active:scale-95"
           aria-label="Next testimonial"
         >
           <ChevronRight className="w-5 h-5" />
         </button>
       </div>
     </div>

     <div className="relative">
       <button
         onClick={handlePrev}
         className="md:hidden absolute -left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md 
                  hover:shadow-lg transition-all z-10 text-gray-700"
         aria-label="Previous testimonial"
       >
         <ChevronLeft className="w-4 h-4" />
       </button>

       <div className="overflow-hidden">
         <div
           className="flex transition-transform duration-500 ease-out"
           style={{ transform: `translateX(-${(currentIndex * 100) / visibleCount}%)` }}
         >
           {testimonials.map((testimonial) => (
             <div
               key={testimonial.id}
               className={`w-full md:w-1/2 xl:w-1/3 flex-shrink-0 px-2 md:px-4`}
             >
               <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md 
                            transition-all duration-300 h-full flex flex-col group">
                 <div className="flex items-start gap-4 mb-6">
                   <div>
                     <h3 className="font-medium text-gray-900 text-lg mb-1">
                       {testimonial.name}
                     </h3>
                     <p className="text-sm text-gray-500 mb-2">
                       {testimonial.role}
                     </p>
                     <StarRating rating={testimonial.rating} />
                   </div>
                 </div>
                 <blockquote className="flex-grow">
                   <p className="text-gray-600 text-base leading-relaxed">
                     "{testimonial.content}"
                   </p>
                 </blockquote>
               </div>
             </div>
           ))}
         </div>
       </div>

       <button
         onClick={handleNext}
         className="md:hidden absolute -right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md 
                  hover:shadow-lg transition-all z-10 text-gray-700"
         aria-label="Next testimonial"
       >
         <ChevronRight className="w-4 h-4" />
       </button>
     </div>

     <div className="flex justify-center mt-6 gap-2 md:hidden">
       {testimonials.map((_, index) => (
         <button
           key={index}
           onClick={() => setCurrentIndex(index)}
           className={`w-2 h-2 rounded-full transition-all duration-300 ${
             index === currentIndex 
               ? 'w-6 bg-blue-600' 
               : 'bg-gray-300 hover:bg-gray-400'
           }`}
           aria-label={`Go to testimonial ${index + 1}`}
         />
       ))}
     </div>
   </div>
 );
};

export default TestimonialSlider;