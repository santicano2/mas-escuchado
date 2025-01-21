"use client";

interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-white mb-2">¿Más o Menos?</h1>
      <p className="text-xl text-white/80">Puntuación: {score}</p>
    </div>
  );
}
