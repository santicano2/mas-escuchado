"use client";

import { ArrowBigUp, ArrowBigDown } from "lucide-react";

interface GuessButtonsProps {
  onGuess: (higher: boolean) => void;
  disabled: boolean;
}

export function GuessButtons({ onGuess, disabled }: GuessButtonsProps) {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={() => onGuess(true)}
        className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors"
        disabled={disabled}
      >
        <ArrowBigUp className="w-6 h-6" />
        Más
      </button>
      <button
        onClick={() => onGuess(false)}
        className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors"
        disabled={disabled}
      >
        <ArrowBigDown className="w-6 h-6" />
        Menos
      </button>
    </div>
  );
}
