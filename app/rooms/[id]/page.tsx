
import { createClient } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, ArrowLeft, Phone, User, Home, Users } from 'lucide-react'

export default async function RoomDetails({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const supabase = await createClient()
    const { id } = await params

    const { data: room } = await supabase
        .from('rooms')
        .select(`
      *,
      profiles (
        full_name,
        email
      )
    `)
        .eq('id', id)
        .single()

    if (!room) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link href="/search" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Search
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-2">
                    {/* Images Section */}
                    <div>
                        <div className="overflow-hidden rounded-lg bg-gray-200">
                            {room.images && room.images.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="aspect-[4/3] w-full">
                                        <img
                                            src={room.images[0]}
                                            alt={room.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    {/* Thumbnails grid if more images */}
                                    {room.images.length > 1 && (
                                        <div className="grid grid-cols-4 gap-4">
                                            {room.images.slice(1).map((img: string, idx: number) => (
                                                <div key={idx} className="aspect-square overflow-hidden rounded-lg bg-gray-200">
                                                    <img src={img} alt="" className="h-full w-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex aspect-[4/3] items-center justify-center text-gray-400">
                                    No Photos Available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{room.title}</h1>
                            <div className="mt-2 flex items-center text-gray-500">
                                <MapPin className="mr-2 h-5 w-5" />
                                {room.location}
                            </div>
                        </div>

                        <div className="border-b border-gray-200 py-6">
                            <span className="text-4xl font-bold tracking-tight text-gray-900">₹{room.price}</span>
                            <span className="text-gray-500 ml-2">/ month</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                    <Home className="w-4 h-4" /> Property Type
                                </div>
                                <div className="font-semibold text-gray-900">{room.property_type}</div>
                            </div>
                            <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                    <Users className="w-4 h-4" /> Tenant Preference
                                </div>
                                <div className="font-semibold text-gray-900">{room.tenant_preference}</div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
                            <h3 className="text-lg font-semibold leading-8 text-gray-900">Contact Owner</h3>
                            <dl className="mt-4 space-y-4 text-sm leading-6">
                                <div className="flex gap-x-4">
                                    <dt className="flex-none">
                                        <User className="h-6 w-5 text-gray-400" aria-hidden="true" />
                                    </dt>
                                    <dd className="text-gray-900">
                                        {room.profiles?.full_name || 'Room Owner'}
                                    </dd>
                                </div>
                                <div className="flex gap-x-4">
                                    <dt className="flex-none">
                                        <Phone className="h-6 w-5 text-gray-400" aria-hidden="true" />
                                    </dt>
                                    <dd>
                                        <a href={`tel:${room.contact_number}`} className="font-semibold text-blue-600 hover:text-blue-500">
                                            {room.contact_number}
                                        </a>
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                            <div className="mt-2 prose prose-sm text-gray-500">
                                <p>{room.description}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                            <div className="mt-2 text-gray-500">
                                <p>{room.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
