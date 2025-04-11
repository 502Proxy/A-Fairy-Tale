// app/admin/events/edit/[id]/EditEventForm.tsx
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Upload, X, Loader2, AlertCircle, Plus, Trash } from 'lucide-react';
import { Event as PrismaEvent, EventStatus } from '@prisma/client';

interface EditEventFormProps {
  initialEventData: PrismaEvent;
}

interface EventEditFormData {
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  description: string;
  ticketLink: string;
  status: EventStatus; // Nutze den Enum-Typ
}

export default function EditEventForm({
  initialEventData,
}: EditEventFormProps) {
  const router = useRouter();

  const formatDateTimeForInputs = (date: Date | null | undefined) => {
    if (!date) return { date: '', time: '' };
    const d = new Date(date); // Stelle sicher, dass es ein Date-Objekt ist
    if (isNaN(d.getTime())) return { date: '', time: '' }; // Ungültiges Datum

    // YYYY-MM-DD
    const dateString =
      d.getFullYear() +
      '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + d.getDate()).slice(-2);
    // HH:MM
    const timeString =
      ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    return { date: dateString, time: timeString };
  };

  const initialDateTime = formatDateTimeForInputs(initialEventData.date);

  const [formData, setFormData] = useState<EventEditFormData>({
    title: initialEventData.title,
    date: initialDateTime.date, // Formatierter Datumsteil
    time: initialDateTime.time, // Formatierter Zeitteil
    location: initialEventData.location,
    description: initialEventData.description ?? '', // Fallback für null
    ticketLink: initialEventData.ticketLink ?? '', // Fallback für null
    status: initialEventData.status,
  });

  const [lineup, setLineup] = useState<string[]>(
    initialEventData.lineup ?? ['']
  );
  useEffect(() => {
    // Sicherstellen, dass immer mind. ein Feld da ist
    if (!lineup || lineup.length === 0) {
      setLineup(['']);
    }
  }, [lineup]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialEventData.image
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePreviewImage = () => {
    setImageFile(null);
    setPreviewImage(null);
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // Line-up-Änderungen
  const handleLineupChange = (index: number, value: string) => {
    const newLineup = [...lineup];
    newLineup[index] = value;
    setLineup(newLineup);
  };
  const addLineupEntry = () => {
    setLineup([...lineup, '']);
  };
  const removeLineupEntry = (index: number) => {
    if (lineup.length > 1) {
      const newLineup = [...lineup];
      newLineup.splice(index, 1);
      setLineup(newLineup);
    } else {
      setLineup(['']); // Letztes Feld leeren
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    let imageUrlToSave: string | null | undefined = undefined; // Startet undefiniert

    if (!formData.date || !formData.time) {
      setError('Bitte geben Sie ein gültiges Datum und eine Uhrzeit an.');
      setIsSubmitting(false);
      return;
    }
    let eventDateTime: string;
    try {
      const combinedDateTime = new Date(`${formData.date}T${formData.time}:00`);
      if (isNaN(combinedDateTime.getTime())) {
        throw new Error('Ungültiges Datum/Uhrzeit.');
      }
      eventDateTime = combinedDateTime.toISOString();
    } catch (dateError: any) {
      setError(dateError.message || 'Fehler bei Datum/Uhrzeit.');
      setIsSubmitting(false);
      return;
    }

    try {
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          throw new Error(
            `Bild-Upload fehlgeschlagen: ${errorData.message || uploadResponse.statusText}`
          );
        }
        const uploadResult = await uploadResponse.json();
        imageUrlToSave = uploadResult.imageUrl;
      } else if (previewImage === null && initialEventData.image !== null) {
        imageUrlToSave = null;
      } else {
        // Sonst bleibt die alte URL (oder null, falls vorher schon null)
        imageUrlToSave = initialEventData.image;
      }

      const dataToUpdate = {
        title: formData.title,
        date: eventDateTime, // Kombinierter ISO String
        location: formData.location,
        description: formData.description,
        image: imageUrlToSave, // Entweder neue URL, alte URL oder null
        lineup: lineup.map((a) => a.trim()).filter((a) => a !== ''), // Bereinigtes Lineup
        ticketLink: formData.ticketLink || null,
        status: formData.status,
      };

      const response = await fetch(`/api/events/${initialEventData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToUpdate),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Fehler beim Speichern: ${errorData.message || response.statusText}`
        );
      }

      router.push('/admin/events');
      router.refresh(); // Wichtig für Datenaktualisierung auf der Liste
    } catch (err: any) {
      console.error('Fehler beim Aktualisieren:', err);
      setError(err.message || 'Ein unbekannter Fehler ist aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 backdrop-blur-sm border border-white/10">
      {error && (
        <div className="mb-6 rounded-md bg-red-900/50 border border-red-500/30 p-4 text-red-200 flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bild-Upload */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Event-Bild
          </label>
          <div className="flex items-center gap-4">
            <div className="relative h-32 w-48 overflow-hidden rounded-lg bg-white/5 border border-white/10">
              {previewImage ? (
                <>
                  <Image
                    src={previewImage}
                    alt="Vorschau/Aktuell"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePreviewImage}
                    title="Bild entfernen"
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <Upload size={24} />
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="image"
                className="cursor-pointer rounded-md bg-white/10 px-2  py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
              >
                {previewImage ? 'Bild ändern' : 'Bild auswählen'}
              </label>
              <input
                type="file"
                id="image"
                name="imageFile"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="mt-1 text-xs text-gray-400">
                JPG, PNG, GIF. Max 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Titel */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Titel*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Datum und Uhrzeit */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="date"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Datum*
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div>
            <label
              htmlFor="time"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Uhrzeit*
            </label>
            <input
              type="time"
              id="time"
              name="time"
              required
              value={formData.time}
              onChange={handleChange}
              step="60"
              className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Ort */}
        <div>
          <label
            htmlFor="location"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Ort*
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Beschreibung */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Beschreibung
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Line-up */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Line-up
          </label>
          <div className="space-y-2">
            {lineup.map((artist, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => handleLineupChange(index, e.target.value)}
                  className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Act Name"
                />
                <button
                  type="button"
                  onClick={() => removeLineupEntry(index)}
                  title="Entfernen"
                  disabled={lineup.length === 1}
                  className="rounded-md bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {' '}
                  <Trash size={16} />{' '}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLineupEntry}
              className="flex items-center gap-1 rounded-md bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
            >
              {' '}
              <Plus size={14} />
              <span>Act hinzufügen</span>
            </button>
          </div>
        </div>

        {/* Ticket-Link */}
        <div>
          <label
            htmlFor="ticketLink"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Ticket-Link (optional)
          </label>
          <input
            type="url"
            id="ticketLink"
            name="ticketLink"
            value={formData.ticketLink}
            onChange={handleChange}
            className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white focus:border-purple-500 focus:ring-purple-500"
            placeholder="https://"
          />
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Status*
          </label>
          <select
            id="status"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white focus:border-purple-500 focus:ring-purple-500"
          >
            {/* Stelle sicher, dass alle Enum-Werte angeboten werden */}
            {Object.values(EventStatus).map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}{' '}
                {/* Macht z.B. aus upcoming -> Upcoming */}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/admin/events"
            className="rounded-md bg-white/10 px-5 py-2.5 text-center font-medium text-white hover:bg-white/20"
          >
            Abbrechen
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-5 py-2.5 text-center font-medium text-white hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-purple-300/50 disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Wird gespeichert...' : 'Änderungen speichern'}
          </button>
        </div>
      </form>
    </div>
  );
}
