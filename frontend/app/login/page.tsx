import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/forms/auth/LoginForm";
import AuthGirl from "@/public/auth-girl.svg";
import { ThemeSwitch } from "@/components/theme-switch";

export default function Login() {
    return (
        <div className="flex min-h-screen">
            <div className="fixed left-4 top-4">
                <ThemeSwitch />
            </div>
            <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm md:min-w-[30rem] bg-content1 px-8 py-12 rounded-md">
                    <div>
                        <h2 className="text-3xl font-semibold">ShpIT</h2>
                        <h2 className="mt-6 text-xl font-semibold tracking-tight">Sign in to your account!</h2>
                        <p className="mt-2 text-sm leading-6 text-default-500">
                            Not a member?
                            <Link href="/signup" className="ml-2 font-semibold text-primary">
                                Start a 14 day free trial
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden w-0 flex-1 lg:block blue-radial">
                <Image className="absolute inset-0 h-full w-full" src={AuthGirl} alt="background image" />
            </div>
        </div>
    );
}
