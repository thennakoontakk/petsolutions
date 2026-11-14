import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ShieldCheck, Cookie, Lock, ArrowLeft, Building2, Phone, Mail, CheckCircle, Info } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy | PetSolutions.lk',
  description: 'Cookie Policy for PetSolutions.lk, operated by Guardian Agriculture (Pvt) Ltd in Sri Lanka.',
};

export default function CookiePolicyPage() {
  const effectiveDate = '14th November 2026';

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
              <ShieldCheck className="w-4 h-4" /> Legal &amp; Browser Data Compliance
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight mb-3">
              Cookie Policy
            </h1>
            <p className="text-sm text-text-muted mb-4">
              Effective date: <strong className="text-[#1A1A2E]">{effectiveDate}</strong>
            </p>
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F9F6EE] border border-secondary-alt/40 text-xs text-[#2D2D3F]">
              <Building2 className="w-4 h-4 text-[#00ACDF] mt-0.5 flex-shrink-0" />
              <span>
                <strong>PetSolutions.lk</strong> is operated by <strong>Guardian Agriculture (Pvt) Ltd</strong> (Lot No. 01, Lanka Industrial Estates [LINDEL], Maguruvila Road, Gonawala, Kelaniya, Sri Lanka). This policy explains how and why cookies and related technologies are stored on your device when accessing our e-commerce platform.
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div className="bg-white border border-[#BDDFEA] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-[#2D2D3F] leading-relaxed">
            
            {/* 1. What are cookies */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <Cookie className="w-5 h-5 text-amber-500" /> 1. What Are Cookies?
              </h2>
              <p className="text-sm">
                Cookies are small alphanumeric text files stored on your browser or device when you visit websites. They allow our e-commerce platform to recognize your device, preserve items inside your shopping cart between visits, maintain authenticated sessions securely, and facilitate tamper-proof interactions with authorized payment gateway providers.
              </p>
            </section>

            {/* 2. Categories of Cookies we use */}
            <section className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" /> 2. Categories of Cookies We Use
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strictly Necessary */}
                <div className="p-4 rounded-xl bg-[#F9F6EE] border border-gray-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <CheckCircle className="w-4 h-4" /> Strictly Necessary Cookies
                  </div>
                  <p className="text-xs text-[#2D2D3F]">
                    Essential for the core operation of the online store. They keep track of your shopping cart contents, customer authentication state via Supabase, and cross-site request forgery (CSRF) protection. The website cannot function without these cookies.
                  </p>
                </div>

                {/* Payment Gateway & Fraud Prevention */}
                <div className="p-4 rounded-xl bg-[#E6F4F8] border border-[#BDDFEA] space-y-2">
                  <div className="flex items-center gap-2 text-[#00ACDF] font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" /> Payment Gateway &amp; 3DS Verification
                  </div>
                  <p className="text-xs text-[#2D2D3F]">
                    Utilized during checkout when redirecting to authorized Payment Gateways (e.g., OnePay, Visa / MasterCard 3D Secure verification). These cookies ensure transaction integrity, secure bank handshake validation, and fraud mitigation.
                  </p>
                </div>

                {/* Functional & Preferences */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="flex items-center gap-2 text-[#1A1A2E] font-bold text-sm">
                    <Info className="w-4 h-4 text-accent" /> Functional &amp; Preferences
                  </div>
                  <p className="text-xs text-[#2D2D3F]">
                    Stores your interface preferences such as notification dismissals, cookie consent choices, and recent search filters to make your next visit faster and personalized.
                  </p>
                </div>

                {/* Performance & Reliability */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="flex items-center gap-2 text-[#1A1A2E] font-bold text-sm">
                    <Info className="w-4 h-4 text-purple-600" /> Performance &amp; Security
                  </div>
                  <p className="text-xs text-[#2D2D3F]">
                    Monitors page load latency, network reliability, and edge delivery performance to ensure fast, glitch-free shopping across Sri Lanka.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Detailed Cookie Table */}
            <section className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00ACDF]" /> 3. Specific Cookies Deployed on PetSolutions.lk
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-gray-200 rounded-xl overflow-hidden">
                  <thead className="bg-[#1A1A2E] text-white">
                    <tr>
                      <th className="p-3">Cookie Name</th>
                      <th className="p-3">Provider</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Expiry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td className="p-3 font-mono font-bold text-[#1A1A2E]">petsolutions-cart</td>
                      <td className="p-3">PetSolutions.lk</td>
                      <td className="p-3">Persists user shopping cart products and quantities across browsing sessions.</td>
                      <td className="p-3">30 Days</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-[#1A1A2E]">sb-*-auth-token</td>
                      <td className="p-3">Supabase Auth</td>
                      <td className="p-3">Maintains secure user sign-in session and access control.</td>
                      <td className="p-3">Session / 1 Year</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-[#1A1A2E]">cookie_consent</td>
                      <td className="p-3">PetSolutions.lk</td>
                      <td className="p-3">Remembers the customer&apos;s cookie acknowledgement preference.</td>
                      <td className="p-3">1 Year</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-[#1A1A2E]">__Secure-*, 3DS-Session</td>
                      <td className="p-3">Payment Gateway (OnePay / Bank IPG)</td>
                      <td className="p-3">Facilitates encrypted card authorization, OTP handshake, and anti-fraud validation.</td>
                      <td className="p-3">Transaction Duration</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. Managing Cookies */}
            <section className="space-y-4 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <Cookie className="w-5 h-5 text-amber-500" /> 4. How Can You Manage or Disable Cookies?
              </h2>
              <p className="text-sm">
                You can manage or disable cookies at any time through your browser settings. Please note that disabling strictly necessary cookies will prevent adding items to your cart, signing into your account, or completing online checkout on PetSolutions.lk.
              </p>
              <ul className="text-xs list-disc pl-5 space-y-1 text-text-muted">
                <li>Google Chrome: Settings &rarr; Privacy and security &rarr; Cookies and other site data</li>
                <li>Apple Safari: Preferences &rarr; Privacy &rarr; Manage Website Data</li>
                <li>Mozilla Firefox: Settings &rarr; Privacy &amp; Security &rarr; Cookies and Site Data</li>
                <li>Microsoft Edge: Settings &rarr; Cookies and site permissions</li>
              </ul>
            </section>

            {/* 5. Contact Information Box */}
            <section className="pt-4 border-t border-gray-100">
              <div className="p-5 rounded-2xl bg-[#F9F6EE] border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-[#1A1A2E] text-sm">Have Questions Regarding Our Cookie Policy?</h3>
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
