"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Music2 } from "lucide-react";

import { Artist } from "../data/artists";

interface ArtistCardProps {
  artist: Artist;
  showListeners: boolean;
  isRevealing?: boolean;
}

export function ArtistCard({
  artist,
  showListeners,
  isRevealing,
}: ArtistCardProps) {
  const [displayedListeners, setDisplayedListeners] = useState(0);

  useEffect(() => {
    if (isRevealing && showListeners) {
      const duration = 1000;
      const steps = 20;
      const increment = artist.monthlyListeners / steps;
      const stepDuration = duration / steps;

      let current = 0;
      const timer = setInterval(() => {
        current += 1;
        setDisplayedListeners(
          Math.min(Math.floor(current * increment), artist.monthlyListeners)
        );

        if (current >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    } else if (!showListeners) {
      setDisplayedListeners(0);
    } else {
      setDisplayedListeners(artist.monthlyListeners);
    }
  }, [showListeners, isRevealing, artist.monthlyListeners]);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
      <Image
        src={artist.imageUrl}
        alt={artist.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col items-center justify-end p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">{artist.name}</h2>
        <div className="flex items-center gap-2 mb-4">
          <Music2 className="w-6 h-6" />
          {showListeners ? (
            <span className="text-2xl font-semibold">
              {new Intl.NumberFormat("es-ES").format(displayedListeners)}{" "}
              oyentes mensuales
            </span>
          ) : (
            <span className="text-2xl font-semibold">? oyentes mensuales</span>
          )}
        </div>
      </div>
    </div>
  );
}
