'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase, type Component } from '@/lib/supabase'
import {
  Package,
  Search,
  Plus,
  LogOut,
  History,
  ClipboardList,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, mentor, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [components, setComponents] = useState<Component[]>([])
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/inventory/login')
    }
  }, [user, authLoading, router])

  // Load components
  useEffect(() => {
    if (user) {
      loadComponents()
    }
  }, [user])

  // Filter components (now includes notes in search)
  useEffect(() => {
    let filtered = components

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((c) => c.category === selectedCategory)
    }

    // Filter by search term (name, location, notes)
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.location?.toLowerCase().includes(q) ||
          c.notes?.toLowerCase().includes(q)
      )
    }

    setFilteredComponents(filtered)
  }, [components, searchTerm, selectedCategory])

  const loadComponents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .order('name')

    if (!error && data) {
      setComponents(data)
      setFilteredComponents(data)
    }
    setLoading(false)
  }

  const categories = ['All', ...new Set(components.map((c) => c.category))]

  const handleSignOut = async () => {
    await signOut()
    router.push('/inventory/login')
  }

  if (authLoading || !user || !mentor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-joel-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                JoEL Inventory Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {mentor.name}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/inventory/checkout"
            className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200 hover:border-joel-purple-400 transition-colors group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-joel-purple-100 p-3 rounded-lg group-hover:bg-joel-purple-200 transition-colors">
                <ClipboardList className="w-6 h-6 text-joel-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Checkout Component</h3>
                <p className="text-sm text-gray-600">Issue components to students</p>
              </div>
            </div>
          </Link>

          <Link
            href="/inventory/history"
            className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200 hover:border-joel-blue-400 transition-colors group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-joel-blue-100 p-3 rounded-lg group-hover:bg-joel-blue-200 transition-colors">
                <History className="w-6 h-6 text-joel-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View History</h3>
                <p className="text-sm text-gray-600">Track checkouts & returns</p>
              </div>
            </div>
          </Link>

          <Link
            href="/inventory/add-component"
            className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200 hover:border-green-400 transition-colors group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Add Component</h3>
                <p className="text-sm text-gray-600">Add new inventory items</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 min-w-0 h-10 relative">
              {/* Use inset-y-0 + flex items-center so the icon is vertically centered */}
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search components, location or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-joel-purple-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Category Filter (horizontally scrollable) */}
            <div className="flex items-center">
              <div className="flex space-x-2 overflow-x-auto md:max-w-xs py-1 pr-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-joel-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Components Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Component
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Loading components...
                    </td>
                  </tr>
                ) : filteredComponents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No components found
                    </td>
                  </tr>
                ) : (
                  filteredComponents.map((component) => {
                    const availabilityPercent =
                      (component.available_quantity / component.total_quantity) * 100
                    const isLow = availabilityPercent < 30

                    return (
                      <tr key={component.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-joel-purple-100 p-2 rounded-lg">
                              <Package className="w-5 h-5 text-joel-purple-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {component.name}
                              </p>
                              {component.notes && (
                                <p className="text-xs text-gray-500">
                                  {component.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {component.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {component.location || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {component.total_quantity}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {component.available_quantity}
                        </td>
                        <td className="px-6 py-4">
                          {component.available_quantity === 0 ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Components</p>
            <p className="text-3xl font-bold text-gray-900">{components.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Categories</p>
            <p className="text-3xl font-bold text-gray-900">
              {categories.length - 1}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
            <p className="text-3xl font-bold text-yellow-600">
              {
                components.filter(
                  (c) =>
                    c.available_quantity > 0 &&
                    (c.available_quantity / c.total_quantity) * 100 < 30
                ).length
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}