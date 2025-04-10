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
    welcome: 'Willkommen bei A Fairy Tale',
    // weitere Übersetzungen
  },
  en: {
    welcome: 'Welcome to A Fairy Tale',
    // weitere Übersetzungen
  },
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
  date: '2025-06-15T21:00:00',
  location: 'Kulturzentrum Oldenburg',
  lineup: ['DJ Mystical', 'Trance Fairy', 'Cosmic Butterfly', 'Dream Weaver'],
  ticketLink: 'https://tickets.example.com/fairy-tale-june',
};
```

### 10.2 Hinzufügen neuer Galerie-Bilder

Neue Bilder können zum Galerie-Array in `gallery-section.tsx` hinzugefügt werden:

```typescript
const galleryImages = [
  { src: '/images/event1.jpg', alt: 'Event 1' },
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


# Development und Deployment Workflow

## Übersicht

Dieser Workflow beschreibt den Prozess von der lokalen Entwicklung einer Funktion bis zum automatisierten Deployment einer neuen Version auf die DigitalOcean App Platform. Das Ziel ist es, durch automatisierte Checks und Prozesse eine hohe Code-Qualität sicherzustellen und Releases konsistent und nachvollziehbar zu gestalten.

Der Prozess nutzt:
* **Git:** Für die Versionskontrolle (mit Feature-Branches und `main`).
* **GitHub Pull Requests:** Für Code Reviews und als Trigger für Qualitätschecks.
* **GitHub Actions:** Für die Automatisierung von CI (Continuous Integration) und CD (Continuous Deployment).
    * `ci-checks.yml`: Prüft die Code-Qualität bei Pull Requests.
    * `release.yml`: Erstellt automatisch Releases (Tags, GitHub Releases) bei Merges nach `main`.
    * `deploy.yml`: Deployt automatisch getaggte Versionen auf DigitalOcean.
* **Conventional Commits:** Ein Standard für Commit-Nachrichten, der für die automatische Versionsfindung benötigt wird.
* **Semantic Release:** Ein Tool, das automatisch Versionen basierend auf Conventional Commits bestimmt, Tags erstellt und Releases generiert.
* **DigitalOcean App Platform:** Die Zielplattform für das Deployment.

## Voraussetzungen

* Node.js und npm/yarn installiert.
* Git installiert und konfiguriert.
* Entwickler müssen dem **Conventional Commits** Standard für ihre Commit-Nachrichten folgen. ([Spezifikation](https://www.conventionalcommits.org/))
* **Commitlint** ist eingerichtet (via Husky), um die Einhaltung der Conventional Commits lokal zu unterstützen.
* **Secrets** sind im GitHub Repository konfiguriert (`Settings > Secrets and variables > Actions`):
    * `DIGITALOCEAN_ACCESS_TOKEN`: Dein API-Token für DigitalOcean.
    * `DO_APP_ID`: Die ID deiner App auf der DigitalOcean App Platform.
    * `NPM_TOKEN` (Optional): Nur benötigt, wenn `semantic-release` auch auf npm publizieren soll.
* `semantic-release` ist als Dev-Dependency installiert und konfiguriert (z.B. via `.releaserc.json`).

## Der Prozess: Schritt für Schritt

1.  **Lokale Entwicklung (Feature Branch):**
    * Erstelle einen neuen Branch von `main` für jede neue Funktion oder jeden Bugfix (z.B. `git checkout -b feat/neue-funktion` oder `fix/login-bug`).
    * Entwickle den Code auf diesem Branch.
    * Erstelle Commits für deine Änderungen. **Wichtig:** Verwende dabei **Conventional Commits** für deine Commit-Nachrichten (z.B. `git commit -m "feat: add user login form"` oder `fix: correct calculation error`). Commitlint (via Husky) hilft dir lokal dabei, das Format einzuhalten.

2.  **Pull Request (PR) erstellen:**
    * Wenn die Entwicklung abgeschlossen ist, pushe deinen Feature-Branch zu GitHub (`git push origin feat/neue-funktion`).
    * Erstelle auf GitHub einen Pull Request von deinem Feature-Branch gegen den `main`-Branch.

3.  **Automatisierte CI-Checks (Workflow: `ci-checks.yml`):**
    * Sobald der PR erstellt oder aktualisiert wird, startet **automatisch** der `ci-checks.yml`-Workflow.
    * Dieser Workflow führt folgende Schritte aus:
        * Code auschecken
        * Abhängigkeiten installieren (`npm ci`)
        * Code-Linting (`npm run lint`)
        * Formatierungs-Check (`npm run format:check`)
        * Automatisierte Tests (`npm test`)
        * Build-Check (`npm run build`)
        * Code Scanning mit CodeQL
    * Das Ergebnis (Erfolg/Fehlschlag) wird direkt im Pull Request angezeigt. Ein Fehlschlag blockiert das Mergen (wenn Branch Protection entsprechend konfiguriert ist).

4.  **Code Review und Merge:**
    * Teammitglieder reviewen den Code im Pull Request.
    * Nach erfolgreichem Review und **bestandenen CI-Checks** wird der Pull Request in den `main`-Branch gemerged.

5.  **Automatisierte Release-Erstellung (Workflow: `release.yml`):**
    * Der Merge löst einen Push auf dem `main`-Branch aus, wodurch **automatisch** der `release.yml`-Workflow startet.
    * Dieser Workflow führt `npx semantic-release` aus:
        * `semantic-release` analysiert die Commit-Nachrichten (Conventional Commits!) seit dem letzten Release auf `main`.
        * Es bestimmt die **nächste Versionsnummer** (z.B. `v1.2.3`, `v1.3.0` oder `v2.0.0`) basierend auf den Typen der Commits (`fix:` -> Patch, `feat:` -> Minor, `BREAKING CHANGE:` -> Major).
        * Es erstellt automatisch einen **Git-Tag** mit dieser Versionsnummer (z.B. `v1.2.3`).
        * Es pusht diesen Tag zum GitHub Repository.
        * Es generiert Release Notes aus den Commit-Nachrichten.
        * Es erstellt einen **GitHub Release**-Eintrag mit den Release Notes und dem Tag.
        * (Optional: Aktualisiert `CHANGELOG.md` und `package.json` und committet dies).

6.  **Automatisches Deployment (Workflow: `deploy.yml`):**
    * Das Pushen des neuen Git-Tags (z.B. `v1.2.3`) durch den `release.yml`-Workflow löst **automatisch** den `deploy.yml`-Workflow aus (da er auf `push: tags: ['v*.*.*']` hört).
    * Dieser Workflow:
        * Checkt den Code genau bei diesem Tag aus.
        * Verbindet sich mit DigitalOcean (`doctl`).
        * Triggert ein neues Deployment für die konfigurierte App (`DO_APP_ID`) auf der DigitalOcean App Platform.
        * Wartet optional auf den Abschluss des Deployments.
        * Sendet eine Erfolgs- oder Fehlermeldung.

## Branching-Strategie

* `main`: Der Haupt-Branch. Enthält den produktiven Code. Merges nach `main` lösen Releases aus.
* `feat/*`, `fix/*`, `chore/*`, etc.: Feature-/Bugfix-/Task-Branches, die von `main` abzweigen und per PR wieder nach `main` gemerged werden.

## Commit-Nachrichten: Conventional Commits

Die Einhaltung des Conventional Commits Standards ist **entscheidend** für diesen automatisierten Workflow, da `semantic-release` die Commit-Typen (`feat:`, `fix:`, `BREAKING CHANGE:`, etc.) zur Bestimmung der nächsten Version verwendet.

**Format:** `<type>(<optional scope>): <subject>`

**Beispiele:**
* `feat: allow users to upload avatars`
* `fix(api): correct pagination logic`
* `docs: explain environment variables`
* `chore: update linters`
* `refactor!: drop support for Node 14` (enthält Breaking Change)

## Workflow-Dateien

Die Automatisierung wird durch diese Dateien im Verzeichnis `.github/workflows/` gesteuert:

* `ci-checks.yml`: Definiert die Checks für Pull Requests.
* `release.yml`: Definiert den Release-Prozess bei Merges nach `main`.
* `deploy.yml`: Definiert das Deployment bei neuen Tags.

## Konfigurationsdateien

Wichtige Konfigurationen für diesen Prozess finden sich in:

* `.releaserc.json` (oder `.yml`/`.js`): Konfiguration für `semantic-release`.
* `commitlint.config.cjs` (oder `.js`): Konfiguration für `commitlint`.
* `package.json`: Enthält die npm-Skripte (`lint`, `test`, `build` etc.).