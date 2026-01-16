
import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, MapPin, DollarSign, Home, Users, Edit, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import DeleteButton from '@/components/DeleteButton'

export default async function OwnerDashboard() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch only rooms owned by this user.
    // RLS also enforces this, but good to be explicit or if RLS is flexible.
    const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

    async function deleteRoom(id: string) {
        'use server'
        const supabase = await createClient()
        await supabase.from('rooms').delete().eq('id', id)
        revalidatePath('/owner/dashboard')
        revalidatePath('/')
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        My Listings
                    </h2>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    <Link
                        href="/owner/add"
                        className="ml-3 inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                        Add New Room
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rooms?.map((room) => (
                    <div
                        key={room.id}
                        className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
                    >
                        <div className="flex w-full items-center justify-between space-x-6 p-6">
                            <div className="flex-1 truncate">
                                <div className="flex items-center space-x-3">
                                    <h3 className="truncate text-sm font-medium text-gray-900">
                                        {room.title}
                                    </h3>
                                    <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                        ₹{room.price}
                                    </span>
                                </div>
                                <p className="mt-1 truncate text-sm text-gray-500">{room.location}</p>
                                <div className="mt-4 flex gap-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1"><Home className="w-3 h-3" /> {room.property_type}</span>
                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {room.tenant_preference}</span>
                                </div>
                            </div>
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300 overflow-hidden">
                                {room.images && room.images.length > 0 ? (
                                    <img className="h-full w-full object-cover" src={room.images[0]} alt="" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs">No Img</div>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="-mt-px flex divide-x divide-gray-200">
                                <div className="flex w-0 flex-1">
                                    {/* Edit Link would go here */}
                                    <Link
                                        href={`/owner/edit/${room.id}`}
                                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:text-gray-500"
                                    >
                                        <Edit className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        Edit
                                    </Link>
                                </div>
                                <div className="-ml-px flex w-0 flex-1">
                                    <DeleteButton roomId={room.id} onDelete={deleteRoom} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {(!rooms || rooms.length === 0) && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No rooms listed yet. Click "Add New Room" to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
