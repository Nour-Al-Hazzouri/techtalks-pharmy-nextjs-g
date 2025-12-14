import { Metadata } from "next"
import { LoginForm } from "@/components/forms/LoginForm"

export const metadata: Metadata = {
    title: "Sign In - Pharmy",
    description: "Sign in to your Pharmy account",
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <LoginForm />
        </div>
    )
}
