'use client'

import { useState } from 'react'
import { Client } from '@/lib/store'
import { X, Save } from 'lucide-react'

interface ClientFormProps {
  onSubmit: (data: Omit<Client, 'id'>) => void
  onClose: () => void
  initialData?: Client
}

export default function ClientForm({
  onSubmit,
  onClose,
  initialData,
}: ClientFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    creditScore: initialData?.creditScore || 600,
    status: initialData?.status || 'active' as 'active' | 'paused' | 'completed',
    monthlyFee: initialData?.monthlyFee || 299,
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    notes: initialData?.notes || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email format'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (formData.creditScore < 300 || formData.creditScore > 850)
      newErrors.creditScore = 'Credit score must be between 300-850'
    if (formData.monthlyFee < 0) newErrors.monthlyFee = 'Monthly fee cannot be negative'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'creditScore' || name === 'monthlyFee' ? parseFloat(value) : value,
    }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? 'Edit Client' : 'Add New Client'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className={`w-full px-4 py-2 rounded-lg border-2 transition ${
                errors.name
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              } focus:outline-none focus:ring-2`}
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`w-full px-4 py-2 rounded-lg border-2 transition ${
                errors.email
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              } focus:outline-none focus:ring-2`}
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              className={`w-full px-4 py-2 rounded-lg border-2 transition ${
                errors.phone
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              } focus:outline-none focus:ring-2`}
            />
            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Credit Score */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Current Credit Score
            </label>
            <input
              type="number"
              name="creditScore"
              value={formData.creditScore}
              onChange={handleChange}
              min="300"
              max="850"
              className={`w-full px-4 py-2 rounded-lg border-2 transition ${
                errors.creditScore
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              } focus:outline-none focus:ring-2`}
            />
            {errors.creditScore && (
              <p className="text-red-600 text-xs mt-1">{errors.creditScore}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Range: 300–850</p>
          </div>

          {/* Monthly Fee */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Monthly Fee ($)
            </label>
            <input
              type="number"
              name="monthlyFee"
              value={formData.monthlyFee}
              onChange={handleChange}
              min="0"
              step="10"
              className={`w-full px-4 py-2 rounded-lg border-2 transition ${
                errors.monthlyFee
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
              } focus:outline-none focus:ring-2`}
            />
            {errors.monthlyFee && (
              <p className="text-red-600 text-xs mt-1">{errors.monthlyFee}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this client..."
              rows={3}
              className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg transition"
            >
              <Save size={18} />
              {initialData ? 'Update' : 'Add'} Client
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
