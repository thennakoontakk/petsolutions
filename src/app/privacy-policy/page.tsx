import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, Building2, Phone, Mail, Truck, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | PetSolutions.lk',
  description: 'Privacy Policy for PetSolutions.lk, operated by Guardian Agriculture (Pvt) Ltd in Sri Lanka.',
};

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="w-4 h-4" /> Legal Compliance &amp; Data Protection
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-text-muted mb-4">
              Effective date: <strong className="text-[#1A1A2E]">{effectiveDate}</strong>
            </p>
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F9F6EE] border border-secondary-alt/40 text-xs text-[#2D2D3F]">
              <Building2 className="w-4 h-4 text-[#00ACDF] mt-0.5 flex-shrink-0" />
              <span>
                <strong>Guardian Agriculture (Pvt) Ltd</strong> operates <strong>PetSolutions.lk</strong> and is responsible for how the store handles your personal information. You can contact us at <a href="mailto:info@petsolutions.lk" className="text-[#00ACDF] font-semibold underline">info@petsolutions.lk</a> or <a href="tel:0777804175" className="text-[#00ACDF] font-semibold underline">077 780 4175</a>, or write to us at Lot No. 01, Lanka Industrial Estates (LINDEL), Maguruvila Road, Gonawala, Kelaniya, Sri Lanka.
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div className="bg-white border border-[#BDDFEA] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-[#2D2D3F] leading-relaxed">
            
            {/* 1. What information we collect and why */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#00ACDF]" /> 1. What Information We Collect and Why
              </h2>
              <p className="text-sm">
                When you place an order or contact us, we collect the information needed to assist you, such as your <strong>name, email address, phone number, billing and delivery addresses, order details, payment status, and correspondence</strong>.
              </p>
              
              <div className="p-4 rounded-xl bg-[#F9F6EE] border border-gray-200">
                <h3 className="font-bold text-[#1A1A2E] text-sm mb-2">We use this information to:</h3>
                <ul className="text-xs text-[#2D2D3F] space-y-1.5 list-disc pl-4">
                  <li>Process and deliver orders accurately to your doorstep across Sri Lanka.</li>
                  <li>Issue official receipts, order confirmations, and dispatch tracking updates.</li>
                  <li>Handle customer enquiries, product guidance, and eligible returns or refunds.</li>
                  <li>Protect the store against fraud and unauthorized transactions.</li>
                  <li>Meet applicable accounting, taxation, and Sri Lankan legal obligations.</li>
                </ul>
              </div>
            </section>

            {/* 2. Payments and delivery */}
            <section className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" /> 2. Payments and Delivery
              </h2>
              
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Online card payments are processed securely through OnePay.</strong> We use transaction information to confirm payment, reconcile orders, and handle refunds.
                </p>
                
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Important Security Notice:</strong> Please do <strong>not</strong> send your full card number, security code (CVV/CVC), PIN, or banking password by email, phone, or message. PetSolutions.lk staff will never ask for your confidential banking credentials.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F9F6EE] border border-gray-200 text-xs text-[#2D2D3F]">
                  <Truck className="w-4 h-4 text-[#00ACDF] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Delivery Fulfillment:</strong> We share the delivery information needed to fulfil your order with the courier handling it. Providers that operate or support our website may also handle information as needed to provide their services. We may disclose information where required by law.
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Cookies and Tracking Technologies */}
            <section className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" /> 3. Cookies and Tracking Technologies
              </h2>
              <div className="space-y-3 text-sm">
                <p>
                  PetSolutions.lk uses strictly necessary cookies and browser storage to maintain your active shopping cart, preserve authenticated customer sessions, ensure CSRF security, and facilitate encrypted communication with authorized payment gateways (e.g., OnePay, 3DS verification).
                </p>
                <div className="p-4 rounded-xl bg-[#F9F6EE] border border-gray-200 text-xs text-[#2D2D3F]">
                  For complete details on specific cookie names, retention durations, and how to manage browser cookie settings, please read our dedicated{' '}
                  <Link href="/cookie-policy" className="text-[#00ACDF] font-bold underline hover:text-[#0090BB]">
                    Cookie Policy
                  </Link>.
                </div>
              </div>
            </section>

            {/* 4. Retention, security and customer requests */}
            <section className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00ACDF]" /> 4. Retention, Security and Customer Requests
              </h2>
              
              <div className="space-y-3 text-sm">
                <p>
                  We retain information as needed to fulfil orders, handle returns and disputes, and meet applicable legal and accounting obligations. We take reasonable steps to protect the information we handle and restrict access strictly to people who need it for their work.
                </p>
                
                <div className="p-4 rounded-xl bg-[#E6F4F8]/70 border border-[#BDDFEA] space-y-2 text-xs">
                  <h3 className="font-bold text-[#1A1A2E] text-sm">Your Data Rights:</h3>
                  <p>
                    To ask about your information or request access, correction, or deletion, contact us at <a href="mailto:info@petsolutions.lk" className="text-[#00ACDF] font-semibold underline">info@petsolutions.lk</a>.
                  </p>
                  <p className="text-text-muted">
                    We may need to verify your identity before acting on a request. Some information may need to be retained for lawful purposes, such as maintaining official transaction records.
                  </p>
                </div>

                <p className="text-xs text-text-muted pt-1">
                  <strong>Policy Updates:</strong> When we update this policy, we will post the revised version here and update its effective date.
                </p>
              </div>
            </section>

            {/* Contact Information Box */}
            <section className="pt-4 border-t border-gray-100">
              <div className="p-5 rounded-2xl bg-[#F9F6EE] border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-[#1A1A2E] text-sm">Have Questions Regarding Your Privacy?</h3>
                  <p className="text-xs text-[#2D2D3F]">
                    Guardian Agriculture (Pvt) Ltd, Kelaniya, Sri Lanka
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
