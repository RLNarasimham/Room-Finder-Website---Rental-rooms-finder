'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Loader2, Upload, MapPin, Phone } from 'lucide-react'

export default function EditRoom() {
    const router = useRouter()
    const params = useParams()
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        location: '',
        price: '',
        property_type: '1 BHK',
        tenant_preference: 'Bachelor',
        contact_number: '',
    })

    useEffect(() => {
        const fetchRoom = async () => {
            if (!id) return;

            const { data: room, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                setError('Failed to fetch room details')
                setLoading(false)
                return
            }

            if (room) {
                setFormData({
                    title: room.title || '',
                    description: room.description || '',
                    address: room.address || '',
                    location: room.location || '',
                    price: room.price?.toString() || '',
                    property_type: room.property_type || '1 BHK',
                    tenant_preference: room.tenant_preference || 'Bachelor',
                    contact_number: room.contact_number || '',
                })
            }
            setLoading(false)
        }
        fetchRoom()
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error: updateError } = await supabase
                .from('rooms')
                .update({
                    title: formData.title,
                    description: formData.description,
                    address: formData.address,
                    location: formData.location,
                    price: parseFloat(formData.price),
                    property_type: formData.property_type,
                    tenant_preference: formData.tenant_preference,
                    contact_number: formData.contact_number,
                })
                .eq('id', id)

            if (updateError) throw updateError

            router.push('/owner/dashboard')
            router.refresh()
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

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="bg-white px-6 py-8 shadow sm:rounded-lg">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 mb-6">Edit Room</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">Title</label>
                        <div className="mt-2">
                            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">Description</label>
                        <div className="mt-2">
                            <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">City / Location</label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input type="text" name="location" required value={formData.location} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Rent Price (Monthly)</label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-gray-500 sm:text-sm">₹</span>
                                </div>
                                <input type="number" name="price" required value={formData.price} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Property Type</label>
                            <div className="mt-2">
                                <select name="property_type" value={formData.property_type} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6">
                                    <option>1 BHK</option>
                                    <option>2 BHK</option>
                                    <option>3 BHK</option>
                                    <option>Shared Room</option>
                                    <option>Private Room</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Tenant Preference</label>
                            <div className="mt-2">
                                <select name="tenant_preference" value={formData.tenant_preference} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6">
                                    <option>Bachelor</option>
                                    <option>Family</option>
                                    <option>Girls Only</option>
                                    <option>Boys Only</option>
                                    <option>Working Professionals</option>
                                    <option>Any</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">Full Address</label>
                        <div className="mt-2">
                            <input type="text" name="address" required value={formData.address} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">Contact Number</label>
                        <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input type="tel" name="contact_number" required value={formData.contact_number} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    {error && <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">{error}</div>}
                    <div className="flex items-center justify-end gap-x-6">
                        <button type="button" onClick={() => router.back()} className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                        <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50">{loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Update Room'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
