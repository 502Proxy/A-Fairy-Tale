// Datei: app/admin/residents/new/NewResidentForm.tsx (Beispielpfad)
'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';

// Typ für Formulardaten
interface ResidentFormData {
  name: string;
  role: string;
  bio: string;
}

export default function NewResidentForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<ResidentFormData>({
    name: '',
    role: '',
    bio: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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
      // Optional: Dateigrößen-/Typ-Validierung hier hinzufügen
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
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    let uploadedImageUrl: string | null = null;

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

      const residentDataToSave = { ...formData, image: uploadedImageUrl };

      const createResponse = await fetch('/api/residents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(residentDataToSave),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}));
        throw new Error(
          `Fehler beim Speichern: ${errorData.message || createResponse.statusText}`
        );
      }

      router.push('/admin/residents');
      router.refresh(); // Wichtig für Server Components auf der Liste
    } catch (err: any) {
      console.error('Fehler beim Erstellen:', err);
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

      <div className="rounded-xl bg-gradient-to-br  mx-auto max-w-3xl w-full from-purple-900/20 to-blue-900/20 p-6 md:p-8 backdrop-blur-sm border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Profilbild
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
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
              placeholder="DJ Name"
            />
          </div>

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
              placeholder="z.B. Resident DJ"
            />
          </div>

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
              value={formData.bio}
              onChange={handleChange}
              className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              placeholder="Kurze Beschreibung..."
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Link
              href="/admin/residents"
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
              {isSubmitting ? 'Wird gespeichert...' : 'Speichern'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
