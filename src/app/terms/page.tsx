import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Scale, FileCheck2, AlertCircle, ShoppingBag, Truck, CreditCard, ShieldCheck, ArrowLeft, Building2, Phone, Mail } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | PetSolutions.lk',
  description: 'Terms and conditions governing purchases and usage of PetSolutions.lk, operated by Guardian Agriculture (Pvt) Ltd.',
};

export default function TermsPage() {
  const effectiveDate = '4th November 2026';

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
            <p className="text-sm text-text-muted mb-4">
              Effective date: <strong className="text-[#1A1A2E]">{effectiveDate}</strong>
            </p>
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F9F6EE] border border-secondary-alt/40 text-xs text-[#2D2D3F]">
              <Building2 className="w-4 h-4 text-[#00ACDF] mt-0.5 flex-shrink-0" />
              <span>
                <strong>PetSolutions.lk</strong> is an online store operated by <strong>Guardian Agriculture (Pvt) Ltd</strong>, Lot No. 01, Lanka Industrial Estates (LINDEL), Maguruvila Road, Gonawala, Kelaniya, Sri Lanka. These Terms apply to purchases through the website. For help with an order, contact <a href="mailto:info@petsolutions.lk" className="text-[#00ACDF] font-semibold underline">info@petsolutions.lk</a> or <a href="tel:0777804175" className="text-[#00ACDF] font-semibold underline">077 780 4175</a>.
              </span>
            </div>
          </div>

          {/* Terms Content Body */}
          <div className="bg-white border border-[#BDDFEA] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-[#2D2D3F] leading-relaxed">
            
            {/* 1. Products and orders */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#00ACDF]" /> 1. Products and Orders
              </h2>
              <p className="text-sm">
                We sell <strong>pet food, litter, accessories, supplements, and veterinary products, including veterinary medicines and dewormers</strong>. Products are subject to availability. Please check the product name, pack size, quantity, price, and delivery details carefully before submitting your order.
              </p>
              
              <div className="p-4 rounded-xl bg-[#F9F6EE] border border-gray-200 text-xs space-y-2">
                <p>
                  <strong>Order Acceptance:</strong> An order acknowledgement confirms that we received your order. If stock is unavailable, a payment cannot be verified, or a listing contains a material error, we will contact you about the affected item.
                </p>
                <p>
                  We will refund any amount paid for an item we cancel. We will obtain your agreement before sending a substitute or charging a different price.
                </p>
              </div>
            </section>

            {/* 2. Pricing and payment */}
            <section className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#00ACDF]" /> 2. Pricing and Payment
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <strong>Currency:</strong> Prices are displayed in Sri Lankan rupees (LKR).
                </li>
                <li>
                  <strong>Total Calculation:</strong> Applicable taxes and delivery charges will be reflected in the total shown before you place your order.
                </li>
                <li>
                  <strong>Payment Processing:</strong> Payment methods available for your order are shown at checkout. <strong>Online card payments are processed securely through OnePay.</strong>
                </li>
              </ul>
            </section>

            {/* 3. Delivery */}
            <section className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#00ACDF]" /> 3. Delivery
              </h2>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Islandwide Delivery:</strong> We deliver islandwide in Sri Lanka. Delivery usually takes <strong>3–5 days</strong>. This is an estimate and may vary with stock availability, location, and courier schedules.
                </p>
                <div className="p-4 rounded-xl bg-[#E6F4F8]/70 border border-[#BDDFEA] text-xs text-[#2D2D3F] space-y-1.5">
                  <p>
                    <strong>Delivery Charges:</strong> The customer pays the delivery charge shown at checkout.
                  </p>
                  <p>
                    <strong>Customer Responsibility:</strong> Please provide an accurate delivery address and a reachable telephone number to prevent delivery delays or failed drop-offs.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Product use & Veterinary disclaimer */}
            <section className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2 text-amber-950">
                <AlertCircle className="w-5 h-5 text-amber-600" /> 4. Product Use &amp; Veterinary Advice Disclaimer
              </h2>
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2.5 leading-relaxed">
                <p>
                  <strong>Follow Product Labels:</strong> Read and follow the product label and storage instructions carefully upon receipt.
                </p>
                <p>
                  <strong>Not Professional Veterinary Advice:</strong> Website product descriptions are general information and do <strong>not</strong> replace advice from a qualified veterinarian. Consult a veterinarian if you are unsure whether a medicine, dewormer, or supplement is suitable for your pet.
                </p>
                <p>
                  <strong>Prescriptions &amp; Verification:</strong> Where a product requires a prescription or other verification, we will fulfil the order only after the applicable requirements are met.
                </p>
              </div>
            </section>

            {/* 5. Returns, privacy and complaints */}
            <section className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00ACDF]" /> 5. Returns, Privacy and Complaints
              </h2>
              <div className="space-y-2 text-sm">
                <p>
                  Our <Link href="/refund-policy" className="text-[#00ACDF] font-semibold underline">Returns &amp; Refund Policy</Link> explains cancellations, eligible returns, and refunds. Our <Link href="/privacy-policy" className="text-[#00ACDF] font-semibold underline">Privacy Policy</Link> explains how we handle customer information. Both policies are readily accessible on PetSolutions.lk.
                </p>
                <p className="text-xs text-[#2D2D3F]">
                  <strong>Filing a Complaint:</strong> For any complaint, contact us promptly with your order number and details of the issue so we can investigate and respond.
                </p>
              </div>
            </section>

            {/* 6. Governing law */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#00ACDF]" /> 6. Governing Law
              </h2>
              <p className="text-sm">
                These Terms are governed by the <strong>laws of Sri Lanka</strong>. Nothing in them limits any consumer right or remedy that cannot lawfully be limited under applicable Sri Lankan legislation.
              </p>
            </section>

            {/* Contact Box */}
            <section className="pt-4 border-t border-gray-100">
              <div className="p-5 rounded-2xl bg-[#F9F6EE] border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-[#1A1A2E] text-sm">Guardian Agriculture (Pvt) Ltd</h3>
                  <p className="text-xs text-[#2D2D3F]">
                    Lot No. 01, Lanka Industrial Estates (LINDEL), Maguruvila Road, Gonawala, Kelaniya, Sri Lanka
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="tel:0777804175"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-gray-300 text-xs font-bold text-[#1A1A2E] hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#00ACDF]" /> 077 780 4175
                  </a>
                  <a
                    href="mailto:info@petsolutions.lk"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#00ACDF] text-white text-xs font-bold hover:bg-[#0090BB] transition-colors shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" /> info@petsolutions.lk
                  </a>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
