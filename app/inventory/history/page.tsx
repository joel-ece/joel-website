'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase, type Checkout } from '@/lib/supabase'
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Package,
} from 'lucide-react'
import Link from 'next/link'

export default function HistoryPage() {
  const { user, mentor, loading: authLoading } = useAuth()
  const router = useRouter()
  const [checkouts, setCheckouts] = useState<Checkout[]>([])
  const [filteredCheckouts, setFilteredCheckouts] = useState<Checkout[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Returned' | 'Overdue'>('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/inventory/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadCheckouts()
    }
  }, [user])

  useEffect(() => {
    let filtered = checkouts

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter((c) => c.return_status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.borrower_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.borrower_srn.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.component_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredCheckouts(filtered)
  }, [checkouts, searchTerm, statusFilter])

  const loadCheckouts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('checkouts')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setCheckouts(data)
      setFilteredCheckouts(data)
    }
    setLoading(false)
  }

  const handleMarkAsReturned = async (checkoutId: string) => {
    if (!mentor) return

    const confirmed = confirm('Mark this item as returned?')
    if (!confirmed) return

    const { error } = await supabase
      .from('checkouts')
      .update({
        return_status: 'Returned',
        return_date: new Date().toISOString().split('T')[0],
        returned_by_mentor_id: mentor.id,
      })
      .eq('id', checkoutId)

    if (error) {
      alert('Error updating return status: ' + error.message)
    } else {
      // Reload checkouts
      loadCheckouts()
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Returned':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Returned
          </span>
        )
      case 'Overdue':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Overdue
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        )
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/inventory/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Checkout History
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                View and manage all component checkouts
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Checkouts</p>
            <p className="text-3xl font-bold text-gray-900">{checkouts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Pending Returns</p>
            <p className="text-3xl font-bold text-yellow-600">
              {checkouts.filter((c) => c.return_status === 'Pending').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Returned</p>
            <p className="text-3xl font-bold text-green-600">
              {checkouts.filter((c) => c.return_status === 'Returned').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Overdue</p>
            <p className="text-3xl font-bold text-red-600">
              {checkouts.filter((c) => c.return_status === 'Overdue').length}
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, SRN, or component..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joel-purple-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              {(['All', 'Pending', 'Returned', 'Overdue'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-joel-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Checkouts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
              Loading checkouts...
            </div>
          ) : filteredCheckouts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
              No checkouts found
            </div>
          ) : (
            filteredCheckouts.map((checkout) => (
              <div
                key={checkout.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  {/* Left side - Main info */}
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-start space-x-4">
                      <div className="bg-joel-purple-100 p-3 rounded-lg">
                        <Package className="w-6 h-6 text-joel-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {checkout.component_name}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <p>
                            <User className="inline w-4 h-4 mr-1" />
                            <strong>Borrower:</strong> {checkout.borrower_name} (
                            {checkout.borrower_srn})
                          </p>
                          <p>
                            <strong>Phone:</strong> {checkout.borrower_phone}
                          </p>
                          <p>
                            <strong>Email:</strong> {checkout.borrower_email}
                          </p>
                          <p>
                            <strong>Quantity:</strong> {checkout.quantity_taken}
                          </p>
                          <p>
                            <Calendar className="inline w-4 h-4 mr-1" />
                            <strong>Checkout:</strong>{' '}
                            {new Date(checkout.checkout_date).toLocaleDateString()}
                          </p>
                          {checkout.return_date && (
                            <p>
                              <strong>Returned:</strong>{' '}
                              {new Date(checkout.return_date).toLocaleDateString()}
                            </p>
                          )}
                          <p className="md:col-span-2">
                            <strong>Purpose:</strong> {checkout.purpose}
                          </p>
                          <p className="md:col-span-2 text-xs">
                            <strong>Issued by:</strong> {checkout.mentor_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Status & Actions */}
                  <div className="flex flex-col items-end space-y-3">
                    {getStatusBadge(checkout.return_status)}
                    {checkout.return_status === 'Pending' && (
                      <button
                        onClick={() => handleMarkAsReturned(checkout.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                      >
                        Mark as Returned
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}