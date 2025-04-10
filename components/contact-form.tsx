'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(
    null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      // In a real app, you would send the form data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 backdrop-blur-sm bg-purple-900/10 p-6 rounded-xl border border-white/10"
    >
      <h3 className="text-xl font-semibold mb-4">Schreib uns</h3>

      <div>
        <Input
          type="text"
          name="name"
          placeholder="Dein Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
        />
      </div>

      <div>
        <Input
          type="email"
          name="email"
          placeholder="Deine E-Mail"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
        />
      </div>

      <div>
        <Textarea
          name="message"
          placeholder="Deine Nachricht"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className={`w-full rounded-full transition-all ${
          isSubmitting
            ? 'bg-purple-700'
            : 'bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-blue-500/80 hover:shadow-lg hover:shadow-purple-500/30'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Wird gesendet...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Senden <Send size={16} />
          </span>
        )}
      </Button>

      {submitStatus === 'success' && (
        <div className="rounded-md bg-green-500/20 p-3 text-green-200">
          Danke für deine Nachricht! Wir melden uns bald bei dir.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="rounded-md bg-red-500/20 p-3 text-red-200">
          Es gab ein Problem beim Senden deiner Nachricht. Bitte versuche es
          später noch einmal.
        </div>
      )}
    </form>
  );
}
