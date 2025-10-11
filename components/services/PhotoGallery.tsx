"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Photo {
  id: number;
  alt: string;
  date: string;
  // In a real app, you'd have actual image paths
  placeholder: string;
}

const photos: Photo[] = [
  { id: 1, alt: "Freshly mowed lawn", date: "Aug '24", placeholder: "#86efac" },
  { id: 2, alt: "Garden installation", date: "Sep '24", placeholder: "#fbbf24" },
  { id: 3, alt: "Tree pruning service", date: "Sep '24", placeholder: "#f97316" },
  { id: 4, alt: "Irrigation install", date: "Oct '24", placeholder: "#4ade80" },
];

export function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <section className="py-16 bg-[#F0F4F0] dark:bg-[#1C1C1C] text-[#2F3B30] dark:text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">From The Field</h2>
          <p className="text-[#4A5D4C] dark:text-gray-400">Recent Projects - Real Results</p>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {photos.map((photo, index) => {
            const rotation = index % 2 === 0 ? -2 : 2;

            return (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="field-photo-wrapper group"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div className="field-photo relative bg-white p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-0">
                  {/* Photo placeholder */}
                  <div
                    className="w-full h-48 mb-3 relative overflow-hidden"
                    style={{ backgroundColor: photo.placeholder }}
                  >
                    {/* Color overlay for artistic effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-nature-500/20 to-nature-800/30 mix-blend-multiply" />

                    {/* Subtle grain texture */}
                    <div className="absolute inset-0 opacity-20 mix-blend-overlay"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                      }}
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>

                  {/* Date caption (handwritten style) */}
                  <p className="text-center text-gray-600 font-handwriting text-sm">
                    {photo.date}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Photo hint */}
        <p className="text-center text-[#4A5D4C] dark:text-gray-500 text-sm mt-8 italic">
          Click any photo to view larger
        </p>
      </div>

      {/* Modal */}
      {selectedPhoto && (
        <>
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="relative bg-white p-6 max-w-2xl shadow-2xl">
              <div
                className="w-full h-96"
                style={{ backgroundColor: selectedPhoto.placeholder }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-nature-500/20 to-nature-800/30 mix-blend-multiply" />
              </div>
              <p className="text-center text-gray-600 font-handwriting mt-4">
                {selectedPhoto.date} - {selectedPhoto.alt}
              </p>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500&display=swap');

        .font-handwriting {
          font-family: 'Caveat', cursive;
        }

        .field-photo {
          filter: grayscale(30%) contrast(120%);
          transition: all 0.3s ease;
        }

        .field-photo:hover {
          filter: grayscale(0%) contrast(100%);
        }
      `}</style>
    </section>
  );
}
