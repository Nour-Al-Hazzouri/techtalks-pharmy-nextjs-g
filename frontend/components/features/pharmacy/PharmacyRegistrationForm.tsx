"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Store, MapPin, Phone, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { registerPharmacy } from "@/lib/api/pharmacy"
import { ApiError } from "@/lib/api/config"

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(6, "Phone number is too short"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    license_number: z.string().min(1, "License number is required"),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
    onSuccess: () => void
}

export function PharmacyRegistrationForm({ onSuccess }: Props) {
    const [isPending, setIsPending] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            address: "",
            license_number: "",
            latitude: 33.8938, // Default to Beirut
            longitude: 35.5018,
        },
    })

    async function onSubmit(data: FormValues) {
        setIsPending(true)
        setError(null)

        try {
            await registerPharmacy(data)
            onSuccess()
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message)
            } else {
                setError("An error occurred. Please try again.")
            }
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 md:p-8 space-y-6 border border-border bg-white rounded-3xl shadow-lg">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-50 text-[#E91E63] mb-4">
                    <Store className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Setup Your Pharmacy</h1>
                <p className="text-gray-500 mt-2">
                    Complete your profile to start managing your inventory
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pharmacy Name</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input placeholder="Enter pharmacy name" className="pl-9" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input placeholder="+961..." className="pl-9" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input placeholder="City, Street, Building..." className="pl-9" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="license_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>License Number</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input placeholder="License #" className="pl-9" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="latitude"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Latitude</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="any" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="longitude"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Longitude</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="any" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#E91E63] hover:bg-[#D81B60]"
                        disabled={isPending}
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Register Pharmacy
                    </Button>
                </form>
            </Form>
        </div>
    )
}
