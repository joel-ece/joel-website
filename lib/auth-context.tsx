'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, type Mentor } from './supabase'
import { User } from '@supabase/supabase-js'
import { teamMembers } from '@/data/team'

interface AuthContextType {
  user: User | null
  mentor: Mentor | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadMentor(session.user.email!)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadMentor(session.user.email!)
      } else {
        setMentor(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadMentor = async (email: string) => {
    const { data } = await supabase
      .from('mentors')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()
    
    setMentor(data)
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signUp = async (email: string, password: string) => {
    // Check if email is in team.ts
    const isAuthorized = teamMembers.some(
      (member) => member.email.toLowerCase() === email.toLowerCase()
    )

    if (!isAuthorized) {
      return {
        error: new Error('This email is not authorized. Only JoEL mentors can register.'),
      }
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) return { error: signUpError }

      // Create mentor record
      const teamMember = teamMembers.find(
        (m) => m.email.toLowerCase() === email.toLowerCase()
      )!

      await supabase.from('mentors').insert({
        email: teamMember.email,
        name: teamMember.name,
        role: teamMember.role,
        category: teamMember.category,
      })

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, mentor, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}