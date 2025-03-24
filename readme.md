## 1. Projektübersicht

"A Fairy Tale" ist eine responsive Website für ein Musik-Kollektiv, das elektronische Musik-Events organisiert. Die Website bietet Informationen über das Kollektiv, kommende Events, eine Bildergalerie und Kontaktmöglichkeiten. Das Design ist in einem verträumten, verspielten Stil mit einer dezenten Farbpalette aus Lila, Pink und Blau gehalten, ergänzt durch einen magischen Sternenhimmel-Hintergrund.

## 2. Technologie-Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **UI-Komponenten**: shadcn/ui
- **Animationen**:

- Canvas-basierte Hintergrundanimation mit Sternen und Glitzereffekten
- CSS-Animationen



- **Icons**: Lucide React


## 3. Projektstruktur

```plaintext
/
├── app/
│   ├── layout.tsx       # Haupt-Layout der Anwendung
│   ├── page.tsx         # Hauptseite mit allen Sektionen
│   └── globals.css      # Globale CSS-Definitionen
├── components/
│   ├── animated-background.tsx  # Canvas-Animation mit Sternen und Glitzer
│   ├── countdown-timer.tsx      # Event-Countdown
│   ├── gallery-section.tsx      # Bildergalerie mit Slider
│   ├── contact-form.tsx         # Kontaktformular
│   ├── theme-toggle.tsx         # Dark/Light Mode Toggle
│   └── ui/                      # shadcn/ui Komponenten
├── public/               # Statische Assets
└── tailwind.config.ts    # Tailwind-Konfiguration
```

## 4. Komponenten

### 4.1 Hauptseite (app/page.tsx)

Die Hauptseite ist in mehrere Sektionen unterteilt:

- **Welcome Section**: Logo, Titel und Einführungstext
- **About Us Section**: Informationen über das Kollektiv
- **Next Event Section**: Details zum nächsten Event mit Countdown
- **Gallery Section**: Bildergalerie mit Slider
- **Contact Section**: Kontaktformular und Social-Media-Links


### 4.2 AnimatedBackground

Eine Canvas-basierte Animation, die einen magischen Sternenhimmel mit Glitzereffekten darstellt. Die Animation läuft im Hintergrund und reagiert auf die Fenstergröße.

```typescript
// Hauptfunktionalitäten:
- Drei Arten von Elementen: Sterne, Glitzer und Sternschnuppen
- Sterne pulsieren sanft und haben eine Sternform
- Glitzerelemente blitzen zufällig auf und verblassen wieder
- Gelegentliche Sternschnuppen mit leuchtenden Trails
- Farbpalette in Blau-, Lila- und Pinktönen
- Responsives Verhalten auf verschiedenen Bildschirmgrößen
```

#### 4.2.1 Sterne

Kleine, pulsierende Sterne in verschiedenen Formen und Größen:

- Pulsieren durch Änderung der Transparenz
- Fünfzackige Sternform
- Farben in Weiß und hellen Pastelltönen


#### 4.2.2 Glitzer

Funkelnde Partikel, die zufällig aufblitzen:

- Zufälliges Erscheinen und Verschwinden
- Glühender Effekt durch Radial-Gradienten
- Farben in Lila, Pink und Blau


#### 4.2.3 Sternschnuppen

Gelegentlich erscheinende Sternschnuppen:

- Zufälliges Erscheinen mit geringer Wahrscheinlichkeit
- Bewegung von oben nach unten mit leichtem Winkel
- Leuchtender Trail, der langsam verblasst
- Automatisches Entfernen nach Verlassen des Bildschirms


### 4.3 CountdownTimer

Ein Countdown, der die verbleibende Zeit bis zum nächsten Event anzeigt.

```typescript
// Hauptfunktionalitäten:
- Berechnet die Differenz zwischen aktuellem Datum und Event-Datum
- Aktualisiert die Anzeige jede Sekunde
- Zeigt Tage, Stunden, Minuten und Sekunden an
```

### 4.4 GallerySection

Eine Bildergalerie mit Slider-Funktionalität.

```typescript
// Hauptfunktionalitäten:
- Zeigt Bilder in einem Slider an
- Ermöglicht Navigation mit Pfeil-Buttons
- Zeigt den aktuellen Bild-Index mit Punkten an
```

### 4.5 ContactForm

Ein Kontaktformular mit Validierung und Statusanzeige.

```typescript
// Hauptfunktionalitäten:
- Formularfelder für Name, E-Mail und Nachricht
- Validierung der Eingaben
- Anzeige des Übermittlungsstatus
- Simulierte Formularübermittlung (in einer echten Anwendung würde hier eine API-Anfrage erfolgen)
```

### 4.6 ThemeToggle

Ein Toggle-Button für den Dark/Light Mode.

```typescript
// Hauptfunktionalitäten:
- Wechselt zwischen Dark und Light Mode
- Speichert die Präferenz im localStorage
- Setzt die entsprechende Klasse im HTML-Element
```

## 5. Styling-Ansatz

Das Styling basiert auf Tailwind CSS mit einem benutzerdefinierten Farbschema:

### 5.1 Farbpalette

Die Website verwendet eine dezente, verträumte Farbpalette:

- Primärfarben: Lila, Pink und Blau in verschiedenen Schattierungen
- Hintergrund: Dunkles Blau für den Haupthintergrund mit Sternen und Glitzereffekten
- Akzentfarben: Subtile Farbverläufe für Buttons und Überschriften


### 5.2 Tailwind-Konfiguration

Die Tailwind-Konfiguration definiert benutzerdefinierte Farben und Animationen:

```typescript
// Beispiel für benutzerdefinierte Animationen in globals.css
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
```

## 6. Animationen

### 6.1 Canvas-Animation (Sternenhimmel)

Die Hintergrundanimation verwendet HTML5 Canvas für eine performante Darstellung:

- **Sterne**: Pulsierende Sterne in verschiedenen Größen und Formen
- **Glitzer**: Zufällig aufblitzende Partikel in der Farbpalette der Website
- **Sternschnuppen**: Gelegentlich erscheinende Sternschnuppen mit leuchtenden Trails
- **Optimierungen**: Anpassung der Elementanzahl basierend auf der Bildschirmgröße


### 6.2 CSS-Animationen

- **Float-Animation**: Das Logo schwebt sanft auf und ab
- **Bounce-Animation**: Der Pfeil in der Welcome-Section hüpft leicht
- **Hover-Effekte**: Buttons und Links haben subtile Hover-Effekte


## 7. Responsive Design

Die Website ist vollständig responsiv und passt sich verschiedenen Bildschirmgrößen an:

- **Mobile-First-Ansatz**: Grundlegendes Layout für mobile Geräte
- **Breakpoints**: Anpassungen für größere Bildschirme mit Tailwind-Klassen (md:, lg:)
- **Flexible Bilder**: Bilder passen sich der Containergröße an
- **Grid/Flexbox**: Verwendung von Grid und Flexbox für responsive Layouts


## 8. Erweiterungsmöglichkeiten

### 8.1 CMS-Integration

Für eine einfachere Content-Verwaltung könnte ein Headless CMS integriert werden:

```typescript
// Beispiel für Abruf von Event-Daten aus einem CMS
async function getEvents() {
  const res = await fetch('https://api.cms.com/events');
  return res.json();
}
```

### 8.2 Ticket-Verkauf

Integration eines Ticket-Verkaufssystems:

```typescript
// Beispiel für eine Ticket-Kaufkomponente
function TicketPurchase({ eventId, price }) {
  // Implementierung des Kaufprozesses
}
```

### 8.3 Mehrsprachigkeit

Unterstützung für mehrere Sprachen mit next-intl oder ähnlichen Bibliotheken:

```typescript
// Beispiel für mehrsprachige Texte
const translations = {
  de: {
    welcome: "Willkommen bei A Fairy Tale",
    // weitere Übersetzungen
  },
  en: {
    welcome: "Welcome to A Fairy Tale",
    // weitere Übersetzungen
  }
};
```

### 8.4 Erweiterte Hintergrundanimation

Die Hintergrundanimation könnte weiter ausgebaut werden:

```typescript
// Mögliche Erweiterungen
- Interaktive Elemente, die auf Mausbewegungen reagieren
- Parallax-Effekte für verschiedene Ebenen von Sternen
- Musik-Visualisierung, die auf Audio-Input reagiert
- Jahreszeitliche oder eventbezogene Themen
```


### 9. Performance-Optimierungen

- **Bildoptimierung**: Verwendung von Next.js Image-Komponente für optimierte Bilder
- **Code-Splitting**: Automatisches Code-Splitting durch Next.js
- **Lazy Loading**: Komponenten können bei Bedarf lazy geladen werden
- **Canvas-Optimierung**: Dynamische Anpassung der Partikelanzahl basierend auf der Bildschirmgröße und Geräte-Performance


## 10. Wartung und Updates

### 10.1 Aktualisierung von Event-Daten

Event-Daten können in der `page.tsx` aktualisiert werden:

```typescript
const nextEvent = {
  date: "2025-06-15T21:00:00",
  location: "Kulturzentrum Oldenburg",
  lineup: ["DJ Mystical", "Trance Fairy", "Cosmic Butterfly", "Dream Weaver"],
  ticketLink: "https://tickets.example.com/fairy-tale-june",
};
```

### 10.2 Hinzufügen neuer Galerie-Bilder

Neue Bilder können zum Galerie-Array in `gallery-section.tsx` hinzugefügt werden:

```typescript
const galleryImages = [
  { src: "/images/event1.jpg", alt: "Event 1" },
  // Weitere Bilder hinzufügen
];
```

### 10.3 Anpassung des Hintergrunds

Der Sternenhimmel-Hintergrund kann in `animated-background.tsx` angepasst werden:

```typescript
// Beispiele für Anpassungen
- Ändern der Farben für Sterne und Glitzer
- Anpassen der Häufigkeit von Sternschnuppen
- Hinzufügen neuer Elemente oder Effekte
- Ändern der Bewegungsgeschwindigkeit un
```