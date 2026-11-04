import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ShieldCheck, Cookie, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy & Cookie Policy | PetSolutions.lk',
  description: 'Understand how PetSolutions.lk collects, uses, protects personal data, and uses cookies on our e-commerce platform.',
};

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="w-4 h-4" /> Legal Compliance & Trust
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight mb-3">
              Privacy &amp; Cookie Policy
            </h1>
            <p className="text-sm text-text-muted">
              Last Updated: {lastUpdated} &bull; Effective for all users of PetSolutions.lk
            </p>
          </div>

          {/* Content Body */}
          <div className="bg-white border border-[#BDDFEA] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-[#2D2D3F] leading-relaxed">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00ACDF]" /> 1. Introduction &amp; Commitment
              </h2>
              <p>
                Welcome to <strong>PetSolutions.lk</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are deeply dedicated to safeguarding your personal privacy and providing a secure online shopping experience for all our valued customers in Sri Lanka.
              </p>
              <p>
                This Privacy and Cookie Policy outlines how we collect, store, handle, and protect your information when you visit our website, register an account, or purchase pet foods, medications, accessories, and supplies.
              </p>
            </section>

            {/* Section 2: Cookies */}
            <section className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <Cookie className="w-5 h-5 text-[#FFBF00]" /> 2. Cookie Policy (How We Use Cookies)
              </h2>
              <p>
                Like most modern e-commerce web applications, PetSolutions.lk uses cookies, local browser storage, and related web technologies to provide core e-commerce functionality, ensure seamless navigation, and deliver a personalized user experience.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-xl bg-[#F9F6EE] border border-gray-200">
                  <h3 className="font-bold text-[#1A1A2E] text-base mb-1">Strictly Necessary Cookies</h3>
                  <p className="text-xs text-[#6B6B7B]">
                    Essential for the website to function. These maintain your secure customer login session, synchronize your active shopping cart items across visits, and protect against CSRF security threats.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#F9F6EE] border border-gray-200">
                  <h3 className="font-bold text-[#1A1A2E] text-base mb-1">Functional &amp; Preference Cookies</h3>
                  <p className="text-xs text-[#6B6B7B]">
                    Remember your preferences, such as selected delivery province/district estimates, recently viewed pet products, and search filters.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#F9F6EE] border border-gray-200">
                  <h3 className="font-bold text-[#1A1A2E] text-base mb-1">Performance &amp; Analytics</h3>
                  <p className="text-xs text-[#6B6B7B]">
                    Collect anonymous telemetry about page load speeds, high-traffic catalog categories, and broken links, enabling us to continuously optimize site responsiveness.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#F9F6EE] border border-gray-200">
                  <h3 className="font-bold text-[#1A1A2E] text-base mb-1">Payment Session Identifiers</h3>
                  <p className="text-xs text-[#6B6B7B]">
                    Temporary, encrypted tokens utilized during the checkout hand-off to authorized payment gateways to confirm transactional integrity and prevent duplicate charges.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#E6F4F8] text-sm text-[#1A1A2E]">
                <strong>Managing Cookies:</strong> You can choose to disable or block cookies through your individual browser settings. However, please note that disabling strictly necessary cookies will prevent you from adding items to your cart or completing online purchases.
              </div>
            </section>

            {/* Section 3: Data Collection */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#00ACDF]" /> 3. Information We Collect
              </h2>
              <p>When you interact with PetSolutions.lk, we may collect the following details:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm">
                <li><strong>Customer Contact Details:</strong> Full name, recipient phone number, email address, and billing/delivery address in Sri Lanka.</li>
                <li><strong>Account Credentials:</strong> Encrypted authentication tokens, email address, and order histories when creating a profile.</li>
                <li><strong>Transactional Details:</strong> Items purchased, order reference IDs, delivery timelines, and payment status receipts.</li>
              </ul>
            </section>

            {/* Section 4: Security & Payment Gateways */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" /> 4. Payment Security &amp; PCI-DSS Compliance
              </h2>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-950">
                <strong>We Never Store Sensitive Payment Details:</strong> PetSolutions.lk does <em>not</em> store, process, or view your full credit card numbers, debit card numbers, or CVV/CVC security codes on our servers.
              </div>
              <p className="text-sm">
                All card payments are processed securely through certified, Central Bank of Sri Lanka (CBSL) approved Payment Gateways (such as PayHere / Bank IPG). Transactions are encrypted via industry-standard 256-bit Secure Socket Layer (SSL/TLS) encryption and comply with Payment Card Industry Data Security Standards (PCI-DSS).
              </p>
            </section>

            {/* Section 5: Third-party Disclosure */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E]">5. Disclosure to Third Parties</h2>
              <p className="text-sm">
                We strictly <strong>never sell, lease, or rent</strong> your personal identifiable information to third-party marketers or advertisers. We only share necessary delivery information (recipient name, address, contact phone) with contracted island-wide courier partners (such as Domex, Pronto, or Prompt X) solely for fulfilling your product delivery.
              </p>
            </section>

            {/* Section 6: Contact */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E]">6. Privacy Inquiries &amp; Customer Rights</h2>
              <p className="text-sm">
                You possess the legal right to request access to the personal data we hold about you, request corrections, or request account removal. For privacy-related inquiries, please contact our support desk:
              </p>
              <div className="bg-[#F9F6EE] p-4 rounded-xl text-sm space-y-1">
                <p><strong>Email:</strong> support@petsolutions.lk</p>
                <p><strong>Hotline:</strong> Available via our <Link href="/contact" className="text-[#00ACDF] underline font-medium">Contact Us</Link> portal</p>
                <p><strong>Location:</strong> Colombo, Sri Lanka</p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
