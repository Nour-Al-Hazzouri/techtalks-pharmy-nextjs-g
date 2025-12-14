import { redirect } from "next/navigation"

/**
 * Home page redirects to login by default
 * Users need to authenticate before accessing the app
 */
export default function HomePage() {
    redirect("/login")
}
