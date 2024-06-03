import Image from "next/image";
import Link from "next/link";
import SignUpForm from "@/components/forms/auth/SignUpForm";
import AuthGirl from "@/public/auth-girl.svg";
import { ThemeSwitch } from "@/components/theme-switch";

export default function SignUp() {
    return (
        <div className="flex min-h-screen">
            <div className="fixed left-4 top-4">
                <ThemeSwitch />
            </div>
            <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-1/2">
                <div className="">
                    <div>
                        <h2 className="text-3xl font-semibold">ShpIT</h2>
                        <h2 className="mt-6 text-xl font-semibold tracking-tight">Signup for your free trial</h2>
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Already a member?
                            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 ml-2">
                                Login here
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <SignUpForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden w-0 flex-1 lg:block">
                <Image className="absolute inset-0 h-full w-full blue-radial" src={AuthGirl} alt="background image" />
            </div>
        </div>
    );
}
