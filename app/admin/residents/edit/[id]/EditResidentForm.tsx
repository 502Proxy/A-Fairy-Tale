// app/admin/residents/edit/[id]/EditResidentForm.tsx
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { Resident } from '@prisma/client';
interface EditResidentFormProps {
  initialResidentData: Resident;
}

interface ResidentEditFormData {
  name: string;
  role: string;
  bio: string | null;
  image: string | null; // Wir speichern die URL hier
}

export default function EditResidentForm({
  initialResidentData,
}: EditResidentFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ResidentEditFormData>({
    name: initialResidentData.name,
    role: initialResidentData.role,
    bio: initialResidentData.bio ?? '',
    image: initialResidentData.image ?? null,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialResidentData.image
  ); // Initialisiere mit bestehendem Bild
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    setFormData((prev) => ({ ...prev, image: null })); // Auch im Formular entfernen
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    let imageUrlToSave: string | null = formData.image; // Starte mit der aktuellen Bild-URL

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
      }

      const dataToUpdate = {
        name: formData.name,
        role: formData.role,
        bio: formData.bio,
        image: imageUrlToSave, // Verwende die potenziell neue URL
      };

      const response = await fetch(`/api/residents/${initialResidentData.id}`, {
        // Nutze die ID aus initialData
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

      router.push('/admin/residents');
      router.refresh(); // Wichtig, damit die Liste auf der Übersicht aktualisiert wird!
    } catch (err: any) {
      console.error('Fehler beim Aktualisieren:', err);
      setError(err.message || 'Ein unbekannter Fehler ist aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 backdrop-blur-sm border border-white/10">
      {/* Fehlermeldung oben anzeigen */}
      {error && (
        <div className="mb-6 rounded-md bg-red-900/50 border border-red-500/30 p-4 text-red-200 flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bild-Upload (wie im NewResident Formular) */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Profilbild
          </label>
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-white/5 border border-white/10">
              {previewImage ? ( // Zeige Vorschau ODER aktuelles Bild
                <>
                  <Image
                    src={previewImage}
                    alt="Vorschau/Aktuell"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePreviewImage} // Ermöglicht Entfernen
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
                className="cursor-pointer rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
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

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Rolle */}
        <div>
          <label
            htmlFor="role"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Rolle*
          </label>
          <input
            type="text"
            id="role"
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
            className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Biografie */}
        <div>
          <label
            htmlFor="bio"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Biografie
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={5}
            value={formData.bio ?? ''}
            onChange={handleChange}
            className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/admin/residents"
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
