import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { RotateCcw, CheckCircle, XCircle, Clock, CreditCard, ArrowLeft, AlertCircle, Phone, Mail, Building2, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Returns & Refund Policy | PetSolutions.lk',
  description: 'Returns & Refund Policy for PetSolutions.lk, operated by Guardian Agriculture (Pvt) Ltd in Sri Lanka.',
};

export default function RefundPolicyPage() {
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
              <RotateCcw className="w-4 h-4" /> Customer Satisfaction & Transparency
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight mb-3">
              Returns &amp; Refund Policy
            </h1>
            <p className="text-sm text-text-muted mb-4">
              Effective date: <strong className="text-[#1A1A2E]">{effectiveDate}</strong>
            </p>
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F9F6EE] border border-secondary-alt/40 text-xs text-[#2D2D3F]">
              <Building2 className="w-4 h-4 text-[#00ACDF] mt-0.5 flex-shrink-0" />
              <span>
                This policy applies to orders placed on <strong>PetSolutions.lk</strong>, operated by{' '}
                <strong>Guardian Agriculture (Pvt) Ltd</strong>, Lot No. 01, Lanka Industrial Estates (LINDEL), Maguruvila Road, Gonawala, Kelaniya, Sri Lanka.
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white border border-[#BDDFEA] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-[#2D2D3F] leading-relaxed">
            
            {/* 1. Change-of-mind returns */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#00ACDF]" /> 1. Change-of-Mind Returns
              </h2>
              <p className="text-sm">
                To request a return, call <strong className="text-[#1A1A2E]">077 780 4175</strong> as soon as possible and within <strong>two calendar days</strong> of delivery. Have your order number or proof of purchase ready. Contact us before sending anything back so we can confirm eligibility and provide return instructions.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Eligible for Return
                  </div>
                  <p className="text-xs text-emerald-950">
                    Eligible items must be <strong>unused, unopened, and in their original packaging</strong>. Items opened, used, or damaged after delivery are not eligible unless they are defective or were supplied incorrectly.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200">
                  <div className="flex items-center gap-2 text-rose-800 font-bold mb-2 text-sm">
                    <XCircle className="w-4 h-4 text-rose-600" /> Excluded Items (Non-Returnable)
                  </div>
                  <p className="text-xs text-rose-950">
                    For health and safety reasons, <strong>veterinary medicines, dewormers, supplements, and perishable items such as pet food</strong> are excluded from change-of-mind returns, <em>even if unopened</em>. We accept claims for defective or incorrectly supplied products in these categories.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F9F6EE] border border-gray-200 text-xs text-[#2D2D3F]">
                <strong>Return Transport Costs:</strong> You pay return transport costs for a change-of-mind return.
              </div>
            </section>

            {/* 2. Damaged, defective or incorrect orders */}
            <section className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2 text-amber-950">
                <AlertCircle className="w-5 h-5 text-amber-600" /> 2. Damaged, Defective or Incorrect Orders
              </h2>
              <p className="text-sm">
                If an item arrives damaged, defective, expired or incorrect, or is missing, notify us promptly on <strong className="text-[#1A1A2E]">077 780 4175</strong> or at <a href="mailto:info@petsolutions.lk" className="text-[#00ACDF] font-semibold underline">info@petsolutions.lk</a>. Include your order number and describe the issue.
              </p>
              
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2">
                <p>
                  <strong>Important:</strong> If relevant, retain the packaging and share photos of the item, label, batch number, or expiry date. <strong>Stop using any product you suspect is unsafe.</strong>
                </p>
                <p>
                  For confirmed defective or damaged products, we offer a <strong>full refund for the affected product or a replacement at no additional cost</strong>. If a return is required because of a confirmed issue with your order, we will arrange or cover reasonable return transport costs.
                </p>
                <p className="text-[11px] text-amber-900/80">
                  The two-day change-of-mind window does not limit rights or remedies available under applicable law.
                </p>
              </div>
            </section>

            {/* 3. Refunds */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#00ACDF]" /> 3. Refunds
              </h2>
              <div className="space-y-2 text-sm">
                <p>
                  Approved refunds are issued to the <strong>original payment method</strong>. Card refunds are submitted through <strong>OnePay</strong>; your bank or card issuer may take additional time to post the credit.
                </p>
                <p className="text-xs text-text-muted">
                  Original shipping fees are non-refundable on returns unless the return is due to an error on our part.
                </p>
              </div>
            </section>

            {/* 4. Order cancellation */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#00ACDF]" /> 4. Order Cancellation
              </h2>
              <p className="text-sm">
                You may cancel an order within <strong>two hours of placing it or before dispatch</strong>, whichever comes first. Once dispatched, an order cannot be cancelled.
              </p>
              
              <div className="bg-[#F9F6EE] p-4 rounded-xl space-y-2 text-xs">
                <p>
                  <strong>How to request cancellation:</strong> Call <strong>077 780 4175</strong> or email <strong>info@petsolutions.lk</strong> with your order number.
                </p>
                <p>
                  If your cancellation is accepted before dispatch, we will issue a full refund within <strong>three to five business days</strong>. If we cannot supply an item you have paid for, we will notify you and refund the amount paid for that item.
                </p>
              </div>
            </section>

            {/* Contact card */}
            <section className="pt-4 border-t border-gray-100">
              <div className="p-5 rounded-2xl bg-[#E6F4F8]/70 border border-[#BDDFEA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-[#1A1A2E] text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#00ACDF]" /> Need Assistance with a Return or Refund?
                  </h3>
                  <p className="text-xs text-[#2D2D3F]">
                    Our support desk at Guardian Agriculture (Pvt) Ltd is ready to assist you.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="tel:0777804175"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00ACDF] text-white text-xs font-bold hover:bg-[#0090BB] transition-colors shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" /> 077 780 4175
                  </a>
                  <a
                    href="mailto:info@petsolutions.lk"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#BDDFEA] text-[#1A1A2E] text-xs font-bold hover:bg-gray-50 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#00ACDF]" /> info@petsolutions.lk
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
