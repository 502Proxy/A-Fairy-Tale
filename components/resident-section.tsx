'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface Resident {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export default function ResidentsSection() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchResidents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/residents');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Resident[] = await response.json();
        setResidents(data);
        if (data.length === 0) {
          setActiveIndex(-1);
        } else {
          setActiveIndex(0);
        }
      } catch (e) {
        console.error('Error fetching residents:', e);
        setError('Fehler beim Laden der Resident DJs.');
        if (e instanceof Error) {
          setError(`Fehler beim Laden: ${e.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResidents();
  }, []);

  const activeResident =
    residents.length > 0 && activeIndex >= 0 ? residents[activeIndex] : null;

  const nextResident = () => {
    if (residents.length === 0) return;
    const newIndex = (activeIndex + 1) % residents.length;
    setActiveIndex(newIndex);
  };

  const prevResident = () => {
    if (residents.length === 0) return;
    const newIndex = activeIndex === 0 ? residents.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
  };

  const selectResident = (index: number) => {
    setActiveIndex(index);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
        <p className="ml-4 text-lg text-gray-300">Lade Resident DJs...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 py-10">{error}</div>;
  }

  if (!activeResident || residents.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10">
        Keine Resident DJs gefunden.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
        <div className="relative aspect-square overflow-hidden rounded-xl shadow-2xl shadow-purple-900/30">
          {activeResident.image && (
            <Image
              src={activeResident.image || '/placeholder.svg'}
              alt={activeResident.name}
              fill
              className="object-cover transition-opacity duration-500"
              priority={activeIndex === 0}
            />
          )}
        </div>

        <div className="backdrop-blur-sm bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-white/10">
          <h3 className="text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
            {activeResident.name}
          </h3>
          <p className="text-blue-300 mb-4">{activeResident.role}</p>
          <p className="text-gray-200">{activeResident.bio}</p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevResident}
          disabled={residents.length <= 1} // Deaktiviere, wenn nur 1 oder 0 DJs
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 ${residents.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Previous resident"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex flex-wrap justify-center gap-2">
          {residents.map((resident, index) => (
            <button
              key={resident.id}
              onClick={() => selectResident(index)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                // Textgröße evtl. anpassen
                index === activeIndex
                  ? 'bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-blue-500/80 text-white scale-110' // Aktiven hervorheben
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {resident.name}
            </button>
          ))}
        </div>

        <button
          onClick={nextResident}
          disabled={residents.length <= 1} // Deaktiviere, wenn nur 1 oder 0 DJs
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 ${residents.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Next resident"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
