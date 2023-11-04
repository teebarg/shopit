import Image from "next/image";
import Link from "next/link";
import SignUpForm from "@/components/auth/SignUpForm";
import Logo from "@/public/logo.png";

export default function Login() {
    return (
        <div className="flex min-h-screen">
            <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-1/2">
                <div className="">
                    <div>
                        <Image width={0} height={0} className="h-16 w-auto" src={Logo} alt="Company" />
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
                <Image
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
                    alt="background image"
                    fill
                />
            </div>
        </div>
    );
}
