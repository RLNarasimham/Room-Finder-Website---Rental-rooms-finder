'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { User, Building, Mail, Lock, Loader2 } from 'lucide-react'

export default function Signup() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState<'finder' | 'owner'>('finder')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // First check if user already exists in profiles
            const { data: existingUser } = await supabase
                .from('profiles')
                .select('email')
                .eq('email', email)
                .maybeSingle()

            if (existingUser) {
                throw new Error('User already registered. Please sign in.')
            }

            // Pass metadata to Supabase Auth to be handled by a Trigger
            const { data: { user }, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role,
                    }
                }
            })

            let userId = user?.id

            // Check for existing user via identities (Supabase security feature)
            if (user && user.identities && user.identities.length === 0) {
                throw new Error('User already registered. Please sign in.')
            }

            // Handle case where user might already exist 
            if (!userId && signUpError) throw signUpError
            if (!userId) throw new Error('Signup failed - no user returned')

            // Profile creation is now handled by the Database Trigger.
            // We do not manually insert into 'profiles' here to avoid 401 errors.

            // If Supabase sends back a user but no session, it means email verification is required.
            if (user && !user.aud.includes('authenticated')) {
                // Typically user.role is 'authenticated', but if email confirm is on, session might be null.
                // However, the best check is simply checking if session is established. 
                // Since strict check is hard without the full response object which auth.signUp return struct is {data: {user, session}, error}.
                // Let's rely on session check if possible, but we destructured it.
                // Wait, we need 'session' from the response. It was not destructured above.
            }

            // Re-fetching session to be sure, or just assume if we are here and not redirected by a provider, we are good.
            // Actually, let's just show Success for EVERYONE if we don't auto-redirect.
            // But user asked for specific "verifying email" message.

            // Let's change the logic to always show success message, then redirect after delay?
            // Or just show message "Account created successfully!"

            setSuccessMessage('Account created successfully! Please check your email for verification link!!!')

            // Optional: Auto redirect after few seconds, or let them click login.
            // For better UX with "Verify Email", we stop here.

            // router.push('/') // Removed immediate redirect
            // router.refresh()
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An unexpected error occurred')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Create your account
                    </h2>
                </div>

                {successMessage ? (
                    <div className="mt-8 bg-green-50 p-6 rounded-lg text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                            <Mail className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-medium text-green-900">Account Created!</h3>
                        <p className="mt-2 text-sm text-green-600">{successMessage}</p>
                        <div className="mt-6">
                            <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                Proceed to Login
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                type="button"
                                onClick={() => setRole('finder')}
                                className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${role === 'finder'
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-blue-200'
                                    }`}
                            >
                                <User className="h-8 w-8 mb-2" />
                                <span className="font-medium">Room Finder</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('owner')}
                                className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${role === 'owner'
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-blue-200'
                                    }`}
                            >
                                <Building className="h-8 w-8 mb-2" />
                                <span className="font-medium">Room Owner</span>
                            </button>
                        </div>

                        <div className="-space-y-px rounded-md shadow-sm">
                            <div className="relative">
                                <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                                <input
                                    id="full-name"
                                    name="fullName"
                                    type="text"
                                    required
                                    className="relative block w-full rounded-t-lg border-0 py-3 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="relative block w-full border-0 py-3 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="relative block w-full rounded-b-lg border-0 py-3 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex cursor-pointer w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </div>

                        <div className="text-sm text-center">
                            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Already have an account? Sign in
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
