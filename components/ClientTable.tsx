'use client'

import { useCRMStore, Client } from '@/lib/store'
import { Edit2, Trash2, TrendingUp, AlertCircle } from 'lucide-react'

interface ClientTableProps {
  onEdit: (client: Client) => void
}

export default function ClientTable({ onEdit }: ClientTableProps) {
  const clients = useCRMStore((state) => state.clients)
  const deleteClient = useCRMStore((state) => state.deleteClient)

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      deleteClient(id)
    }
  }

  const getCreditScoreColor = (score: number) => {
    if (score >= 700) return 'text-green-600 bg-green-50'
    if (score >= 600) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200 bg-gray-50">
            <th className="text-left px-6 py-4 font-bold text-gray-900">Name</th>
            <th className="text-left px-6 py-4 font-bold text-gray-900">Email</th>
            <th className="text-left px-6 py-4 font-bold text-gray-900">Phone</th>
            <th className="text-center px-6 py-4 font-bold text-gray-900">Credit Score</th>
            <th className="text-left px-6 py-4 font-bold text-gray-900">Status</th>
            <th className="text-right px-6 py-4 font-bold text-gray-900">Fee/Mo</th>
            <th className="text-center px-6 py-4 font-bold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, idx) => (
            <tr
              key={client.id}
              className={`border-b border-gray-100 transition hover:bg-blue-50 ${
                idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}
            >
              <td className="px-6 py-4">
                <div>
                  <p className="font-semibold text-gray-900">{client.name}</p>
                  <p className="text-xs text-gray-500">
                    Since {new Date(client.startDate).toLocaleDateString()}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-700 text-sm">{client.email}</td>
              <td className="px-6 py-4 text-gray-700 text-sm">{client.phone}</td>
              <td className="px-6 py-4 text-center">
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-bold ${getCreditScoreColor(client.creditScore)}`}>
                  <TrendingUp size={16} />
                  {client.creditScore}
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(
                    client.status
                  )}`}
                >
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-right font-bold text-gray-900">
                ${client.monthlyFee.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(client)}
                    className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
