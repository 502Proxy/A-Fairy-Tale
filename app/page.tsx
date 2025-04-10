import Image from 'next/image';
import Link from 'next/link';
import { Instagram } from 'lucide-react';
import AnimatedBackground from '@/components/animated-background';
import CountdownTimer from '@/components/countdown-timer';
import ResidentsSection from '@/components/resident-section';
import ContactForm from '@/components/contact-form';
import ThemeToggle from '@/components/theme-toggle';
import eventRepository from '@/server/repositories/eventRepository'; // Pfad ggf. anpassen
import { EventStatus } from '@prisma/client';

export default async function Home() {
  let nextEventData = null;
  let fetchError = null;

  try {
    const upcomingEvents = await eventRepository.findMany({
      where: {
        status: EventStatus.upcoming,
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    if (upcomingEvents.length > 0) {
      nextEventData = upcomingEvents[0];
    }
  } catch (error) {
    fetchError = 'Fehler beim Laden des nächsten Events.';
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <AnimatedBackground />

      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="animate-float mb-8 relative w-64 h-64 md:w-80 md:h-80">
          <Image
            src="/logo-removebg-preview.png"
            alt="A Fairy Tale Logo"
            width={320}
            height={320}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="font-display mb-4 text-4xl md:text-6xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
          A FAIRY TALE
        </h1>
        <p className="mb-8 max-w-md text-lg md:text-xl text-gray-200">
          Tauche ein in die Welt von A Fairy Tale – elektronische Musik, Magie
          und Gemeinschaft.
        </p>
      </section>

      <section
        id="about"
        className="relative py-20 px-4 md:px-8 max-w-6xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Über Uns
            </h2>
            <p className="text-gray-200 mb-4">
              A Fairy Tale ist ein Kollektiv aus Oldenburg, das sich der
              Schaffung magischer Trance-Erlebnisse verschrieben hat. Unsere
              Leidenschaft ist es, Menschen durch Musik, Licht und Gemeinschaft
              in eine andere Welt zu entführen.
            </p>
            <p className="text-gray-200">
              Seit 2024 organisieren wir Events, die mehr als nur Partys sind –
              sie sind Reisen in eine Welt voller Fantasie und Verbindung. Unser
              Team besteht aus Künstlern, Musikliebhabern und Träumern, die
              gemeinsam unvergessliche Erlebnisse schaffen.
            </p>
          </div>
          <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl shadow-purple-900/30">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="A Fairy Tale Event"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section
        id="events"
        className="relative py-20 px-4 md:px-8 max-w-6xl mx-auto"
      >
        {fetchError ? (
          <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
            {fetchError}
          </div>
        ) : nextEventData ? (
          <div className="backdrop-blur-sm bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-8 border border-white/10 shadow-xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400">
              Nächstes Event
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {nextEventData.title}
                </h3>
                <p className="text-lg text-gray-300 mb-1">
                  {nextEventData.location}
                </p>
                <p className="text-xl text-pink-300 mb-6">
                  {new Date(nextEventData.date).toLocaleDateString('de-DE', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  {' um '}
                  {new Date(nextEventData.date).toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  Uhr
                </p>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2 text-blue-300">
                    Line-up:
                  </h4>
                  <ul className="space-y-1">
                    {nextEventData.lineup && nextEventData.lineup.length > 0 ? (
                      nextEventData.lineup.map((artist, index) => (
                        <li key={index} className="text-gray-200">
                          {artist}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 italic">
                        Noch nicht bekannt
                      </li>
                    )}
                  </ul>
                </div>

                {nextEventData.ticketLink && (
                  <Link
                    href={nextEventData.ticketLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-blue-500/80 px-8 py-3 font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
                  >
                    Tickets sichern
                  </Link>
                )}
              </div>

              <div className="flex flex-col items-center">
                <p className="text-lg mb-4">Noch bis zum Event:</p>
                <CountdownTimer
                  targetDate={new Date(nextEventData.date).toISOString()}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 backdrop-blur-sm bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-8 border border-white/10 shadow-xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400">
              Nächstes Event
            </h2>
            <p>
              Momentan ist kein kommendes Event geplant. Schau bald wieder
              vorbei!
            </p>
          </div>
        )}
      </section>

      <section
        id="residents"
        className="relative py-20 px-4 md:px-8 max-w-6xl mx-auto"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          Unsere Residents
        </h2>
        <ResidentsSection />
      </section>

      <section
        id="aftermovie"
        className="relative py-20 px-4 md:px-8 max-w-6xl mx-auto"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400">
          Aftermovie
        </h2>
        <div className="text-center">
          <div className="relative aspect-video max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-purple-900/30">
            <video
              controls
              loop
              autoPlay
              muted // Autoplay funktioniert oft nur mit muted
              playsInline // Wichtig für mobile Browser
              className="w-full h-full object-cover"
              preload="metadata"
              poster="/placeholder.svg?height=720&width=1280&text=Video+Laden..." // Optional: Vorschaubild
            >
              <source src="/Aftermovie.mp4" type="video/mp4" />
              Dein Browser unterstützt das Video-Tag nicht.
            </video>
          </div>
          <p className="mt-4 text-gray-300">Aftermovie</p>
        </div>
      </section>

      <section
        id="contact"
        className="relative py-20 px-4 md:px-8 max-w-6xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400">
              Kontakt
            </h2>
            <p className="text-gray-200 mb-8">
              Hast du Fragen, Anregungen? Schreib uns eine Nachricht oder folge
              uns auf Social Media für die neuesten Updates.
            </p>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Folge uns</h3>
              <div className="flex gap-4">
                <Link
                  href="https://www.instagram.com/afairytale.ol/" // Bereinigter Link
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 transition-transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram size={24} />
                </Link>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="relative py-8 px-4 text-center text-sm text-gray-400 border-t border-white/10">
        <p>
          © {new Date().getFullYear()} A Fairy Tale Kollektiv. Alle Rechte
          vorbehalten.
        </p>
      </footer>
    </main>
  );
}
