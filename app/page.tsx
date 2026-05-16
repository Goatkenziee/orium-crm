'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setEmail('')
    }, 3000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">Orium CRM</div>
          <div className="space-x-4">
            <Link href="/dashboard" className="text-slate-300 hover:text-white transition">
              Dashboard
            </Link>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
            Credit Repair Agency
            <span className="block text-blue-400">Management Made Simple</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Manage clients, track disputes, generate letters, and monitor credit score improvements all in one powerful CRM platform.
          </p>

          {/* CTA Form */}
          <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Get Started
            </button>
          </form>
          {submitted && (
            <p className="text-green-400 text-sm">✓ We'll be in touch soon!</p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              icon: '👥',
              title: 'Client Management',
              desc: 'Track all client details, credit profiles, and progress in one dashboard'
            },
            {
              icon: '📋',
              title: 'Dispute Tracking',
              desc: 'Monitor bureau disputes, status updates, and resolution history'
            },
            {
              icon: '📧',
              title: 'Letter Generation',
              desc: 'AI-powered dispute letters with templates and mailing tracking'
            },
            {
              icon: '📊',
              title: 'Analytics & ROI',
              desc: 'Real-time metrics on credit score improvements and revenue'
            },
            {
              icon: '💳',
              title: 'Stripe Integration',
              desc: 'Seamless billing and subscription tracking for agencies'
            },
            {
              icon: '👨‍💼',
              title: 'Team Collaboration',
              desc: 'Multi-user support for agency teams with role-based access'
            },
          ].map((feature, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing Section */}
        <div className="mt-20 text-center space-y-8">
          <h2 className="text-3xl font-bold text-white">Simple Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {[
              {
                name: 'Solo',
                price: '$299',
                features: ['Up to 50 clients', 'Letter generation', 'Basic analytics']
              },
              {
                name: 'Agency',
                price: '$999',
                features: ['Unlimited clients', 'Team collaboration', 'Advanced analytics', 'Stripe sync']
              },
            ].map((plan, i) => (
              <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-4xl font-bold text-blue-400 mb-6">{plan.price}<span className="text-lg text-slate-400">/mo</span></p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="text-slate-300">✓ {f}</li>
                  ))}
                </ul>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
                  Start Free Trial
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-12 border-t border-slate-700 text-center text-slate-400">
          <p>© 2026 Orium CRM. Built for credit repair agencies.</p>
        </div>
      </div>
    </main>
  )
}
