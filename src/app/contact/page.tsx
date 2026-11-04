'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    // Simulate prompt response
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success('Thank you! Your message has been received. Our team will contact you shortly.');
    }, 800);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FEFCF3] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Link */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-[#00ACDF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>

          {/* Page Heading */}
          <div className="bg-white border border-[#BDDFEA] rounded-2xl p-6 sm:p-10 shadow-sm mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F8] text-[#00ACDF] text-xs font-semibold uppercase tracking-wider mb-4">
              <MessageSquare className="w-4 h-4" /> We&apos;re Here To Help
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">
              Contact PetSolutions.lk
            </h1>
            <p className="text-base text-text-muted max-w-2xl">
              Have questions about pet diets, order tracking, product recommendations, or payment queries? Reach out to our dedicated pet-care support team in Sri Lanka.
            </p>
          </div>

          {/* Grid Layout: Contact Info & Form */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column: Direct Info Cards */}
            <div className="space-y-4">
              {/* Phone / WhatsApp */}
              <div className="bg-white border border-[#BDDFEA] p-5 rounded-2xl shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#E6F4F8] flex items-center justify-center text-[#00ACDF] mb-3">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#1A1A2E] text-base mb-1">Customer Support Hotline</h3>
                <p className="text-sm text-[#2D2D3F] mb-3">+94 77 123 4567</p>
                <a
                  href="https://wa.me/94771234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  Chat on WhatsApp &rarr;
                </a>
              </div>

              {/* Email */}
              <div className="bg-white border border-[#BDDFEA] p-5 rounded-2xl shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#E6F4F8] flex items-center justify-center text-[#00ACDF] mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#1A1A2E] text-base mb-1">Email Inquiries</h3>
                <p className="text-sm text-[#2D2D3F] mb-1">support@petsolutions.lk</p>
                <p className="text-xs text-text-muted">Response within 24 hours</p>
              </div>

              {/* Store & Office Location */}
              <div className="bg-white border border-[#BDDFEA] p-5 rounded-2xl shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#E6F4F8] flex items-center justify-center text-[#00ACDF] mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#1A1A2E] text-base mb-1">Fulfillment &amp; Office</h3>
                <p className="text-sm text-[#2D2D3F] leading-snug">
                  PetSolutions.lk Distribution Hub,<br />
                  Colombo, Western Province, Sri Lanka.
                </p>
              </div>

              {/* Business Hours */}
              <div className="bg-white border border-[#BDDFEA] p-5 rounded-2xl shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#E6F4F8] flex items-center justify-center text-[#FFBF00] mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#1A1A2E] text-base mb-1">Operating Hours</h3>
                <div className="text-xs text-[#2D2D3F] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#6B6B7B]">Monday &ndash; Friday:</span>
                    <span className="font-medium">8:30 AM &ndash; 6:30 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6B7B]">Saturday:</span>
                    <span className="font-medium">9:00 AM &ndash; 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B6B7B]">Sunday / Poya:</span>
                    <span className="text-amber-600 font-medium">Orders Online (Dispatch Next Day)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Message Form */}
            <div className="lg:col-span-2 bg-white border border-[#BDDFEA] rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Send Us a Direct Message</h2>
              <p className="text-sm text-text-muted mb-6">
                Fill out the form below and one of our pet care representatives will get back to you shortly.
              </p>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A2E]">Message Sent Successfully!</h3>
                  <p className="text-sm text-[#2D2D3F] max-w-md mx-auto">
                    Thank you for reaching out to PetSolutions.lk. We have received your message and will reply to your provided email address or contact number soon.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#00ACDF] hover:underline pt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A2E] mb-1">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nimal Perera"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#00ACDF] focus:ring-2 focus:ring-[#00ACDF]/20 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A2E] mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#00ACDF] focus:ring-2 focus:ring-[#00ACDF]/20 transition"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A2E] mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="077 XXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#00ACDF] focus:ring-2 focus:ring-[#00ACDF]/20 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A2E] mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="Order inquiry, prescription diet, etc."
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#00ACDF] focus:ring-2 focus:ring-[#00ACDF]/20 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A2E] mb-1">
                      Your Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Write your questions or details here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#00ACDF] focus:ring-2 focus:ring-[#00ACDF]/20 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00ACDF] hover:bg-[#0092bd] text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-sm transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
