'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { LogOut, User, Menu, X, Home } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar({ user }: { user: any }) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [profile, setProfile] = useState<any>(null)

    const [currentUser, setCurrentUser] = useState(user)

    useEffect(() => {
        // 1. Always sync state with prop (whether it's user object or null)
        setCurrentUser(user)

        // 2. Also check client-side session to handle reloads where server prop might be stale/null
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                setCurrentUser(session.user)
            }
        }

        checkSession()
    }, [user])

    useEffect(() => {
        const fetchProfile = async (userId: string) => {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle()
            setProfile(data)
        }

        if (currentUser) {
            fetchProfile(currentUser.id)
        } else {
            setProfile(null)
        }

        // Listen for auth changes (for immediate UI update on login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                setCurrentUser(session.user)
                await fetchProfile(session.user.id)
                // Note: We do NOT call router.refresh() here to avoid conflict with Login page's router.push()
            } else if (event === 'SIGNED_OUT') {
                setCurrentUser(null)
                setProfile(null)
                window.location.href = '/' // Force hard redirect to clear all state
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [currentUser, router])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        setCurrentUser(null)
        setProfile(null)
        window.location.href = '/' // Force hard redirect to clear all state
    }

    return (
        <nav className="bg-white shadow relative z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <div className="flex flex-shrink-0 items-center">
                            <Link href="/" className="flex items-center text-xl font-bold text-blue-600">
                                <Home className="mr-2 h-6 w-6" />
                                Room Finder
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                        {profile?.role === 'owner' && (
                            <Link href="/owner/dashboard" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-gray-300">
                                Dashboard
                            </Link>
                        )}

                        {currentUser ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">
                                    {profile?.full_name || currentUser.email} ({profile?.role})
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    className="inline-flex cursor-pointer items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link href="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                                    Login
                                </Link>
                                <Link href="/signup" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                        >
                            {isOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="sm:hidden">
                    <div className="space-y-1 pb-3 pt-2">
                        <Link href="/" className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700">
                            Home
                        </Link>
                        {profile?.role === 'owner' && (
                            <Link href="/owner/dashboard" className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700">
                                Dashboard
                            </Link>
                        )}
                        {currentUser ? (
                            <button
                                onClick={handleSignOut}
                                className="block w-full text-left border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                            >
                                Sign out
                            </button>
                        ) : (
                            <>
                                <Link href="/login" className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700">
                                    Login
                                </Link>
                                <Link href="/signup" className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
