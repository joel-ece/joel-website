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
  Edit2,
  Download,
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

  // Edit modal state
  const [editingComponent, setEditingComponent] = useState<Component | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    location: '',
    total_quantity: 0,
    available_quantity: 0,
    notes: '',
  })
  const [savingEdit, setSavingEdit] = useState(false)

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

  // Filter components (includes notes in search)
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
    } else if (error) {
      console.error('Failed to load components', error)
    }
    setLoading(false)
  }

  const categories = ['All', ...new Set(components.map((c) => c.category))]

  const handleSignOut = async () => {
    await signOut()
    router.push('/inventory/login')
  }

  // --- Edit handlers ---
  const openEditModal = (component: Component) => {
    setEditingComponent(component)
    setEditForm({
      name: component.name ?? '',
      category: component.category ?? '',
      location: component.location ?? '',
      total_quantity: component.total_quantity ?? 0,
      available_quantity: component.available_quantity ?? 0,
      notes: component.notes ?? '',
    })
  }

  const closeEditModal = () => {
    setEditingComponent(null)
    setSavingEdit(false)
  }

  const handleEditChange = (key: string, value: any) => {
    setEditForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveEdit = async () => {
    if (!editingComponent) return
    // Basic validation
    if (!editForm.name.trim()) {
      alert('Name is required')
      return
    }
    if (editForm.available_quantity < 0 || editForm.total_quantity < 0) {
      alert('Quantities cannot be negative')
      return
    }
    if (editForm.available_quantity > editForm.total_quantity) {
      // keep available <= total
      handleEditChange('available_quantity', editForm.total_quantity)
    }

    setSavingEdit(true)
    const payload: Partial<Component> = {
      name: editForm.name,
      category: editForm.category,
      location: editForm.location,
      total_quantity: editForm.total_quantity,
      available_quantity: editForm.available_quantity,
      notes: editForm.notes,
    }

    const { error } = await supabase
      .from('components')
      .update(payload)
      .eq('id', editingComponent.id)

    setSavingEdit(false)

    if (error) {
      alert('Failed to save: ' + error.message)
    } else {
      closeEditModal()
      await loadComponents()
    }
  }

  // --- Export CSV ---
  const exportCSV = () => {
    const rows = filteredComponents.length ? filteredComponents : components
    if (!rows.length) {
      alert('No data to export')
      return
    }

    const headers = [
      'name',
      'category',
      'location',
      'total_quantity',
      'available_quantity',
      'notes',
    ]
    const csv = [
      headers.join(','),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const v = (r as any)[h] ?? ''
            // escape quotes
            const s = String(v).replace(/"/g, '""')
            return `"${s}"`
          })
          .join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `components-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
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
              <h1 className="text-2xl font-bold text-gray-900">JoEL Inventory Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back, {mentor.name}</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={exportCSV}
                className="flex items-center space-x-2 px-3 py-2 bg-white border rounded-md hover:bg-gray-50"
                title="Export CSV"
              >
                <Download className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Export CSV</span>
              </button>

              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
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
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Loading components...
                    </td>
                  </tr>
                ) : filteredComponents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
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
                              <p className="font-semibold text-gray-900">{component.name}</p>
                              {component.notes && (
                                <p className="text-xs text-gray-500">{component.notes}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {component.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{component.location || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{component.total_quantity}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{component.available_quantity}</td>
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
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center space-x-2">
                            <button
                              onClick={() => openEditModal(component)}
                              className="px-3 py-2 bg-white border rounded-md hover:bg-gray-50 flex items-center space-x-2"
                              title="Edit component"
                            >
                              <Edit2 className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-700">Edit</span>
                            </button>
                          </div>
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
            <p className="text-3xl font-bold text-gray-900">{categories.length - 1}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
            <p className="text-3xl font-bold text-yellow-600">
              {components.filter((c) => c.available_quantity > 0 && (c.available_quantity / c.total_quantity) * 100 < 30).length}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingComponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              if (!savingEdit) closeEditModal()
            }}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg z-10 p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Component</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="text-xs text-gray-600">Name</label>
                <input
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={editForm.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Category</label>
                <input
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={editForm.category}
                  onChange={(e) => handleEditChange('category', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Location</label>
                <input
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={editForm.location}
                  onChange={(e) => handleEditChange('location', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Total Quantity</label>
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={editForm.total_quantity}
                  onChange={(e) => handleEditChange('total_quantity', Number(e.target.value))}
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Available Quantity</label>
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={editForm.available_quantity}
                  onChange={(e) => handleEditChange('available_quantity', Number(e.target.value))}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-gray-600">Notes</label>
                <textarea
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) => handleEditChange('notes', e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={closeEditModal}
                disabled={savingEdit}
                className="px-4 py-2 border rounded bg-white text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="px-4 py-2 bg-joel-purple-600 text-white rounded hover:bg-joel-purple-700 text-sm"
              >
                {savingEdit ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}