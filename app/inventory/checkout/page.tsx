'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase, type Component } from '@/lib/supabase'
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const { user, mentor, loading: authLoading } = useAuth()
  const router = useRouter()
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    componentId: '',
    borrowerName: '',
    borrowerSrn: '',
    borrowerPhone: '',
    borrowerEmail: '',
    quantity: 1,
    purpose: '',
  })

  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/inventory/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadComponents()
    }
  }, [user])

  useEffect(() => {
    if (formData.componentId) {
      const component = components.find((c) => c.id === formData.componentId)
      setSelectedComponent(component || null)
    } else {
      setSelectedComponent(null)
    }
  }, [formData.componentId, components])

  const loadComponents = async () => {
    const { data } = await supabase
      .from('components')
      .select('*')
      .gt('available_quantity', 0)
      .order('name')

    if (data) setComponents(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mentor || !selectedComponent) return

    // Validate quantity
    if (formData.quantity > selectedComponent.available_quantity) {
      alert(
        `Only ${selectedComponent.available_quantity} units available. Please reduce quantity.`
      )
      return
    }

    setLoading(true)

    const { error } = await supabase.from('checkouts').insert({
      mentor_id: mentor.id,
      mentor_email: mentor.email,
      mentor_name: mentor.name,
      borrower_name: formData.borrowerName,
      borrower_srn: formData.borrowerSrn,
      borrower_phone: formData.borrowerPhone,
      borrower_email: formData.borrowerEmail,
      component_id: formData.componentId,
      component_name: selectedComponent.name,
      quantity_taken: formData.quantity,
      checkout_date: new Date().toISOString().split('T')[0],
      purpose: formData.purpose,
      return_status: 'Pending',
    })

    setLoading(false)

    if (error) {
      alert('Error creating checkout: ' + error.message)
    } else {
      setSuccess(true)
      // Reset form
      setFormData({
        componentId: '',
        borrowerName: '',
        borrowerSrn: '',
        borrowerPhone: '',
        borrowerEmail: '',
        quantity: 1,
        purpose: '',
      })
      // Reload components to update availability
      loadComponents()
      
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
                Checkout Component
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Issue components to students
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
                Component checked out successfully!
              </p>
              <p className="text-sm text-green-700">
                The inventory has been updated automatically.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Component Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Package className="inline w-4 h-4 mr-1" />
                Select Component
              </label>
              <select
                value={formData.componentId}
                onChange={(e) =>
                  setFormData({ ...formData, componentId: e.target.value })
                }
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
              >
                <option value="">Choose a component...</option>
                {components.map((component) => (
                  <option key={component.id} value={component.id}>
                    {component.name} - {component.available_quantity} available (
                    {component.location})
                  </option>
                ))}
              </select>
              {selectedComponent && (
                <p className="mt-2 text-sm text-gray-600">
                  Available: {selectedComponent.available_quantity} /{' '}
                  {selectedComponent.total_quantity} | Location:{' '}
                  {selectedComponent.location}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max={selectedComponent?.available_quantity || 1}
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: parseInt(e.target.value) })
                }
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
              />
            </div>

            {/* Borrower Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Borrower Name
                </label>
                <input
                  type="text"
                  value={formData.borrowerName}
                  onChange={(e) =>
                    setFormData({ ...formData, borrowerName: e.target.value })
                  }
                  required
                  placeholder="Full name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  SRN
                </label>
                <input
                  type="text"
                  value={formData.borrowerSrn}
                  onChange={(e) =>
                    setFormData({ ...formData, borrowerSrn: e.target.value })
                  }
                  required
                  placeholder="PES1UG21EC001"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.borrowerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, borrowerPhone: e.target.value })
                  }
                  required
                  placeholder="9876543210"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.borrowerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, borrowerEmail: e.target.value })
                  }
                  required
                  placeholder="student@pes.edu"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Purpose
              </label>
              <textarea
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                required
                rows={3}
                placeholder="Project name or purpose for borrowing..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
              />
            </div>

            {/* Info Box */}
            <div className="bg-joel-purple-50 border border-joel-purple-200 rounded-lg p-4">
              <p className="text-sm text-joel-purple-900">
                <Calendar className="inline w-4 h-4 mr-1" />
                Checkout Date: <strong>{new Date().toLocaleDateString()}</strong>
              </p>
              <p className="text-sm text-joel-purple-900 mt-1">
                Issued by: <strong>{mentor.name}</strong>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedComponent}
              className="w-full bg-joel-gradient text-white font-semibold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Checkout Component'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}