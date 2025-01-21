"use client";

interface ErrorScreenProps {
  error: string | null;
}

export function ErrorScreen({ error }: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
      <div className="text-white text-2xl">
        {error || "No hay suficientes artistas para jugar"}
      </div>
    </div>
  );
}
