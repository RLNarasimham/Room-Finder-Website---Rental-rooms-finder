'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, MapPin, SlidersHorizontal } from 'lucide-react'

export default function FilterBar() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [filters, setFilters] = useState({
        location: searchParams?.get('location') || '',
        minPrice: searchParams?.get('minPrice') || '',
        maxPrice: searchParams?.get('maxPrice') || '',
        propertyType: searchParams?.get('propertyType') || '',
        preference: searchParams?.get('preference') || ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (filters.location) params.set('location', filters.location)
        if (filters.minPrice) params.set('minPrice', filters.minPrice)
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
        if (filters.propertyType) params.set('propertyType', filters.propertyType)
        router.push(`/search?${params.toString()}`)
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Location Search */}
                <div className="relative col-span-1 md:col-span-2 lg:col-span-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="location"
                        placeholder="Search by city or area..."
                        value={filters.location}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                </div>

                {/* Price Range */}
                <div className="flex gap-2">
                    <input
                        type="number"
                        name="minPrice"
                        placeholder="Min Price"
                        value={filters.minPrice}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                    <input
                        type="number"
                        name="maxPrice"
                        placeholder="Max Price"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                </div>

                {/* Property Type */}
                <div>
                    <select
                        name="propertyType"
                        value={filters.propertyType}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                    >
                        <option value="">Property Type (All)</option>
                        <option value="1 BHK">1 BHK</option>
                        <option value="2 BHK">2 BHK</option>
                        <option value="3 BHK">3 BHK</option>
                        <option value="Shared Room">Shared Room</option>
                        <option value="Private Room">Private Room</option>
                    </select>
                </div>

                {/* Tenant Preference */}
                <div>
                    <select
                        name="preference"
                        value={filters.preference}
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                    >
                        <option value="">Tenant Pref (All)</option>
                        <option value="Bachelor">Bachelor</option>
                        <option value="Family">Family</option>
                        <option value="Girls Only">Girls Only</option>
                        <option value="Boys Only">Boys Only</option>
                        <option value="Working Professionals">Working Professionals</option>
                    </select>
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleSearch}
                    className="inline-flex cursor-pointer items-center gap-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    <Search className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Find Rooms
                </button>
            </div>
        </div>
    )
}
