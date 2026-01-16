
import { createClient } from '@/lib/supabaseServer'
import FilterBar from '@/components/FilterBar'
import RoomCard from '@/components/RoomCard'

export const dynamic = 'force-dynamic'

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient()
    const params = await searchParams // Await searchParams in Next.js 15+

    let query = supabase.from('rooms').select('*')

    if (params.location) {
        const searchTerm = `%${params.location as string}%`
        query = query.or(`title.ilike.${searchTerm},location.ilike.${searchTerm}`)
    }
    if (params.minPrice) {
        query = query.gte('price', params.minPrice)
    }
    if (params.maxPrice) {
        query = query.lte('price', params.maxPrice)
    }
    if (params.propertyType) {
        query = query.eq('property_type', params.propertyType as string)
    }
    if (params.preference) {
        query = query.eq('tenant_preference', params.preference as string)
    }

    const { data: rooms } = await query.order('created_at', { ascending: false })

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Search Header */}
            <div className="bg-blue-600 pb-32">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl text-center">
                        Find Rooms
                    </h1>
                    <p className="mt-4 text-lg text-blue-100 text-center max-w-2xl mx-auto">
                        Use the filters below to narrow down your search and find the perfect place.
                    </p>
                </div>
            </div>

            <div className="-mt-24 mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                <FilterBar />

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {rooms && rooms.length > 0
                            ? `Available Listings (${rooms.length})`
                            : 'No rooms found matching your criteria'}
                    </h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {rooms?.map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
