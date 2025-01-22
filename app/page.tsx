"use client";

import { useState, useEffect } from "react";

import { SpotifyArtist } from "@/lib/spotify";

import { ScoreDisplay } from "@/components/ScoreDisplay";
import { GameLayout } from "@/components/GameLayout";
import { GameOverScreen } from "@/components/GameOverScreen";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ErrorScreen } from "@/components/ErrorScreen";
import { StartMenu } from "@/components/StartMenu";

export default function Home() {
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [showNextListeners, setShowNextListeners] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/artists");
      if (!response.ok) throw new Error("Error al cargar los artistas");
      const data = await response.json();
      setArtists(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleGuess = (higher: boolean) => {
    setIsRevealing(true);
    setShowNextListeners(true);

    const isCorrect = higher
      ? nextArtist.monthlyListeners >= currentArtist.monthlyListeners
      : nextArtist.monthlyListeners <= currentArtist.monthlyListeners;

    setTimeout(() => {
      if (isCorrect) {
        setScore(score + 1);
        setCurrentIndex(nextIndex);
        setNextIndex((nextIndex + 1) % artists.length);
        if (nextIndex + 1 === currentIndex) {
          setGameOver(true);
        }
      } else {
        setGameOver(true);
      }
      setShowNextListeners(false);
      setIsRevealing(false);
    }, 2000);
  };

  const resetGame = async () => {
    setLoading(true);
    await fetchArtists();
    setScore(0);
    setCurrentIndex(0);
    setNextIndex(1);
    setShowNextListeners(false);
    setGameOver(false);
    setIsRevealing(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || artists.length < 2) {
    return <ErrorScreen error={error} />;
  }

  if (gameOver) {
    return <GameOverScreen score={score} onReset={resetGame} />;
  }

  if (!gameStarted) {
    return <StartMenu onStart={() => setGameStarted(true)} />;
  }

  const currentArtist = artists[currentIndex];
  const nextArtist = artists[nextIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <ScoreDisplay score={score} />
        <GameLayout
          currentArtist={currentArtist}
          nextArtist={nextArtist}
          showNextListeners={showNextListeners}
          isRevealing={isRevealing}
          onGuess={handleGuess}
        />
      </div>
    </div>
  );
}
