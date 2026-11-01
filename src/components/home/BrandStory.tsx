'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Truck, PackageCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function BrandStory() {
  const trustPillars = [
    {
      icon: ShieldCheck,
      iconClass: 'bs-icon-blue',
      badgeClass: 'bs-badge-blue',
      badge: '100% FACTORY IMPORTED',
      title: 'Direct Overseas Sourcing',
      description:
        'Sourced directly from authorized international manufacturers. Every item comes in tamper-proof factory sealed packaging with authentic barcodes and verified expiry dates.',
    },
    {
      icon: PackageCheck,
      iconClass: 'bs-icon-emerald',
      badgeClass: 'bs-badge-emerald',
      badge: 'CLIMATE MONITORED',
      title: 'Guaranteed Fresh Stock & Safe Storage',
      description:
        'All kibble, wet food, treats, and supplements are stored in temperature-managed clean facilities to preserve maximum freshness, aroma, and essential nutrition.',
    },
    {
      icon: Truck,
      iconClass: 'bs-icon-amber',
      badgeClass: 'bs-badge-amber',
      badge: '24–48 HOUR DISPATCH',
      title: 'Fast Islandwide Doorstep Delivery',
      description:
        'Reliable doorstep dispatch across Colombo, Kandy, Galle, and all 25 districts in Sri Lanka with careful packing and hassle-free Cash on Delivery (COD).',
    },
  ];

  return (
    <section className="bs-section">
      <div className="container">
        <div className="bs-capsule">
          {/* ================================================================
              LEFT: Authentic Real Photograph Showcase (No AI Gradients)
              ================================================================ */}
          <div className="bs-photo-col">
            <div className="bs-photo-frame">
              <Image
                src="/images/storefront/brand-story-dog.jpg"
                alt="PetSolutions Sri Lanka happy pet owner with golden retriever"
                fill
                priority={false}
                sizes="(max-width: 1024px) 100vw, 44vw"
                className="bs-photo-img"
              />

              {/* Natural floating trust chip on photo */}
              <div className="bs-photo-pill">
                <div className="bs-pill-icon">
                  <Sparkles size={18} />
                </div>
                <div className="bs-pill-text">
                  <span className="bs-pill-title">Direct Importers in Sri Lanka</span>
                  <span className="bs-pill-desc">100% Authentic Sealed Global Brands</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================
              RIGHT: Direct Importer Trust & Benefits Column
              ================================================================ */}
          <div className="bs-content-col">
            {/* Header */}
            <div className="bs-head">
              <div className="bs-eyebrow">
                <span className="bs-eyebrow-dot" />
                <span>Why PetSolutions.lk</span>
              </div>

              <h2 className="bs-title">
                Sri Lanka&apos;s Direct Importer for <span>Premium Pet Brands</span>
              </h2>

              <p className="bs-desc">
                We import top-quality dog and cat foods, grooming essentials, flea & tick care, treats, and wellness supplies directly from certified overseas brands — delivered fresh to your doorstep islandwide.
              </p>
            </div>

            {/* 3 Importer Benefit Cards */}
            <div className="bs-cards">
              {trustPillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.title} className="bs-card">
                    <div className={`bs-icon ${pillar.iconClass}`}>
                      <Icon size={20} />
                    </div>

                    <div className="bs-card-content">
                      <div className="bs-card-header">
                        <span className={`bs-card-badge ${pillar.badgeClass}`}>
                          {pillar.badge}
                        </span>
                        <h3 className="bs-card-title">{pillar.title}</h3>
                      </div>
                      <p className="bs-card-desc">{pillar.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reassurance Footer */}
            <div className="bs-foot">
              <div className="bs-foot-stats">
                <span className="bs-foot-dot" />
                <span>Trusted by 15,000+ Sri Lankan Pet Parents</span>
              </div>

              <Link href="/products" className="bs-foot-link">
                <span>Browse Imported Catalog</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
