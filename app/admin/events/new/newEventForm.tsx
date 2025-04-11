// Datei: app/admin/events/new/NewEventForm.tsx (Beispielpfad)
'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Upload, X, Loader2, AlertCircle, Plus, Trash } from 'lucide-react';
import { EventStatus } from '@prisma/client';


interface EventFormData {
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  description: string;
  ticketLink: string;
  status: EventStatus; // Nutze den Enum-Typ
}

export default function NewEventForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    ticketLink: '',
    status: EventStatus.upcoming, // Standardwert direkt aus Enum
  });
  const [lineup, setLineup] = useState<string[]>(['']);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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
    } else {
      setImageFile(null);
      setPreviewImage(null);
    }
  };

  const removePreviewImage = () => {
    setImageFile(null);
    setPreviewImage(null);
    const fileInput = document.getElementById(
      'image-upload'
    ) as HTMLInputElement; // ID angepasst
    if (fileInput) fileInput.value = '';
  };

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
      setLineup(['']);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    let uploadedImageUrl: string | null = null;

    if (!formData.date || !formData.time) {
      setError('Bitte geben Sie ein gültiges Datum und eine Uhrzeit an.');
      setIsSubmitting(false);
      return;
    }
    let eventDateTime: string;
    try {
      const combinedDateTime = new Date(`${formData.date}T${formData.time}:00`);
      if (isNaN(combinedDateTime.getTime())) {
        throw new Error('Ungültiges Datum oder Uhrzeit Format.');
      }
      eventDateTime = combinedDateTime.toISOString();
    } catch (dateError: any) {
      setError(
        dateError.message || 'Fehler beim Verarbeiten von Datum/Uhrzeit.'
      );
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
        if (!uploadResult.imageUrl) {
          throw new Error(
            'Bild-Upload war erfolgreich, aber keine URL erhalten.'
          );
        }
        uploadedImageUrl = uploadResult.imageUrl;
      }

      const eventDataToSave = {
        title: formData.title,
        date: eventDateTime,
        location: formData.location,
        description: formData.description,
        image: uploadedImageUrl,
        lineup: lineup
          .map((artist) => artist.trim())
          .filter((artist) => artist !== ''),
        ticketLink: formData.ticketLink || null,
        status: formData.status,
      };

      const createResponse = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventDataToSave),
      });
      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}));
        throw new Error(
          `Fehler beim Erstellen des Events: ${errorData.message || createResponse.statusText}`
        );
      }

      router.push('/admin/events');
      router.refresh();
    } catch (err: any) {
      console.error('Fehler beim Erstellen des Events:', err);
      setError(err.message || 'Ein unbekannter Fehler ist aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-6 rounded-md bg-red-900/50 border border-red-500/30 p-4 text-red-200 flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 md:p-8 backdrop-blur-sm border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Event-Bild
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative h-32 w-48 overflow-hidden rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
                {previewImage ? (
                  <>
                    <Image
                      src={previewImage}
                      alt="Vorschau"
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
                  htmlFor="image-upload"
                  className="cursor-pointer rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                >
                  Bild auswählen
                </label>
                <input
                  type="file"
                  id="image-upload"
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
              className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              placeholder="z.B. A Fairy Tale - Summer Edition"
            />
          </div>

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
              className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              placeholder="z.B. Kulturzentrum Oldenburg"
            />
          </div>

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
              className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              placeholder="Beschreibung des Events..."
            />
          </div>

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
                    className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                    placeholder="Act Name"
                  />
                  <button
                    type="button"
                    onClick={() => removeLineupEntry(index)}
                    title="Entfernen"
                    disabled={lineup.length <= 1 && lineup[0] === ''}
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
              className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              placeholder="https://"
            />
          </div>

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
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as EventStatus,
                }))
              }
              className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white focus:border-purple-500 focus:ring-purple-500"
            >
              {Object.values(EventStatus).map((statusValue) => (
                <option key={statusValue} value={statusValue}>
                  {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Link
              href="/admin/events"
              className="w-full sm:w-auto rounded-md bg-white/10 px-5 py-2.5 text-center font-medium text-white hover:bg-white/20"
            >
              Abbrechen
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-md bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-5 py-2.5 text-center font-medium text-white hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-purple-300/50 disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? 'Wird erstellt...' : 'Event erstellen'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
