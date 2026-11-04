import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { FileCheck2, AlertCircle, Scale, ShieldAlert, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | PetSolutions.lk',
  description: 'Terms and conditions governing the use of PetSolutions.lk, purchases, accounts, and pet care supplies.',
};

export default function TermsPage() {
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
              <Scale className="w-4 h-4" /> Legal Agreement
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight mb-3">
              Terms &amp; Conditions
            </h1>
            <p className="text-sm text-text-muted">
              Last Updated: {lastUpdated} &bull; Applicable to all orders, accounts, and visitors
            </p>
          </div>

          {/* Terms Content Body */}
          <div className="bg-white border border-[#BDDFEA] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-[#2D2D3F] leading-relaxed">
            
            {/* 1. Agreement */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#00ACDF]" /> 1. Agreement to Terms
              </h2>
              <p>
                By browsing, accessing, registering an account, or placing an order on <strong>PetSolutions.lk</strong>, you agree to comply with and be bound by these Terms and Conditions, our Privacy Policy, and all applicable laws and regulations of the Democratic Socialist Republic of Sri Lanka.
              </p>
            </section>

            {/* 2. User Accounts */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E]">2. User Accounts &amp; Guest Purchases</h2>
              <p className="text-sm">
                Customers may complete purchases either by registering an account or via our secure Guest Checkout. When creating an account, you must provide accurate, current, and complete personal and contact information. You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
              </p>
            </section>

            {/* 3. Products & Pricing */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E]">3. Product Information &amp; Pricing</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <strong>Currency:</strong> All prices displayed on PetSolutions.lk are denominated in Sri Lankan Rupees (LKR / Rs.) and inclusive of all applicable standard charges unless explicitly stated during checkout.
                </li>
                <li>
                  <strong>Price Adjustments:</strong> We reserve the right to modify prices, update promotional discounts, or discontinue product lines without prior notice due to supplier price revisions or exchange rate adjustments.
                </li>
                <li>
                  <strong>Stock Availability:</strong> While we strive to maintain real-time inventory counts, occasionally an item may run out of stock simultaneously. If an ordered item is unavailable, our support team will promptly notify you to offer an alternative, store credit, or full refund.
                </li>
              </ul>
            </section>

            {/* 4. Veterinary Disclaimer */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2 text-amber-900">
                <AlertCircle className="w-5 h-5 text-amber-600" /> 4. Pet Health &amp; Veterinary Products Disclaimer
              </h2>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900 space-y-2">
                <p>
                  <strong>Professional Consultation Notice:</strong> The information, product descriptions, dosage indicators, and dietary guides provided on PetSolutions.lk are for informational and retail purposes only and do <strong>not</strong> substitute for professional veterinary advice, clinical diagnosis, or medical treatment.
                </p>
                <p>
                  Always consult a licensed Sri Lankan veterinary surgeon regarding medical conditions, parasite treatments (such as spot-ons, sprays, dewormers), or specialized prescription diets for your pets. Always strictly adhere to the manufacturer&apos;s dosage instructions printed on packaging.
                </p>
              </div>
            </section>

            {/* 5. Payments & Security */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#00ACDF]" /> 5. Payments &amp; Order Acceptance
              </h2>
              <p className="text-sm">
                We accept payments via major credit/debit cards (Visa, Mastercard, American Express), digital wallets, and approved payment options facilitated by our accredited payment gateway partners. An order confirmation email/SMS constitutes an acknowledgement of receipt, and order acceptance is finalized once payment clearance is verified and dispatched.
              </p>
            </section>

            {/* 6. Governing Law */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E]">6. Governing Law &amp; Jurisdiction</h2>
              <p className="text-sm">
                These Terms and Conditions shall be governed, interpreted, and enforced in accordance with the laws of the <strong>Democratic Socialist Republic of Sri Lanka</strong>. Any dispute arising out of or in connection with the use of PetSolutions.lk shall be subject to the exclusive jurisdiction of the competent courts in Sri Lanka.
              </p>
            </section>

            {/* 7. Changes to Terms */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E]">7. Modifications to Terms</h2>
              <p className="text-sm">
                We reserve the right to amend or update these terms periodically to reflect operational, legal, or regulatory changes. Your continued usage of the platform following the posting of updated terms constitutes acceptance of those changes.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
