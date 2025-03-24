import Image from "next/image"
import Link from "next/link"
import { ArrowDown, Instagram, Facebook, Send } from "lucide-react"
import AnimatedBackground from "@/components/animated-background"
import CountdownTimer from "@/components/countdown-timer"
import GallerySection from "@/components/gallery-section"
import ContactForm from "@/components/contact-form"
import ThemeToggle from "@/components/theme-toggle"

export default function Home() {

  const nextEvent = {
    date: "2025-04-20T12:00:00",
    location: "A Fairy Tale - Gleispark day Rave",
    lineup: ["tba"],
    ticketLink: "https://rausgegangen.de/events/a-fairy-tale-2/",
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Welcome Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="animate-float mb-8 relative w-64 h-64 md:w-80 md:h-80">
          <Image
            src="/placeholder.svg?height=320&width=320"
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
          Tauche ein in die Welt von A Fairy Tale – elektronische Musik, Magie und Gemeinschaft.
        </p>
        {/* <button className="group flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 backdrop-blur-sm transition-all hover:bg-gradient-to-r hover:from-pink-500/70 hover:via-purple-500/70 hover:to-blue-500/70"
        >
          <span>Mehr erfahren</span>
          <ArrowDown className="animate-bounce" size={18} />

        </button> */}
      </section>

      {/* About Us Section */}
      <section id="about" className="relative py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Über Uns
            </h2>
            <p className="text-gray-200 mb-4">
              A Fairy Tale ist ein Kollektiv aus Oldenburg, das sich der Schaffung magischer Trance-Erlebnisse
              verschrieben hat. Unsere Leidenschaft ist es, Menschen durch Musik, Licht und Gemeinschaft in eine andere
              Welt zu entführen.
            </p>
            <p className="text-gray-200">
              Seit 2020 organisieren wir Events, die mehr als nur Partys sind – sie sind Reisen in eine Welt voller
              Fantasie und Verbindung. Unser Team besteht aus Künstlern, Musikliebhabern und Träumern, die gemeinsam
              unvergessliche Erlebnisse schaffen.
            </p>
          </div>
          <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl shadow-purple-900/30">
            <Image src="/placeholder.svg?height=400&width=600" alt="A Fairy Tale Event" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Next Event Section */}
      <section id="events" className="relative py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="backdrop-blur-sm bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-8 border border-white/10 shadow-xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400">
            Nächstes Event
          </h2>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">{nextEvent.location}</h3>
              <p className="text-xl text-pink-300 mb-6">
                {new Date(nextEvent.date).toLocaleDateString("de-DE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2 text-blue-300">Line-up:</h4>
                <ul className="space-y-1">
                  {nextEvent.lineup.map((artist, index) => (
                    <li key={index} className="text-gray-200">
                      {artist}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={nextEvent.ticketLink}
                className="inline-block rounded-full bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-blue-500/80 px-8 py-3 font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
              >
                Tickets sichern
              </Link>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-lg mb-4">Noch bis zum Event:</p>
              <CountdownTimer targetDate={nextEvent.date} />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="relative py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          Galerie
        </h2>

        <GallerySection />

        <div className="mt-12 text-center">
          <div className="relative aspect-video max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-purple-900/30">
            <Image
              src="/placeholder.svg?height=720&width=1280"
              alt="Aftermovie Thumbnail"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
          <p className="mt-4 text-gray-300">Aftermovie: A Fairy Tale - Winter Edition 2024</p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400">
              Kontakt
            </h2>
            <p className="text-gray-200 mb-8">
              Hast du Fragen, Anregungen oder möchtest du Teil unseres Kollektivs werden? Schreib uns eine Nachricht
              oder folge uns auf Social Media für die neuesten Updates.
            </p>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Folge uns</h3>
              <div className="flex gap-4">
                <Link
                  href="https://www.instagram.com/afairytale.ol/?locale=id%2Bmaxwin%E3%80%90GB77.CC%E3%80%91.bsca&hl=en"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 transition-transform hover:scale-110"
                >
                  <Instagram size={24} />
                </Link>
              </div>
            </div>

            {/* <div>
              <Link
                href="#join"
                className="inline-block rounded-full bg-white/10 px-6 py-3 font-medium backdrop-blur-sm transition-all hover:bg-gradient-to-r hover:from-pink-500/70 hover:via-purple-500/70 hover:to-blue-500/70"
              >
                Mitmachen
              </Link>
            </div> */}
          </div>

          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 text-center text-sm text-gray-400 border-t border-white/10">
        <p>© {new Date().getFullYear()} A Fairy Tale Kollektiv. Alle Rechte vorbehalten.</p>
      </footer>
    </main>
  )
}

