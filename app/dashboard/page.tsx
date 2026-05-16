'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCRMStore, Client } from '@/lib/store'
import ClientForm from '@/components/ClientForm'
import ClientTable from '@/components/ClientTable'
import { Plus, Users, TrendingUp, AlertCircle, BarChart3, Zap, LogOut, Menu, X } from 'lucide-react'

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [selectedTab, setSelectedTab] = useState<'clients' | 'disputes' | 'payments'>('clients')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const clients = useCRMStore((state) => state.clients)
  const disputes = useCRMStore((state) => state.disputes)
  const addClient = useCRMStore((state) => state.addClient)
  const updateClient = useCRMStore((state) => state.updateClient)
  const initializeSampleData = useCRMStore((state) => state.initializeSampleData)

  // Initialize sample data on mount
  useEffect(() => {
    setMounted(true)
    if (clients.length === 0) {
      initializeSampleData()
    }
  }, [])

  if (!mounted) return null

  const activeClientsCount = clients.filter((c) => c.status === 'active').length
  const avgCreditScore = clients.length > 0 ? Math.round(
    clients.reduce((sum, c) => sum + c.creditScore, 0) / clients.length
  ) : 0
  const openDisputesCount = disputes.filter((d) => d.status !== 'resolved').length
  const totalRevenue = clients.reduce((sum, c) => sum + c.monthlyFee, 0)

  const handleSubmit = (data: any) => {
    if (editingClient) {
      updateClient(editingClient.id, data)
      setEditingClient(null)
    } else {
      addClient(data)
    }
    setShowForm(false)
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingClient(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CRM</span>
            </div>
            <span className="font-bold text-gray-900">Orium CRM</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-gray-600">Dashboard</span>
            <button className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4 space-y-2">
          <Link href="/" className="block text-gray-600 hover:text-gray-900 py-2">
            Home
          </Link>
          <button className="w-full text-left text-gray-600 hover:text-gray-900 py-2 flex items-center gap-2">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-blue-100">Welcome back! Manage your clients and track progress.</p>
            </div>
            <button
              onClick={() => {
                setEditingClient(null)
                setShowForm(true)
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 font-bold transition shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Add Client
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Active Clients</p>
                <p className="text-3xl font-bold text-gray-900">{activeClientsCount}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Avg Credit Score</p>
                <p className="text-3xl font-bold text-gray-900">{avgCreditScore}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Open Disputes</p>
                <p className="text-3xl font-bold text-gray-900">{openDisputesCount}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <AlertCircle className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <BarChart3 className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex gap-0 border-b border-gray-200">
            {(['clients', 'disputes', 'payments'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`flex-1 px-6 py-4 font-medium transition border-b-2 ${
                  selectedTab === tab
                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                {tab === 'clients' && <span className="flex items-center gap-2 justify-center"><Users size={18} /> Clients</span>}
                {tab === 'disputes' && <span className="flex items-center gap-2 justify-center"><AlertCircle size={18} /> Disputes</span>}
                {tab === 'payments' && <span className="flex items-center gap-2 justify-center"><BarChart3 size={18} /> Payments</span>}
              </button>
            ))}
          </div>

          {/* Clients Tab */}
          {selectedTab === 'clients' && (
            <div className="p-6">
              {clients.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No clients yet</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 text-blue-600 hover:text-indigo-600 font-medium"
                  >
                    Add your first client
                  </button>
                </div>
              ) : (
                <ClientTable onEdit={handleEdit} />
              )}
            </div>
          )}

          {/* Disputes Tab */}
          {selectedTab === 'disputes' && (
            <div className="p-6">
              {disputes.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No disputes yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left px-4 py-3 font-semibold text-gray-900">Client</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-900">Description</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-900">Amount</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {disputes.map((dispute) => {
                        const client = clients.find((c) => c.id === dispute.clientId)
                        return (
                          <tr key={dispute.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="px-4 py-3 font-medium text-gray-900">{client?.name || 'Unknown'}</td>
                            <td className="px-4 py-3 text-gray-600">{dispute.description}</td>
                            <td className="px-4 py-3 font-semibold text-gray-900">${dispute.amount.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                                dispute.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                dispute.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {selectedTab === 'payments' && (
            <div className="p-6">
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Payment management coming soon</p>
                <p className="text-gray-400 text-sm mt-2">Track subscriptions and billing here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Client Form Modal */}
      {showForm && (
        <ClientForm
          onSubmit={handleSubmit}
          onClose={handleFormClose}
          initialData={editingClient || undefined}
        />
      )}
    </div>
  )
}
