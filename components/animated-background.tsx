"use client"

import { useEffect, useRef } from "react"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Fallback-Hintergrund in Blautönen
    document.body.style.background = "linear-gradient(to bottom, #0a1929, #0f2942, #0a1929)"

    // Set canvas dimensions and handle resize
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`

      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr

      ctx.scale(dpr, dpr)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    const stars: Star[] = []
    const glitter: Glitter[] = []
    const shootingStars: ShootingStar[] = []

    const starCount = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 10000))
    const glitterCount = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000))
    const shootingStarProbability = 0.005 // Wahrscheinlichkeit für eine Sternschnuppe pro Frame

    // Sterne-Klasse
    class Star {
      x: number
      y: number
      size: number
      alpha: number
      alphaSpeed: number
      color: string

      constructor() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.size = Math.random() * 1.5 + 0.5
        this.alpha = Math.random() * 0.5 + 0.3
        this.alphaSpeed = 0.0015 + Math.random() * 0.003

        // Sternfarben in der bestehenden Farbpalette
        const colors = [
          "#ffffff", // Weiß
          "#e0e7ff", // Sehr helles Lila
          "#ddd6fe", // Sehr helles Violett
          "#c4b5fd", // Helles Lila
          "#f5d0fe", // Helles Pink
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        // Pulsierender Effekt
        this.alpha += this.alphaSpeed
        if (this.alpha > 0.8 || this.alpha < 0.3) {
          this.alphaSpeed *= -1
        }
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = this.color

        // Stern zeichnen
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const outerRadius = this.size
          const innerRadius = this.size / 2

          const outerX = this.x + Math.cos((i * 2 * Math.PI) / 5) * outerRadius
          const outerY = this.y + Math.sin((i * 2 * Math.PI) / 5) * outerRadius

          const innerX = this.x + Math.cos(((i * 2 + 1) * Math.PI) / 5) * innerRadius
          const innerY = this.y + Math.sin(((i * 2 + 1) * Math.PI) / 5) * innerRadius

          if (i === 0) {
            ctx.moveTo(outerX, outerY)
          } else {
            ctx.lineTo(outerX, outerY)
          }

          ctx.lineTo(innerX, innerY)
        }
        ctx.closePath()
        ctx.fill()

        ctx.restore()
      }
    }

    // Glitzer-Klasse
    class Glitter {
      x: number
      y: number
      size: number
      alpha: number
      alphaSpeed: number
      color: string

      constructor() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.size = Math.random() * 2 + 0.5
        this.alpha = Math.random() * 0.7
        this.alphaSpeed = 0.01 + Math.random() * 0.03

        // Glitzerfarben in der bestehenden Farbpalette
        const colors = [
          "rgba(186, 104, 200, 0.8)", // Lila
          "rgba(156, 39, 176, 0.8)", // Dunkellila
          "rgba(233, 30, 99, 0.8)", // Pink
          "rgba(103, 58, 183, 0.8)", // Violett
          "rgba(33, 150, 243, 0.8)", // Blau
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        // Schnelles Aufblitzen
        this.alpha += this.alphaSpeed
        if (this.alpha > 0.7) {
          this.alpha = 0
          this.x = Math.random() * window.innerWidth
          this.y = Math.random() * window.innerHeight
        }
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.globalAlpha = this.alpha

        // Glühender Effekt
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
        gradient.addColorStop(0, this.color)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }
    }

    // Sternschnuppen-Klasse
    class ShootingStar {
      x: number
      y: number
      length: number
      speed: number
      angle: number
      color: string
      trail: { x: number; y: number }[]
      maxTrail: number
      alpha: number

      constructor() {
        this.angle = (Math.random() * Math.PI) / 4 + Math.PI / 8 // Winkel zwischen PI/8 und 3PI/8
        this.length = Math.random() * 80 + 40
        this.speed = Math.random() * 10 + 15

        // Startposition am oberen Bildschirmrand
        this.x = Math.random() * window.innerWidth
        this.y = -10

        this.trail = []
        this.maxTrail = 10
        this.alpha = 1

        // Farben für Sternschnuppen
        const colors = [
          "#f5d0fe", // Helles Pink
          "#c4b5fd", // Helles Lila
          "#93c5fd", // Helles Blau
          "#ffffff", // Weiß
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        // Bewegung
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed

        // Trail speichern
        this.trail.unshift({ x: this.x, y: this.y })
        if (this.trail.length > this.maxTrail) {
          this.trail.pop()
        }

        // Ausblenden, wenn außerhalb des Bildschirms
        if (this.x > window.innerWidth || this.y > window.innerHeight) {
          this.alpha -= 0.05
        }
      }

      draw() {
        if (!ctx || this.alpha <= 0) return

        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.strokeStyle = this.color
        ctx.lineWidth = 2
        ctx.lineCap = "round"

        // Trail zeichnen
        if (this.trail.length > 1) {
          ctx.beginPath()
          ctx.moveTo(this.trail[0].x, this.trail[0].y)

          for (let i = 1; i < this.trail.length; i++) {
            ctx.lineTo(this.trail[i].x, this.trail[i].y)
            ctx.globalAlpha = this.alpha * (1 - i / this.trail.length) // Verblassen des Trails
          }

          ctx.stroke()
        }

        // Kopf der Sternschnuppe
        ctx.globalAlpha = this.alpha
        ctx.beginPath()
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

        ctx.restore()
      }

      isFinished() {
        return this.alpha <= 0
      }
    }

    // Elemente initialisieren
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star())
    }

    for (let i = 0; i < glitterCount; i++) {
      glitter.push(new Glitter())
    }

    // Animation loop
    let animationFrameId: number

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Zufällig neue Sternschnuppen erstellen
      if (Math.random() < shootingStarProbability && shootingStars.length < 3) {
        shootingStars.push(new ShootingStar())
      }

      // Sternschnuppen filtern (nur aktive behalten)
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        if (shootingStars[i].isFinished()) {
          shootingStars.splice(i, 1)
        }
      }

      // Alle Elemente zeichnen
      stars.forEach((star) => {
        star.update()
        star.draw()
      })

      glitter.forEach((g) => {
        g.update()
        g.draw()
      })

      shootingStars.forEach((star) => {
        star.update()
        star.draw()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <>
      {/* Fallback-Hintergrund in Blautönen */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-[#0a1929] via-[#0f2942] to-[#0a1929]"></div>
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 opacity-80" aria-hidden="true" />
    </>
  )
}

