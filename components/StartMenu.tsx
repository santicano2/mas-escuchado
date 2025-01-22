"use client";

import { Music2 } from "lucide-react";

interface StartMenuProps {
  onStart: () => void;
}

export function StartMenu({ onStart }: StartMenuProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
      <div className="text-center p-8 rounded-lg bg-black/30 backdrop-blur-sm max-w-lg w-full mx-4">
        <div className="flex justify-center mb-6">
          <Music2 className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">¿Más o Menos?</h1>
        <p className="text-lg text-white/80 mb-8">
          ¿Puedes adivinar qué artista tiene más oyentes mensuales? ¡Pon a
          prueba tus conocimientos musicales!
        </p>
        <button
          onClick={onStart}
          className="px-8 py-4 bg-white text-purple-900 rounded-lg font-bold text-lg hover:bg-purple-100 transition-all transform hover:scale-105"
        >
          Empezar a Jugar
        </button>
      </div>
    </div>
  );
}
