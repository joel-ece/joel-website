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
  Trash2,
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

  // Edit modal state
  const [editingCheckout, setEditingCheckout] = useState<Checkout | null>(null)
  const [editForm, setEditForm] = useState({
    borrower_name: '',
    borrower_srn: '',
    borrower_phone: '',
    borrower_email: '',
    quantity_taken: 1,
    purpose: '',
    return_status: 'Pending' as 'Pending' | 'Returned' | 'Overdue',
    return_date: '',
  })
  const [savingEdit, setSavingEdit] = useState(false)

  // Delete state (id being deleted)
  const [deletingId, setDeletingId] = useState<string | null>(null)

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
      const q = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.borrower_name.toLowerCase().includes(q) ||
          c.borrower_srn.toLowerCase().includes(q) ||
          c.component_name.toLowerCase().includes(q)
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

  // Delete checkout: ensure checkout row is deleted, then attempt component rollback.
  // Per your request: no admin/issuer restriction; deletion will remove the checkout entry,
  // and we'll try to restore component.available_quantity afterwards. If component update fails,
  // we will NOT re-insert the checkout — the DB entry stays deleted.
  const handleDeleteCheckout = async (checkoutId: string) => {
    if (!mentor) return

    const confirmed = confirm(
      'Are you sure you want to permanently delete this checkout record? This cannot be undone.'
    )
    if (!confirmed) return

    try {
      setDeletingId(checkoutId)

      // Fetch checkout row (best-effort, used to find component and quantity)
      const { data: checkoutRow, error: fetchErr } = await supabase
        .from('checkouts')
        .select('*')
        .eq('id', checkoutId)
        .single()

      if (fetchErr && fetchErr.code !== 'PGRST116') {
        // If fetch returns an error other than "no rows" continue — deletion will still be attempted.
        // (PGRST116 is "No rows found" depending on supabase/postgrest version; keep deletion attempt anyway)
        console.warn('Could not fetch checkout row before delete:', fetchErr.message)
      }

      // 1) Delete the checkout row (ensure it is removed)
      const { error: delError } = await supabase
        .from('checkouts')
        .delete()
        .eq('id', checkoutId)

      if (delError) {
        alert('Failed to delete checkout: ' + delError.message)
        return
      }

      // 2) If we have the checkout row and it references a component, try to update component availability.
      if (checkoutRow) {
        const componentId =
          (checkoutRow as any).component_id ||
          (checkoutRow as any).componentId ||
          (checkoutRow as any).component ||
          null

        const qty = checkoutRow.quantity_taken || 0

        if (componentId && qty > 0) {
          // Fetch current component quantities
          const { data: compData, error: compErr } = await supabase
            .from('components')
            .select('available_quantity,total_quantity')
            .eq('id', componentId)
            .single()

          if (compErr) {
            // Inform the user but do NOT re-insert the deleted checkout (per your instruction).
            alert(
              'Checkout deleted but failed to fetch component to update availability. Please update the component inventory manually. Error: ' +
                compErr.message
            )
            // Still reload list to reflect deletion
            await loadCheckouts()
            return
          }

          const newAvailable = Math.min(
            compData.total_quantity ?? Infinity,
            (compData.available_quantity ?? 0) + qty
          )

          const { error: updErr } = await supabase
            .from('components')
            .update({ available_quantity: newAvailable })
            .eq('id', componentId)

          if (updErr) {
            // Inform the user but do NOT re-insert the deleted checkout.
            alert(
              'Checkout deleted but failed to update component availability. Please update the component inventory manually. Error: ' +
                updErr.message
            )
            await loadCheckouts()
            return
          }
        }
      }

      // success — reload
      await loadCheckouts()
    } finally {
      setDeletingId(null)
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

  // --- Edit modal helpers ---
  const openEditModal = (checkout: Checkout) => {
    setEditingCheckout(checkout)
    setEditForm({
      borrower_name: checkout.borrower_name || '',
      borrower_srn: checkout.borrower_srn || '',
      borrower_phone: checkout.borrower_phone || '',
      borrower_email: checkout.borrower_email || '',
      quantity_taken: checkout.quantity_taken || 1,
      purpose: checkout.purpose || '',
      return_status: (checkout.return_status as any) || 'Pending',
      return_date: checkout.return_date || '',
    })
  }

  const closeEditModal = () => {
    setEditingCheckout(null)
    setSavingEdit(false)
  }

  const handleEditChange = (key: string, value: any) => {
    setEditForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveEdit = async () => {
    if (!editingCheckout) return

    // Basic validation
    if (!editForm.borrower_name.trim()) {
      alert('Borrower name is required.')
      return
    }

    setSavingEdit(true)
    const payload: Partial<Checkout> = {
      borrower_name: editForm.borrower_name,
      borrower_phone: editForm.borrower_phone,
      borrower_email: editForm.borrower_email,
      quantity_taken: editForm.quantity_taken,
      purpose: editForm.purpose,
      return_status: editForm.return_status,
      return_date:
        editForm.return_status === 'Returned'
          ? editForm.return_date || new Date().toISOString().split('T')[0]
          : editForm.return_date || null,
    }

    const { error } = await supabase
      .from('checkouts')
      .update(payload)
      .eq('id', editingCheckout.id)

    setSavingEdit(false)

    if (error) {
      alert('Failed to save changes: ' + error.message)
    } else {
      closeEditModal()
      loadCheckouts()
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
                    <div className="flex space-x-2">
                      {checkout.return_status === 'Pending' && (
                        <button
                          onClick={() => handleMarkAsReturned(checkout.id)}
                          disabled={deletingId === checkout.id}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50"
                        >
                          Mark as Returned
                        </button>
                      )}

                      {/* Edit button */}
                      <button
                        onClick={() => openEditModal(checkout)}
                        disabled={deletingId === checkout.id}
                        className="px-4 py-2 bg-joel-purple-600 text-white rounded-lg hover:bg-joel-purple-700 transition-colors font-medium text-sm disabled:opacity-50"
                      >
                        Edit
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteCheckout(checkout.id)}
                        disabled={deletingId !== null}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {deletingId === checkout.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              if (!savingEdit) closeEditModal()
            }}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg z-10 p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Checkout</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Component</label>
                <input
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
                  value={editingCheckout.component_name}
                  readOnly
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">SRN</label>
                <input
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
                  value={editForm.borrower_srn}
                  readOnly
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Borrower Name</label>
                <input
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={editForm.borrower_name}
                  onChange={(e) => handleEditChange('borrower_name', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Phone</label>
                <input
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={editForm.borrower_phone}
                  onChange={(e) => handleEditChange('borrower_phone', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Email</label>
                <input
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={editForm.borrower_email}
                  onChange={(e) => handleEditChange('borrower_email', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Quantity</label>
                <input
                  type="number"
                  min={1}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={editForm.quantity_taken}
                  onChange={(e) => handleEditChange('quantity_taken', Number(e.target.value))}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-gray-600">Purpose</label>
                <textarea
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  rows={2}
                  value={editForm.purpose}
                  onChange={(e) => handleEditChange('purpose', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Return Status</label>
                <select
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={editForm.return_status}
                  onChange={(e) =>
                    handleEditChange('return_status', e.target.value as any)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Returned">Returned</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-600">Return Date</label>
                <input
                  type="date"
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  value={editForm.return_date || ''}
                  onChange={(e) => handleEditChange('return_date', e.target.value)}
                  disabled={editForm.return_status !== 'Returned'}
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