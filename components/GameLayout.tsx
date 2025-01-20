"use client";

import { ArtistCard } from "./ArtistCard";
import { GuessButtons } from "./GuessButtons";

import { Artist } from "@/data/artists";

interface GameLayoutProps {
  currentArtist: Artist;
  nextArtist: Artist;
  showNextListeners: boolean;
  isRevealing: boolean;
  onGuess: (higher: boolean) => void;
}

export function GameLayout({
  currentArtist,
  nextArtist,
  showNextListeners,
  isRevealing,
  onGuess,
}: GameLayoutProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      <ArtistCard artist={currentArtist} showListeners={true} />
      <div className="flex flex-col">
        <ArtistCard
          artist={nextArtist}
          showListeners={showNextListeners}
          isRevealing={isRevealing}
        />
        {!showNextListeners && (
          <GuessButtons onGuess={onGuess} disabled={showNextListeners} />
        )}
      </div>
    </div>
  );
}
