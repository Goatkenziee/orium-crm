'use client'

import { useState, useEffect } from 'react'
import { useCRMStore, Client } from '@/lib/store'
import ClientForm from '@/components/ClientForm'
import ClientTable from '@/components/ClientTable'
import { Plus, BarChart3, Users, DollarSign, TrendingUp } from 'lucide-react'

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | undefined>(undefined)
  const [mounted, setMounted] = useState(false)

  const clients = useCRMStore((state) => state.clients)
  const addClient = useCRMStore((state) => state.addClient)
  const updateClient = useCRMStore((state) => state.updateClient)
  const initializeSampleData = useCRMStore((state) => state.initializeSampleData)

  useEffect(() => {
    setMounted(true)
    if (clients.length === 0) {
      initializeSampleData()
    }
  }, [])

  const handleFormSubmit = (data: Omit<Client, 'id'>) => {
    if (editingClient) {
      updateClient(editingClient.id, data)
      setEditingClient(undefined)
    } else {
      addClient(data)
    }
    setShowForm(false)
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingClient(undefined)
  }

  if (!mounted) return null

  // Calculate metrics
  const activeClients = clients.filter((c) => c.status === 'active').length
  const totalRevenue = clients.reduce((sum, c) => sum + c.monthlyFee, 0)
  const avgCreditScore =
    clients.length > 0
      ? Math.round(clients.reduce((sum, c) => sum + c.creditScore, 0) / clients.length)
      : 0

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Orium CRM
              </h1>
              <p className="text-sm text-gray-600 mt-1">Credit Repair Agency Management</p>
            </div>
            <button
              onClick={() => {
                setEditingClient(undefined)
                setShowForm(true)
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl transition transform hover:scale-105"
            >
              <Plus size={20} />
              Add Client
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Active Clients */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Active Clients
                </p>
                <p className="text-4xl font-black text-gray-900 mt-2">{activeClients}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {clients.length} total registered
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={28} />
              </div>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Monthly Revenue
                </p>
                <p className="text-4xl font-black text-gray-900 mt-2">
                  ${(totalRevenue / 1000).toFixed(1)}K
                </p>
                <p className="text-xs text-gray-500 mt-2">Recurring monthly</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="text-green-600" size={28} />
              </div>
            </div>
          </div>

          {/* Avg Credit Score */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Avg Credit Score
                </p>
                <p className="text-4xl font-black text-gray-900 mt-2">{avgCreditScore}</p>
                <p className="text-xs text-gray-500 mt-2">Portfolio average</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={28} />
              </div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition border-l-4 border-indigo-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Completed
                </p>
                <p className="text-4xl font-black text-gray-900 mt-2">
                  {clients.filter((c) => c.status === 'completed').length}
                </p>
                <p className="text-xs text-gray-500 mt-2">Success cases</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <BarChart3 className="text-indigo-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Clients Table Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Client Management</h2>
            <p className="text-gray-600">
              Manage all your credit repair clients in one place
            </p>
          </div>

          {clients.length > 0 ? (
            <ClientTable onEdit={handleEdit} />
          ) : (
            <div className="text-center py-12">
              <Users size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No clients yet. Click "Add Client" to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <ClientForm
          onSubmit={handleFormSubmit}
          onClose={handleClose}
          initialData={editingClient}
        />
      )}
    </main>
  )
}
