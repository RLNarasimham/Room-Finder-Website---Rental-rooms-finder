
import Link from 'next/link'
import { Search, Home, Shield, Users } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Find Your Perfect Room Without The Hassle
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Connect directly with room owners. No brokerage, no hidden fees. Just verified listings and seamless communication.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/search" className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Find a Room
            </Link>
            <Link href="/signup" className="text-sm font-semibold leading-6 text-gray-900">
              List Your Room <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Why Choose Us</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to find your next home
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Verified Listings
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Every room listing is verified to ensure authenticity and safety for all our users.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Users className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Direct Connection
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                Talk directly to property owners. No middlemen, no confusion, just clear communication.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                  <Home className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Wide Variety
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                From 1BHKs to shared accommodations, find exactly what fits your needs and budget.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  )
}
