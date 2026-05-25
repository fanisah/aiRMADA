'use client'

import { useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/**
 * Email Confirmation Callback Page
 * Handles the email confirmation redirect from Supabase
 * Redirects to /overview after successful confirmation
 *
 * @location apps/web/src/app/(auth)/auth/callback/page.tsx
 */

// 1. Pindahkan semua logika utama ke dalam sub-komponen
function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  const handleEmailConfirmation = useCallback(async () => {
    // Handle error case
    if (error || errorDescription) {
      console.error('Email confirmation error:', error, errorDescription)
      router.push(
        `/register?error=${encodeURIComponent(errorDescription || error || 'Confirmation failed')}`
      )
      return
    }

    // Handle success case
    if (code) {
      try {
        const supabase = createClient()

        // Exchange code for session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          console.error('Error exchanging code for session:', exchangeError)
          router.push(`/register?error=${encodeURIComponent(exchangeError.message)}`)
          return
        }

        // Success - redirect to overview
        router.push('/overview')
      } catch (err) {
        console.error('Callback error:', err)
        router.push('/register?error=An error occurred during confirmation')
      }
    } else {
      // No code provided
      router.push('/register?error=No confirmation code provided')
    }
  }, [code, error, errorDescription, router])

  useEffect(() => {
    handleEmailConfirmation()
  }, [handleEmailConfirmation])

  // UI saat sedang memverifikasi
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 to-slate-200">
      <div className="text-center">
        <div className="mb-4 inline-block">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
        </div>
        <p className="text-lg font-semibold text-slate-700">Confirming your email...</p>
        <p className="mt-2 text-sm text-slate-600">Please wait while we redirect you.</p>
      </div>
    </div>
  )
}

// 2. Bungkus komponen di atas dengan Suspense pada default export
export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        // UI fallback yang sama persis agar transisi layarnya mulus
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 to-slate-200">
          <div className="text-center">
            <div className="mb-4 inline-block">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
            </div>
            <p className="text-lg font-semibold text-slate-700">Loading...</p>
            <p className="mt-2 text-sm text-slate-600">Preparing confirmation page.</p>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  )
}
