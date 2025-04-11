'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Mail } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError('Ungültige E-Mail oder Passwort.');
      } else if (result?.ok) {
        router.push('/admin');
      } else {
        setError('Ein unbekannter Anmeldefehler ist aufgetreten.');
      }
    } catch (err) {
      setError(
        'Ein Netzwerkfehler ist aufgetreten. Bitte versuche es später erneut.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-8 backdrop-blur-sm border border-white/10 shadow-xl">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 h-20 w-20 relative">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="A Fairy Tale Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-400">
            Melde dich an, um deine Website zu verwalten
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-500/20 p-3 text-center text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              E-Mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 pl-10 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-300"
            >
              Passwort
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="block w-full rounded-md border border-white/10 bg-white/5 p-2.5 pl-10 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-5 py-2.5 text-center font-medium text-white hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-purple-300/50 disabled:opacity-50"
          >
            {isLoading ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <Link href="/" className="hover:text-white">
            Zurück zur Website
          </Link>
        </div>
      </div>
    </div>
  );
}
