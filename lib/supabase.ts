import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txyaofedlixjvxkednye.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4eWFvZmVkbGl4anZ4a2VkbnllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NDA2NzYsImV4cCI6MjA4NjExNjY3Nn0.OACpCS1grGvEoSUNj10CMWOxVYTvCdRORyhRIpTVcUc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Component {
  id: string
  name: string
  category: string
  total_quantity: number
  available_quantity: number
  location: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Mentor {
  id: string
  email: string
  name: string
  role: string
  category: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Checkout {
  id: string
  mentor_id: string | null
  mentor_email: string
  mentor_name: string
  borrower_name: string
  borrower_srn: string
  borrower_phone: string
  borrower_email: string
  component_id: string | null
  component_name: string
  quantity_taken: number
  checkout_date: string
  purpose: string
  return_status: 'Pending' | 'Returned' | 'Overdue'
  return_date: string | null
  returned_by_mentor_id: string | null
  return_notes: string | null
  created_at: string
  updated_at: string
}