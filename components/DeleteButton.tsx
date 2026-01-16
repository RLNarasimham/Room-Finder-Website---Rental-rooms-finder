'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function DeleteButton({ roomId, onDelete }: { roomId: string, onDelete: (id: string) => Promise<void> }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        const confirmed = window.confirm("WARNING: Are you sure you want to delete this room listing?\n\nThis action cannot be undone.")

        if (confirmed) {
            setIsDeleting(true)
            await onDelete(roomId)
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="relative inline-flex cursor-pointer w-full items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:text-red-500 disabled:opacity-50"
        >
            <Trash2 className={`h-5 w-5 ${isDeleting ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-red-500'}`} aria-hidden="true" />
            {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
    )
}
