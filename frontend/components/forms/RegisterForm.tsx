"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Mail, Lock, User, Phone, Eye, EyeOff, Building2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { registerSchema, RegisterValues } from "@/lib/validations/auth"

export function RegisterForm() {
    const router = useRouter()
    const [isPending, setIsPending] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "+961",
            password: "",
            confirmPassword: "",
            role: "patient",
        },
    })

    async function onSubmit(data: RegisterValues) {
        setIsPending(true)
        try {
            // Form validation is handled by react-hook-form before this function is called
            // Just redirect for now as requested
            router.push(data.role === 'pharmacy' ? '/dashboard' : '/map')
        } catch (error) {
            console.error(error)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-4 space-y-6">
            <div className="bg-[#E91E63] text-white p-8 rounded-[30px] rounded-bl-[60px] shadow-xl relative overflow-hidden mb-8">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">CREATE ACCOUNT</h1>
                    <p className="opacity-90">Sign up to get started</p>
                </div>
                {/* Decorative circle */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Full Name</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                        <Input placeholder="Enter your full name" className="pl-10 h-12 bg-gray-50 border-0 rounded-xl" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Email Address</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                        <Input type="email" placeholder="Enter your email" className="pl-10 h-12 bg-gray-50 border-0 rounded-xl" {...field} />
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
                                <FormLabel className="sr-only">Phone Number</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                        <Input placeholder="+961 XXXXXXXX" className="pl-10 h-12 bg-gray-50 border-0 rounded-xl" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 z-10" />
                                            <SelectTrigger className="pl-10 h-12 bg-gray-50 border-0 rounded-xl w-full">
                                                <SelectValue placeholder="Select your role" />
                                            </SelectTrigger>
                                        </div>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="patient">Patient</SelectItem>
                                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="pl-10 pr-10 h-12 bg-gray-50 border-0 rounded-xl"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Confirm Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            className="pl-10 pr-10 h-12 bg-gray-50 border-0 rounded-xl"
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#E91E63] hover:bg-[#D81B60] text-white font-semibold rounded-xl text-lg mt-4 shadow-lg shadow-pink-200"
                        disabled={isPending}
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        SIGN UP
                    </Button>

                    <div className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-[#E91E63] hover:underline">
                            Sign In
                        </Link>
                    </div>
                </form>
            </Form>
        </div>
    )
}
