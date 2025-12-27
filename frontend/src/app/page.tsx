"use client";

import { FlipText } from "@/components/magicui/flip-text";
import Navbar from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/footer";
import { Globe } from "@/components/magicui/globe";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-60">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orb */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-50 via-indigo-50 to-gray-50 rounded-full opacity-60 blur-3xl" />
          
          {/* Geometric Patterns */}
          <div className="absolute inset-0" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, gray 1px, transparent 0)`,
              backgroundSize: '40px 40px',
              opacity: '0.05'
            }} 
          />
          
          {/* Additional Decorative Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gray-100 rounded-full mix-blend-multiply opacity-20 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative text-center space-y-8 max-w-4xl">
          <div className="space-y-4">
            <div className="relative">
              <FlipText className="text-6xl sm:text-5xl lg:text-8xl font-black text-gray-900 font-display tracking-tighter">
                proof of impact
              </FlipText>
              
            </div>
            <div className="space-y-2 pt-5 relative z-10">
              <p className="text-xl sm:text-2xl text-gray-600 drop-shadow-sm">
                Turning Corporate Promises into Public Proof
              </p>
              <p className="text-xl sm:text-2xl text-gray-600 drop-shadow-sm">
                Trustless Tech for Trustworthy Impact
              </p>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 pt-4">
            <Link
              href="/show-poi"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              Attest your impact 
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all"
            >
              Learn More →
            </Link>
          </div>
        </div>
      

      <section className="pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-base text-gray-600 mb-12">
            Trusted by 50,000+ companies
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-items-center opacity-70">
            <div className="w-32 h-12 relative">
              <Image
                src="/logos/microsoft.svg"
                alt="Microsoft"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-32 h-12 relative">
              <Image
                src="/logos/google.svg"
                alt="Google"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-32 h-12 relative">
              <Image
                src="/logos/amazon.svg"
                alt="Amazon"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-32 h-12 relative">
              <Image
                src="/logos/meta.svg"
                alt="Meta"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-32 h-12 relative">
              <Image
                src="/logos/apple.svg"
                alt="Apple"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-32 h-12 relative">
              <Image
                src="/logos/netflix.svg"
                alt="Netflix"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-32 h-12 relative">
              <Image
                src="/logos/tesla.svg"
                alt="Tesla"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Globe Section */}
      <section className="relative pt-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-5">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Creating Impact Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of companies making verifiable social impact across the globe. Every proof adds to our growing network of positive change.
            </p>
          </div>

          <div className="relative h-[600px] ">
            <Globe className="opacity-90" />
            
            {/* Stats */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="grid grid-cols-3 gap-8 mt-80">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">150+</div>
                  <div className="text-gray-600">Countries Reached</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">$2B+</div>
                  <div className="text-gray-600">Impact Value</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">10K+</div>
                  <div className="text-gray-600">Projects Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-20 pt-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Revolutionizing Corporate Social Responsibility
            </h2>
            <p className="text-xl text-gray-600">
              Transform how companies prove and earn from their social impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="h-12 w-12 bg-black rounded-lg mb-6 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  DAO Verification for Community-Powered Proof
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Let real beneficiaries verify your CSR claims. Our DAO of impacted individuals confirms whether the promised change truly happened — transparently and trustlessly.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="h-12 w-12 bg-black rounded-lg mb-6 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Live ESG Scores
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Every company gets a dynamic ESG score based on the quality and verification of their CSR activities — no fluff, just facts on the chain.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="h-12 w-12 bg-black rounded-lg mb-6 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Earn by Doing Good
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Companies and communities get rewarded for verified social good. The more authentic your impact, the greater your on-chain reputation and rewards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section></section>

      <Footer />
    </div>
  );
}
