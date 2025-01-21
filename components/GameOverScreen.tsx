"use client";

interface GameOverScreenProps {
  score: number;
  onReset: () => void;
}

export function GameOverScreen({ score, onReset }: GameOverScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
      <div className="text-center text-white p-8 rounded-lg bg-black/30 backdrop-blur-sm">
        <h1 className="text-4xl font-bold mb-4">¡Juego Terminado!</h1>
        <p className="text-2xl mb-6">Puntuación final: {score}</p>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-white text-purple-900 rounded-lg font-bold hover:bg-purple-100 transition-colors"
        >
          Jugar de nuevo
        </button>
      </div>
    </div>
  );
}
