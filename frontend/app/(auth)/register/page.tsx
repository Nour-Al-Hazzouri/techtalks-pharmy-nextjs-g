import { Metadata } from "next"
import { RegisterForm } from "@/components/forms/RegisterForm"

export const metadata: Metadata = {
    title: "Create Account - Pharmy",
    description: "Register for a new Pharmy account",
}

export default function RegisterPage() {
    return (
        <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Background pattern or subtle gradient can be added here */}
            <RegisterForm />
        </div>
    )
}
