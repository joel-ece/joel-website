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
  Search,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'

type SelectedItem = {
  id: string
  name: string
  available_quantity: number
  qty: number
  component_id?: string
}

export default function CheckoutPage() {
  const { user, mentor, loading: authLoading } = useAuth()
  const router = useRouter()
  const [components, setComponents] = useState<Component[]>([])
  const [loadingComponents, setLoadingComponents] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<SelectedItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Borrower form
  const [borrowerName, setBorrowerName] = useState('')
  const [borrowerSrn, setBorrowerSrn] = useState('')
  const [borrowerPhone, setBorrowerPhone] = useState('')
  const [borrowerEmail, setBorrowerEmail] = useState('')
  const [purpose, setPurpose] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/inventory/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) loadComponents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadComponents = async () => {
    setLoadingComponents(true)
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .order('name')

    if (!error && data) {
      setComponents(data)
    } else if (error) {
      console.error('Failed loading components', error)
      alert('Failed to load components: ' + error.message)
    }
    setLoadingComponents(false)
  }

  const filtered = components.filter((c) =>
    `${c.name} ${c.location ?? ''} ${c.notes ?? ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const addToSelected = (c: Component) => {
    const available = Number(c.available_quantity ?? 0)
    if (available <= 0) return
    setSelected((prev) => {
      if (prev.find((p) => p.id === String(c.id))) return prev
      return [
        ...prev,
        {
          id: String(c.id),
          name: c.name,
          available_quantity: available,
          qty: 1,
          component_id: (c as any).id,
        },
      ]
    })
  }

  const removeFromSelected = (id: string) => {
    setSelected((prev) => prev.filter((p) => p.id !== id))
  }

  const updateQty = (id: string, qty: number) => {
    setSelected((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: Math.max(1, Math.min(p.available_quantity, qty)) } : p
      )
    )
  }

  const validateBeforeSubmit = () => {
    if (!borrowerName.trim() || !borrowerSrn.trim()) {
      alert('Borrower name and SRN are required.')
      return false
    }
    if (selected.length === 0) {
      alert('Please add at least one component.')
      return false
    }
    for (const s of selected) {
      if (s.qty <= 0) {
        alert(`Quantity for ${s.name} must be at least 1.`)
        return false
      }
      if (s.qty > s.available_quantity) {
        alert(`Requested quantity for ${s.name} exceeds available quantity.`)
        return false
      }
    }
    return true
  }

  // Submit: insert multiple checkout rows, then decrement components availability
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!mentor) {
      alert('Mentor info missing. Please login again.')
      return
    }
    if (!validateBeforeSubmit()) return

    const confirmed = confirm(
      `Confirm checkout of ${selected.length} item(s) to ${borrowerName} (${borrowerSrn})?`
    )
    if (!confirmed) return

    setSubmitting(true)

    try {
      // Build checkout rows
      const today = new Date().toISOString().split('T')[0]

      const rows = selected.map((s) => ({
        mentor_id: (mentor as any).id ?? null,
        mentor_email: (mentor as any).email ?? null,
        mentor_name: (mentor as any).name ?? null,
        borrower_name: borrowerName,
        borrower_srn: borrowerSrn,
        borrower_phone: borrowerPhone || null,
        borrower_email: borrowerEmail || null,
        component_id: s.component_id || s.id,
        component_name: s.name,
        quantity_taken: s.qty,
        checkout_date: today,
        purpose: purpose || null,
        return_status: 'Pending',
        created_at: new Date().toISOString(),
      }))

      // 1) Insert checkout rows (bulk)
      const { error: insertError } = await supabase.from('checkouts').insert(rows)

      if (insertError) {
        console.error('Insert error', insertError)
        alert('Failed to create checkout records: ' + insertError.message)
        setSubmitting(false)
        return
      }

      // 2) For each selected component, update available_quantity
      const updateErrors: string[] = []

      await Promise.all(
        selected.map(async (s) => {
          try {
            // Fetch latest available_quantity to avoid stale client view
            const { data: compRow, error: compFetchErr } = await supabase
              .from('components')
              .select('available_quantity, total_quantity')
              .eq('id', s.component_id || s.id)
              .single()

            if (compFetchErr) {
              updateErrors.push(`Failed reading component ${s.name}: ${compFetchErr.message}`)
              return
            }

            const currentAvailable = compRow.available_quantity ?? 0
            const newAvailable = Math.max(0, currentAvailable - s.qty)

            const { error: updErr } = await supabase
              .from('components')
              .update({ available_quantity: newAvailable })
              .eq('id', s.component_id || s.id)

            if (updErr) {
              updateErrors.push(`Failed updating ${s.name}: ${updErr.message}`)
            }
          } catch (e: any) {
            updateErrors.push(`Failed updating ${s.name}: ${e?.message ?? e}`)
          }
        })
      )

      if (updateErrors.length > 0) {
        alert(
          'Checkout records created, but some component inventory updates failed:\n' +
            updateErrors.join('\n') +
            '\nPlease adjust component inventory manually.'
        )
      } else {
        setSuccess(true)
        // Hide success message after 3s
        setTimeout(() => setSuccess(false), 3000)
      }

      // Clear cart & form & reload
      setSelected([])
      setBorrowerName('')
      setBorrowerSrn('')
      setBorrowerPhone('')
      setBorrowerEmail('')
      setPurpose('')
      await loadComponents()
    } finally {
      setSubmitting(false)
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
              <h1 className="text-2xl font-bold text-gray-900">Checkout Components</h1>
              <p className="text-sm text-gray-600 mt-1">Assign multiple components in one checkout</p>
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
              <p className="font-semibold text-green-900">Components checked out successfully!</p>
              <p className="text-sm text-green-700">The inventory has been updated automatically.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: borrower form + controls */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-lg font-semibold">Borrower details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="inline w-4 h-4 mr-1" />
                      Borrower Name
                    </label>
                    <input
                      type="text"
                      value={borrowerName}
                      onChange={(e) => setBorrowerName(e.target.value)}
                      required
                      placeholder="Full name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">SRN</label>
                    <input
                      type="text"
                      value={borrowerSrn}
                      onChange={(e) => setBorrowerSrn(e.target.value)}
                      required
                      placeholder="PES1UG21EC001"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="inline w-4 h-4 mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={borrowerPhone}
                      onChange={(e) => setBorrowerPhone(e.target.value)}
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
                      value={borrowerEmail}
                      onChange={(e) => setBorrowerEmail(e.target.value)}
                      placeholder="student@pes.edu"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Purpose
                  </label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    rows={3}
                    placeholder="Project name or purpose for borrowing..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200"
                  />
                </div>

                <div className="bg-joel-purple-50 border border-joel-purple-200 rounded-lg p-4">
                  <p className="text-sm text-joel-purple-900">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Checkout Date: <strong>{new Date().toLocaleDateString()}</strong>
                  </p>
                  <p className="text-sm text-joel-purple-900 mt-1">
                    Issued by: <strong>{mentor.name}</strong>
                  </p>
                </div>

                {/* The primary submit lives in the right column cart too; keep a button here optionally */}
                <div className="hidden md:block">
                  <button
                    type="submit"
                    disabled={submitting || selected.length === 0}
                    className="w-full bg-joel-gradient text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Processing...' : `Checkout (${selected.reduce((a,b)=>a+b.qty,0)} items)`}
                  </button>
                </div>
              </form>
            </div>

            {/* Component search + list */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 border-2 border-gray-100 rounded px-3 py-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  className="w-full border-none outline-none text-sm"
                  placeholder="Search components, location or notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="mt-4">
                {loadingComponents ? (
                  <div className="py-8 text-center text-gray-500">
                    <Loader2 className="animate-spin mx-auto mb-2" />
                    Loading components...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filtered.length === 0 ? (
                      <div className="text-gray-500 p-4">No components found</div>
                    ) : (
                      filtered.map((c) => (
                        <div key={String(c.id)} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center space-x-3">
                            <div className="bg-joel-purple-100 p-2 rounded">
                              <Package className="w-5 h-5 text-joel-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{c.name}</div>
                              <div className="text-xs text-gray-500">{c.location ?? 'N/A'}</div>
                              {c.notes && <div className="text-xs text-gray-400 mt-1">{c.notes}</div>}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="text-sm text-gray-700">{c.available_quantity ?? 0} available</div>
                            <button
                              onClick={() => addToSelected(c)}
                              disabled={(c.available_quantity ?? 0) <= 0}
                              className="flex items-center space-x-2 px-3 py-1 bg-joel-purple-600 text-white rounded hover:bg-joel-purple-700 disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4" />
                              <span className="text-sm">Add</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: cart */}
          <aside>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Selected items ({selected.length})</h3>
                <div className="text-xs text-gray-400">Partial allowed</div>
              </div>

              {selected.length === 0 ? (
                <div className="text-sm text-gray-500">No items selected</div>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-auto pr-1">
                  {selected.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{s.name}</div>
                        <div className="text-xs text-gray-400">{s.available_quantity} available</div>
                      </div>

                      <div className="flex items-center space-x-2 ml-3">
                        <input
                          type="number"
                          min={1}
                          max={s.available_quantity}
                          value={s.qty}
                          onChange={(e) => updateQty(s.id, Number(e.target.value))}
                          className="w-16 text-sm border rounded px-2 py-1"
                        />
                        <button
                          onClick={() => removeFromSelected(s.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={() => handleSubmit()}
                  disabled={submitting || selected.length === 0}
                  className="w-full px-4 py-3 bg-joel-gradient text-white font-semibold rounded hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Processing...' : `Checkout (${selected.reduce((a,b)=>a+b.qty,0)} items)`}
                </button>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              After checkout, inventory is updated. If any inventory updates fail you will be notified to reconcile manually.
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}