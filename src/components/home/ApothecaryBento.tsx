'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Shield, Pill, Activity, Phone, Sparkles, Thermometer, ArrowUpRight, CheckCircle2, HeartPulse, Clock } from 'lucide-react';

const pharmaHighlights = [
  {
    id: 'catron',
    name: 'Catron Wound Spray',
    role: 'Maggot & Fly Repellent Antiseptic',
    badge: 'Veterinary Must-Have',
    desc: 'Rapid healing aerosol for open wounds, post-surgery, and summer fly strike prevention.',
    link: '/products?search=catron',
  },
  {
    id: 'fluralaner',
    name: 'Fluralaner Chewables',
    role: '3-Month Flea & Tick Defense',
    badge: 'Extended Protection',
    desc: 'Systemic chewable providing 12 full weeks of tick, flea, and mite eradication.',
    link: '/products?search=fluralaner',
  },
  {
    id: 'dewormer',
    name: 'Broad-Spectrum Dewormers',
    role: 'Intestinal Parasite Eradication',
    badge: 'Quarterly Essential',
    desc: 'Veterinary certified tablets targeting tapeworms, roundworms, and hookworms in dogs & cats.',
    link: '/products?category=parasite-tick-control',
  },
];

export default function ApothecaryBento() {
  const [activePharma, setActivePharma] = useState(0);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#FEFCF3] via-[#F9F6EE] to-[#FEFCF3]">
      {/* Background Soft Specular Atmosphere */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00ACDF 0%, #FFC800 60%, transparent 100%)' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-12 md:mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F8] border border-[#BDDFEA] text-brand-blue text-[11px] font-bold uppercase tracking-wider mb-3">
            <HeartPulse size={14} />
            <span>Authorized Clinical Infrastructure</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text tracking-tight leading-tight">
            The PetSolutions Apothecary Standard
          </h2>
          <p className="text-sm md:text-base text-text-muted mt-3 max-w-2xl leading-relaxed">
            Every pharmaceutical, prescription diet, and topical formula is strictly temperature-monitored, 100% manufacturer-sealed, and authorized by veterinary health authorities.
          </p>
        </div>

        {/* 12-Column Interlocking Gapless Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 md:gap-6 auto-rows-[minmax(180px,auto)]">
          
          {/* ── Tile 1: Veterinary Pharmacy Anchor (Span 7 col, 2 rows on Desktop) ── */}
          <div className="lg:col-span-7 lg:row-span-2 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#BDDFEA]/60 p-6 md:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-600" /> Authorized Pharmacy
                </span>
                <span className="text-xs font-mono text-text-muted">Rx · OTC Verified</span>
              </div>

              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-text mb-2">
                Prescription & Parasite Pharmacy
              </h3>
              <p className="text-xs sm:text-sm text-text-muted max-w-xl mb-6 leading-relaxed">
                Direct distribution of Sri Lanka’s most trusted veterinary pharmaceuticals with verified batch tracking.
              </p>

              {/* Interactive Medicine Tabs */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#F3EFE6] rounded-2xl mb-6">
                {pharmaHighlights.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePharma(idx)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                      activePharma === idx
                        ? 'bg-white text-text shadow-sm'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    {item.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Active Tab Focus Detail Card */}
              <div className="p-5 rounded-2xl bg-[#E6F4F8]/60 border border-[#BDDFEA]/60 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                    {pharmaHighlights[activePharma].role}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {pharmaHighlights[activePharma].badge}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-lg text-text mb-1">
                  {pharmaHighlights[activePharma].name}
                </h4>
                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  {pharmaHighlights[activePharma].desc}
                </p>
                <Link
                  href={pharmaHighlights[activePharma].link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-hover transition-colors"
                >
                  View Product Specifications <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#BDDFEA]/30 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-text-muted flex items-center gap-2">
                <Shield size={16} className="text-emerald-600" />
                Licensed Pharmacist Verification on Every Dispense
              </span>
              <Link
                href="/products?category=parasite-tick-control"
                className="btn btn-primary px-5 py-2.5 rounded-xl text-xs font-bold"
              >
                Browse All Pharmacy
              </Link>
            </div>
          </div>

          {/* ── Tile 2: Prescription Nutrition & Clinical Diets (Span 5 col, 1 row) ── */}
          <div className="lg:col-span-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#BDDFEA]/60 p-6 md:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-[#BDDFEA] transition-all">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-amber-50 text-accent">
                <Pill size={22} />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E6F4F8] text-brand-blue uppercase">
                Gastro · Renal · Urinary
              </span>
            </div>

            <div>
              <h3 className="font-heading font-bold text-xl text-text mb-1">
                Clinical Prescription Diets
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Veterinary therapeutic nutrition from Royal Canin, Hill’s Prescription Diet, and specialized recovery formulas for compromised digestive, kidney, and urinary health.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#BDDFEA]/20 flex items-center justify-between">
              <span className="text-xs font-bold text-text">Authorized Stockist</span>
              <Link
                href="/products?category=dry-wet-pet-food"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:text-brand-blue-hover"
              >
                View Diets <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* ── Tile 3: Live Doctor Tele-Consultation (Span 5 col, 1 row) ── */}
          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#E6F4F8] to-white/90 backdrop-blur-xl border border-[#BDDFEA] p-6 md:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Doctor on Duty Now
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted flex items-center gap-1">
                <Clock size={12} /> ~15 Min Response
              </span>
            </div>

            <div>
              <h3 className="font-heading font-bold text-xl text-text mb-1">
                Veterinary Tele-Guidance
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Unsure about medication dosage or prescription food compatibility? Connect directly with our on-call veterinary specialists via WhatsApp.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#BDDFEA]/30 flex items-center justify-between">
              <span className="text-xs font-semibold text-text-dark">Daily 8:30 AM – 8:30 PM</span>
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
              >
                <Phone size={13} /> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* ── Tile 4: Cold-Chain Monitored Storage (Span 4 col, 1 row) ── */}
          <div className="lg:col-span-4 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#BDDFEA]/60 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 text-brand-blue">
                <Thermometer size={20} />
              </div>
              <span className="text-xs font-mono font-bold text-brand-blue bg-[#E6F4F8] px-2 py-0.5 rounded-md">
                2°C – 8°C
              </span>
            </div>
            <div>
              <h4 className="font-heading font-bold text-lg text-text mb-1">
                Cold-Chain Verified
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Biologics, sensitive tick spot-ons, and probiotics are stored and dispatched in insulated thermal packaging to guarantee active potency.
              </p>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-3 pt-3 border-t border-[#BDDFEA]/20 flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Temperature Integrity Logged
            </div>
          </div>

          {/* ── Tile 5: Direct Prescription Dispatch Hotline (Span 8 col, 1 row) ── */}
          <div className="lg:col-span-8 rounded-3xl bg-gradient-to-r from-white/95 via-[#F9F6EE] to-[#E6F4F8]/70 backdrop-blur-xl border border-[#BDDFEA]/70 p-6 md:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded-lg bg-accent text-white">
                  <Sparkles size={14} />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-text">
                  Rapid Prescription Order Service
                </span>
              </div>
              <h4 className="font-heading font-bold text-xl text-text mb-1">
                Have a Written Prescription from your Vet?
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Simply upload a clear photo of your prescription slip. Our clinical pharmacy team will verify, package, and dispatch to your doorstep islandwide.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
              <Link
                href="/checkout"
                className="btn btn-primary px-6 py-3.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md shadow-accent/20"
              >
                Upload Prescription <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
