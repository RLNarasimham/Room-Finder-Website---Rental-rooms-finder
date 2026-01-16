import Link from 'next/link'
import { MapPin, Home, Users } from 'lucide-react'

interface Room {
    id: string
    title: string
    price: number
    location: string
    property_type: string
    tenant_preference: string
    images: string[]
}

export default function RoomCard({ room }: { room: Room }) {
    return (
        <Link href={`/rooms/${room.id}`} className="group block">
            <div className="overflow-hidden rounded-lg bg-white shadow transition-all hover:shadow-lg">
                <div className="relative aspect-[16/9] w-full bg-gray-200">
                    {room.images && room.images.length > 0 ? (
                        <img
                            src={room.images[0]}
                            alt={room.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                            No Image
                        </div>
                    )}
                    <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-sm font-semibold text-white">
                        ₹{room.price}
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="truncate text-lg font-medium text-gray-900 group-hover:text-blue-600">
                        {room.title}
                    </h3>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                        <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{room.location}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs font-medium text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <Home className="w-3 h-3" /> {room.property_type}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <Users className="w-3 h-3" /> {room.tenant_preference}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
