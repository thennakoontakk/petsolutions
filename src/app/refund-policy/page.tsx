import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { RotateCcw, CheckCircle, XCircle, Clock, CreditCard, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Returns & Refund Policy | PetSolutions.lk',
  description: 'Learn about our 7-day return policy, refund processing timelines, and cancellation guidelines for pet products across Sri Lanka.',
};

export default function RefundPolicyPage() {
  const lastUpdated = 'November 2026';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FEFCF3] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-[#00ACDF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>

          {/* Header Card */}
          <div className="bg-white border border-[#BDDFEA] rounded-2xl p-6 sm:p-10 shadow-sm mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F8] text-[#00ACDF] text-xs font-semibold uppercase tracking-wider mb-4">
              <RotateCcw className="w-4 h-4" /> Customer Satisfaction
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight mb-3">
              Returns &amp; Refund Policy
            </h1>
            <p className="text-sm text-text-muted">
              Last Updated: {lastUpdated} &bull; Clear, transparent return procedures for all customers
            </p>
          </div>

          {/* Body */}
          <div className="bg-white border border-[#BDDFEA] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-[#2D2D3F] leading-relaxed">
            
            {/* 1. Policy Overview */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#1A1A2E]">1. Return Eligibility Window</h2>
              <p>
                At <strong>PetSolutions.lk</strong>, we take the health, safety, and happiness of your pets seriously. If an item you ordered arrives damaged, defective, expired, or incorrect, you are eligible for an exchange or full refund within <strong>7 calendar days</strong> of receiving your parcel.
              </p>
            </section>

            {/* 2. Eligible vs Non-eligible */}
            <section className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E]">2. Eligible vs. Non-Returnable Items</h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" /> Returnable Items
                  </div>
                  <ul className="text-xs text-emerald-950 space-y-1.5 list-disc pl-4">
                    <li>Unopened pet accessories, collars, harnesses, and leashes in original packaging.</li>
                    <li>Defective electronic pet gadgets (feeders, clippers, fountains) with complete accessories.</li>
                    <li>Items damaged in transit or defective prior to delivery.</li>
                    <li>Incorrectly shipped product or size variant compared to the order invoice.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
                  <div className="flex items-center gap-2 text-rose-800 font-bold mb-2">
                    <XCircle className="w-5 h-5 text-rose-600" /> Non-Returnable Items
                  </div>
                  <ul className="text-xs text-rose-950 space-y-1.5 list-disc pl-4">
                    <li>Opened bags or cans of pet food, treats, and edible snacks (due to hygiene and safety regulations).</li>
                    <li>Pharmaceutical products, flea/tick spot-on treatments, and medicinal supplements once the tamper seal is broken.</li>
                    <li>Customized, engraved pet ID tags or personalized gear.</li>
                    <li>Items damaged due to pet chewing, misuse, or improper care.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. Return Steps */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E]">3. How to Initiate a Return</h2>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>
                  <strong>Contact Customer Support:</strong> Send a WhatsApp message or email to our support team within 7 days of delivery with your <em>Order Number</em>, proof of purchase, and clear photos/videos of the issue.
                </li>
                <li>
                  <strong>Verification &amp; Collection:</strong> Our team will review the claim within 24 hours. Once verified, our delivery partner will be scheduled to collect the parcel from your address or you may dispatch it to our central hub.
                </li>
                <li>
                  <strong>Quality Check:</strong> Upon receiving the returned package, our team inspects the item to confirm condition and serial/batch integrity.
                </li>
              </ol>
            </section>

            {/* 4. Refund Processing */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#00ACDF]" /> 4. Refund Processing &amp; Timelines
              </h2>
              <p className="text-sm">
                Once your return is inspected and approved, your refund will be processed promptly:
              </p>
              <div className="bg-[#F9F6EE] p-4 rounded-xl space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#00ACDF] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Online Card Payments (Credit/Debit):</strong> The refund will be credited back to the original card used during checkout. Depending on your issuing bank in Sri Lanka (Commercial Bank, Sampath, HNB, etc.), it typically appears on your statement within <strong>5 to 10 working days</strong>.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#00ACDF] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Bank Transfers / COD:</strong> Transferred directly into your designated Sri Lankan bank account within <strong>3 to 5 working days</strong>.
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Cancellations */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E]">5. Order Cancellations</h2>
              <p className="text-sm">
                You may cancel your order free of charge at any point <strong>before</strong> the parcel has been dispatched from our fulfillment center. Once handed over to our courier partner, the order cannot be canceled mid-transit and must follow the standard return process upon delivery.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
