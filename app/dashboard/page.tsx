'use client'

import { useState } from 'react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label: 'Total Clients', value: '24', change: '+3 this month' },
    { label: 'Active Disputes', value: '67', change: '+12 pending' },
    { label: 'Avg Score Improvement', value: '+48pts', change: 'Last 90 days' },
    { label: 'Monthly Revenue', value: '$12,450', change: '+15% vs last month' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
            New Client
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-2">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-6">
          <div className="flex space-x-8">
            {['overview', 'clients', 'disputes', 'letters'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
              <p className="text-slate-600">Recent client updates and dispute status changes will appear here.</p>
            </div>
          )}
          {activeTab === 'clients' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Clients</h2>
              <p className="text-slate-600">Manage and track your credit repair clients here.</p>
            </div>
          )}
          {activeTab === 'disputes' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Disputes</h2>
              <p className="text-slate-600">Track bureau disputes and status updates.</p>
            </div>
          )}
          {activeTab === 'letters' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Letters</h2>
              <p className="text-slate-600">Generate and manage dispute letters.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
