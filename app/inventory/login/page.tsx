'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Lock, Mail, LogIn, UserPlus } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/inventory/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-joel-purple-600 via-joel-blue-600 to-joel-purple-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <Lock className="w-8 h-8 text-joel-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            JoEL Inventory System
          </h1>
          <p className="text-joel-purple-100">
            {isSignUp ? 'Create your account' : 'Sign in to access inventory'}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@pes.edu"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-joel-purple-500 focus:ring-2 focus:ring-joel-purple-200 transition-colors"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-joel-gradient text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>
                  {isSignUp ? (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Create Account</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-joel-purple-600 hover:text-joel-purple-700 font-semibold text-sm"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : 'First time? Create an account'}
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Only authorized JoEL mentors can access this system.
              <br />
              Your email must be registered in the team database.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}