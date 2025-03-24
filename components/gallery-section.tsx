"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function GallerySection() {
  // Sample gallery images - in a real app, these would come from a CMS or API
  const galleryImages = [
    { src: "/placeholder.svg?height=600&width=800", alt: "Event 1" },
    { src: "/placeholder.svg?height=600&width=800", alt: "Event 2" },
    { src: "/placeholder.svg?height=600&width=800", alt: "Event 3" },
    { src: "/placeholder.svg?height=600&width=800", alt: "Event 4" },
    { src: "/placeholder.svg?height=600&width=800", alt: "Event 5" },
    { src: "/placeholder.svg?height=600&width=800", alt: "Event 6" },
  ]

  const [activeIndex, setActiveIndex] = useState(0)

  const nextImage = () => {
    setActiveIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  }

  return (
    <div className="relative">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-2xl shadow-purple-900/30">
        <Image
          src={galleryImages[activeIndex].src || "/placeholder.svg"}
          alt={galleryImages[activeIndex].alt}
          fill
          className="object-cover transition-opacity duration-500"
        />
      </div>

      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          onClick={prevImage}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          onClick={nextImage}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === activeIndex ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-gray-400/50"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

