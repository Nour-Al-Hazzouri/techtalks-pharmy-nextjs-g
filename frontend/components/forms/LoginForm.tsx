"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"

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
import { MOCK_USERS } from "@/lib/mock-data"

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm() {
    const router = useRouter()
    const [isPending, setIsPending] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: LoginValues) {
        setIsPending(true)
        setError(null)

        try {
            await new Promise((resolve) => setTimeout(resolve, 800))

            const user = MOCK_USERS.find(
                (u) => u.email === data.email && u.password === data.password
            )

            if (!user) {
                setError("Invalid email or password")
                setIsPending(false)
                return
            }

            // Set auth cookies
            document.cookie = "auth_token=mock_jwt_token; path=/; max-age=86400; SameSite=Lax"
            document.cookie = `user_role=${user.role}; path=/; max-age=86400; SameSite=Lax`

            // Redirect based on role
            if (user.role === 'pharmacy') {
                router.push('/dashboard')
            } else {
                router.push('/')
            }
            router.refresh()
        } catch (err) {
            console.error(err)
            setError("An error occurred. Please try again.")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 md:p-8 space-y-6 border border-border bg-muted/40 rounded-3xl min-w-[340px]">
            <div className="bg-[#E91E63] text-white p-8 rounded-[30px] rounded-br-[60px] shadow-xl relative overflow-hidden mb-8">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">WELCOME BACK</h1>
                    <p className="opacity-90">Sign in to continue</p>
                </div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            {/* Test Credentials Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
                <p className="font-semibold text-blue-800 mb-2">Test Accounts:</p>
                <ul className="text-blue-700 space-y-1 text-xs">
                    <li><strong>Patient:</strong> patient@test.com / patient123</li>
                    <li><strong>Pharmacy:</strong> pharmacy@test.com / pharmacy123</li>
                </ul>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

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

                    <Button
                        type="submit"
                        className="w-full h-12 bg-[#E91E63] hover:bg-[#D81B60] text-white font-semibold rounded-xl text-lg mt-4 shadow-lg shadow-pink-200"
                        disabled={isPending}
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        SIGN IN
                    </Button>

                    <div className="text-center text-sm text-muted-foreground mt-6">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-semibold text-[#E91E63] hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </Form>
        </div>
    )
}
