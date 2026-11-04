import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Truck, MapPin, Clock, ShieldCheck, ArrowLeft, PackageCheck } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery Policy | PetSolutions.lk',
  description: 'Fast, reliable island-wide delivery timelines, shipping rates, and order tracking across Sri Lanka with PetSolutions.lk.',
};

export default function ShippingPolicyPage() {
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
              <Truck className="w-4 h-4" /> Islandwide Logistics
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] tracking-tight mb-3">
              Shipping &amp; Delivery Policy
            </h1>
            <p className="text-sm text-text-muted">
              Last Updated: {lastUpdated} &bull; Serving pet parents across all 25 districts in Sri Lanka
            </p>
          </div>

          {/* Body */}
          <div className="bg-white border border-[#BDDFEA] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-[#2D2D3F] leading-relaxed">
            
            {/* 1. Timelines */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#00ACDF]" /> 1. Delivery Timelines
              </h2>
              <p>
                We dispatch orders daily from Monday through Saturday (excluding major public and mercantile holidays). Our prompt delivery windows are as follows:
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-[#F9F6EE] border border-gray-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#00ACDF] mb-1">Colombo &amp; Western Province</div>
                  <div className="text-2xl font-extrabold text-[#1A1A2E] mb-2">24 &ndash; 48 Hours</div>
                  <p className="text-xs text-[#6B6B7B]">
                    Covers Colombo, Gampaha, and Kalutara districts with expedited priority dispatch.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#F9F6EE] border border-gray-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#FFBF00] mb-1">Outstation Islandwide</div>
                  <div className="text-2xl font-extrabold text-[#1A1A2E] mb-2">2 &ndash; 4 Working Days</div>
                  <p className="text-xs text-[#6B6B7B]">
                    Covers all remaining 22 administrative districts across Sri Lanka via our established courier network.
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Rates & Free Delivery */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-emerald-600" /> 2. Shipping Rates &amp; Free Delivery
              </h2>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-950">
                <strong>Free Delivery Tier:</strong> Enjoy <strong>Free Island-wide Delivery</strong> on all orders totaling <strong>Rs. 10,000</strong> or above!
              </div>
              <p className="text-sm">
                For orders below Rs. 10,000, standard tiered delivery rates apply based on destination province and order weight. Delivery fees are transparently calculated and displayed on the checkout page before payment is finalized.
              </p>
            </section>

            {/* 3. Tracking & Couriers */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#00ACDF]" /> 3. Courier Partners &amp; Tracking
              </h2>
              <p className="text-sm">
                We partner with accredited Sri Lankan logistics providers (such as Domex, Pronto, and Prompt X) to ensure careful handling of pet food, fragile glassware, and medical supplies.
              </p>
              <p className="text-sm">
                Upon parcel dispatch, you will receive an SMS and email notification with your tracking number. You can also view live delivery progress at any time through our <Link href="/orders" className="text-[#00ACDF] underline font-medium">Order Tracking</Link> portal.
              </p>
            </section>

            {/* 4. Receiving Your Package */}
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00ACDF]" /> 4. Package Inspection Upon Delivery
              </h2>
              <p className="text-sm">
                For your peace of mind, please inspect the outer packaging in the presence of the delivery agent. If the package appears severely punctured, torn, or wet, please photograph the condition immediately and contact our customer hotline before accepting the package.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
