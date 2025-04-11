'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // useRouter bleibt für Links ggf. nötig
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Clock,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { EventStatus } from '@prisma/client'; // Importiere Enum direkt

interface Event {
  id: string;
  title: string;
  date: string | Date;
  location: string;
  description: string | null;
  image: string | null;
  lineup: string[];
  ticketLink: string | null;
  status: EventStatus;
}

export default function EventsAdminClient() {
  // Session kann hier entfernt werden, wenn nicht direkt benötigt
  // const { data: session, status: authStatus } = useSession();
  const router = useRouter(); // Bleibt ggf. für programmatische Navigation

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | EventStatus>('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // isSidebarOpen und handleLinkClick werden vom Layout übernommen

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoadingData(true);
      setError(null);
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          let errorMsg = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
          } catch (e) {}
          throw new Error(errorMsg);
        }
        let data: Event[] = await response.json();
        data = data.map((event) => ({ ...event, date: new Date(event.date) }));
        setEvents(data);
      } catch (e: any) {
        console.error('Failed to fetch events:', e);
        setError('Fehler beim Laden der Events.');
      } finally {
        setIsLoadingData(false);
      }
    };
    // Der Aufruf sollte idealerweise nur erfolgen, wenn sicher ist,
    // dass der User eingeloggt ist (durch die Page-Komponente sichergestellt)
    fetchEvents();
  }, []); // Lädt beim Mounten

  const handleDeleteEvent = async (id: string, title: string) => {
    if (window.confirm(`Möchtest du das Event "${title}" wirklich löschen?`)) {
      try {
        const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          let errorMsg = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
          } catch (e) {}
          throw new Error(errorMsg);
        }
        setEvents((currentEvents) =>
          currentEvents.filter((event) => event.id !== id)
        );
        alert(`Event "${title}" wurde erfolgreich gelöscht.`);
      } catch (err: any) {
        console.error('Failed to delete event:', err);
        setError(`Fehler beim Löschen von "${title}": ${err.message}`);
        alert(`Fehler beim Löschen von "${title}": ${err.message}`);
      }
    }
  };

  const formatDate = (dateInput: string | Date) => {
    const date =
      typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return 'Ungültiges Datum';
    return (
      date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) +
      ' ' +
      date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) +
      ' Uhr'
    );
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Loading-State für Auth wird hier nicht mehr benötigt

  return (
    // Das äußere Layout (flex, Sidebar etc.) wird entfernt
    <>
      <div className="mb-6 hidden md:flex items-center justify-between">
        <h1 className="text-2xl font-bold">Events verwalten</h1>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-4 py-2 text-white hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
        >
          <Plus size={18} />
          <span>Neues Event erstellen</span>
        </Link>
      </div>
      <div className="mb-6 md:hidden">
        <Link
          href="/admin/events/new"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-4 py-2 text-white hover:from-pink-600 hover:via-purple-600 hover:to-blue-600"
        >
          <Plus size={18} />
          <span>Neues Event erstellen</span>
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 pl-10 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
            placeholder="Nach Titel oder Ort suchen..."
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="rounded-md border border-white/10 bg-white/5 p-2.5 text-white focus:border-purple-500 focus:ring-purple-500 sm:w-auto"
        >
          <option value="all">Alle Events</option>
          {Object.values(EventStatus).map((statusValue) => (
            <option key={statusValue} value={statusValue}>
              {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-900/50 border border-red-500/30 p-4 text-red-200 flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-4 md:p-6 backdrop-blur-sm border border-white/10">
        {isLoadingData ? (
          <div className="flex justify-center items-center py-8">
            {' '}
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />{' '}
            <span className="ml-2 text-gray-300">Lade Events...</span>{' '}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {events.length === 0
              ? 'Noch keine Events angelegt.'
              : 'Keine Events für Filter gefunden.'}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-lg bg-white/5 p-4 transition-all hover:bg-white/10"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative h-48 w-full md:w-48 lg:w-64 overflow-hidden rounded-lg flex-shrink-0">
                    <Image
                      src={event.image || '/placeholder.svg'}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 256px"
                      className="object-cover"
                    />
                    {event.status === 'cancelled' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                        <span className="rotate-[-20deg] rounded-md bg-red-500/80 px-3 py-1 text-lg font-bold text-white">
                          Abgesagt
                        </span>
                      </div>
                    )}
                    {event.status === 'past' && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 text-center text-xs font-medium text-white">
                        Vergangen
                      </div>
                    )}
                    {event.status === 'upcoming' && (
                      <div className="absolute bottom-0 left-0 right-0 bg-green-800/70 py-1 text-center text-xs font-medium text-white">
                        Kommend
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                          {' '}
                          <Clock size={14} />{' '}
                          <span>{formatDate(event.date)}</span>{' '}
                        </div>
                        <p className="text-sm text-gray-300">
                          {event.location}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Link
                          href={`/admin/events/edit/${event.id}`}
                          title="Bearbeiten"
                          className="rounded-md bg-blue-500/20 p-2 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        >
                          {' '}
                          <Pencil size={16} />{' '}
                        </Link>
                        <button
                          onClick={() =>
                            handleDeleteEvent(event.id, event.title)
                          }
                          title="Löschen"
                          className="rounded-md bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          {' '}
                          <Trash2 size={16} />{' '}
                        </button>
                      </div>
                    </div>
                    <p className="mb-3 text-sm text-gray-300 line-clamp-3">
                      {event.description || 'Keine Beschreibung.'}
                    </p>
                    <div className="mb-2">
                      <h4 className="text-sm font-semibold text-gray-300">
                        Line-up:
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {event.lineup && event.lineup.length > 0 ? (
                          event.lineup.map((artist, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300"
                            >
                              {artist}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">
                            Noch nicht bekannt
                          </span>
                        )}
                      </div>
                    </div>
                    {event.ticketLink && (
                      <div className="text-sm mt-1">
                        <span className="text-gray-400">Tickets: </span>
                        <a
                          href={event.ticketLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline break-all"
                        >
                          {event.ticketLink}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
