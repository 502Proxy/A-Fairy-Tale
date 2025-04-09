"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Resident {
  id: string
  name: string
  role: string
  bio: string
  image: string
}

export default function ResidentsSection() {
  const residents: Resident[] = [
    {
      id: "dj1",
      name: "Takttornado",
      role: "Resident DJ",
      bio: "Seit 2018 legt Takttornado auf und bringt mit seinen hard bouncy Trance-Sets die Tanzfläche zum Beben.",
      image: "/team/TAKTTORNADo.jpg",
    },
    {
      id: "dj2",
      name: "Libero",
      role: "Resident DJ",
      bio: "Libero ist bekannt für seine energiegeladenen Full-On- und Trance -Sets, die dich auf eine Reise durch Zeit und Raum mitnehmen.",
      image: "/team/LIBERO.jpg",
    },
    {
      id: "dj3",
      name: "Keva",
      role: "Resident DJ ",
      bio: "Als DJ und Deko-Künstlerin bringt Keva nicht nur musikalisch, sondern auch visuell Magie in unsere Events.",
      image: "/team/KEVA.jpg",
    },
    {
      id: "dj4",
      name: "Flipse",
      role: "Resident DJ",
      bio: "Flipse verbindet geschickt verschiedene Trance-Stile und erschafft Sets, die sowohl tanzbar als auch tiefgründig sind.",
      image: "/placeholder.svg?height=600&width=600",
    },
    {
        id: "dj5",
        name: "Turner",
        role: "Resident DJ",
        bio: "",
        image: "/placeholder.svg?height=600&width=600",
      },
  ]

  const [activeResident, setActiveResident] = useState<Resident>(residents[0])
  const [activeIndex, setActiveIndex] = useState(0)

  const nextResident = () => {
    const newIndex = (activeIndex + 1) % residents.length
    setActiveIndex(newIndex)
    setActiveResident(residents[newIndex])
  }

  const prevResident = () => {
    const newIndex = activeIndex === 0 ? residents.length - 1 : activeIndex - 1
    setActiveIndex(newIndex)
    setActiveResident(residents[newIndex])
  }

  const selectResident = (index: number) => {
    setActiveIndex(index)
    setActiveResident(residents[index])
  }

  return (
    <div className="relative">
      {/* Resident Display */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
        <div className="relative aspect-square overflow-hidden rounded-xl shadow-2xl shadow-purple-900/30">
          <Image
            src={activeResident.image || "/placeholder.svg"}
            alt={activeResident.name}
            fill
            className="object-cover transition-opacity duration-500"
          />
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
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          aria-label="Previous resident"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex flex-wrap justify-center gap-2">
          {residents.map((resident, index) => (
            <button
              key={resident.id}
              onClick={() => selectResident(index)}
              className={`px-4 py-2 rounded-full transition-all ${
                index === activeIndex
                  ? "bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-blue-500/80 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {resident.name}
            </button>
          ))}
        </div>

        <button
          onClick={nextResident}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          aria-label="Next resident"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  )
}
