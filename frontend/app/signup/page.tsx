import Image from "next/image";
import Link from "next/link";
import SignUpForm from "@/components/auth/SignUpForm";
import Logo from "@/public/logo.svg";
import AuthGirl from "@/public/auth-girl.svg";

export default function Login() {
    return (
        <div className="flex min-h-screen">
            <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-1/2">
                <div className="">
                    <div>
                        <Image className="h-12 w-auto" src={Logo} alt="Company" />
                        <h2 className="mt-6 text-xl font-semibold tracking-tight text-gray-900">Signup for your free trial</h2>
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
