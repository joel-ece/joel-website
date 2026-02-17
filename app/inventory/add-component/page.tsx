'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft,
  Package,
  CheckCircle,
  Layers,
  MapPin,
  FileText,
  Hash,
} from 'lucide-react'
import Link from 'next/link'

export default function AddComponentPage() {
  const { user, mentor, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    totalQuantity: 1,
    availableQuantity: 1,
    location: '',
    notes: '',
  })

  // Common categories (can be expanded)
  const commonCategories = [
    'Microcontrollers',
    'Sensors',
    'Actuators',
    'Passive Components',
    'Active Components',
    'Power Supplies',
    'Communication Modules',
    'Display Modules',
    'Motors',
    'Wheels',
    'Drone Components',
    'Camera Components',
    'Tools',
    'Cables & Connectors',
    'ICs',
    'Other',
  ]

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/inventory/login')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mentor) return

    setLoading(true)

    const { error } = await supabase.from('components').insert({
      name: formData.name,
      category: formData.category,
      total_quantity: formData.totalQuantity,
      available_quantity: formData.availableQuantity,
      location: formData.location,
      notes: formData.notes || null,
    })

    setLoading(false)

    if (error) {
      alert('Error adding component: ' + error.message)
    } else {
      setSuccess(true)
      // Reset form
      setFormData({
        name: '',
        category: '',
        totalQuantity: 1,
        availableQuantity: 1,
        location: '',
        notes: '',
      })

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  if (authLoading || !user || !mentor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-joel-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/inventory/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Add New Component
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Add a new item to the inventory
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">
                Component added successfully!
              </p>
              <p className="text-sm text-green-700">
                The component is now available in the inventory.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Component Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Package className="inline w-4 h-4 mr-1" />
                Component Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="e.g., Arduino Uno R3, Resistor 10kΩ"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Layers className="inline w-4 h-4 mr-1" />
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
              >
                <option value="">Select a category...</option>
                {commonCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500">
                Can't find your category? Select "Other" and add details in notes.
              </p>
            </div>

            {/* Quantities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Hash className="inline w-4 h-4 mr-1" />
                  Total Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalQuantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalQuantity: parseInt(e.target.value),
                    })
                  }
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Hash className="inline w-4 h-4 mr-1" />
                  Available Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.totalQuantity}
                  value={formData.availableQuantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availableQuantity: parseInt(e.target.value),
                    })
                  }
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must be ≤ total quantity
                </p>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
                placeholder="e.g., Shelf A1, Drawer B3, Cabinet C2"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                placeholder="Additional information, specifications, or notes..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
              />
            </div>

            {/* Info Box */}
            <div className="bg-joel-purple-50 border border-joel-purple-200 rounded-lg p-4">
              <p className="text-sm text-joel-purple-900">
                💡 <strong>Tip:</strong> Be specific with component names and
                include key details (e.g., "ESP32 DevKit v1" instead of just
                "ESP32")
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-joel-gradient text-white font-semibold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Component...' : 'Add Component'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}