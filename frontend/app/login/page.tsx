import Image from "next/image";
import LoginForm from "./LoginForm";

export default function Login() {
    return (
        <div className="flex min-h-screen">
            <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <Image
                            width={0}
                            height={0}
                            className="h-10 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Company"
                        />
                        <h2 className="mt-6 text-xl font-semibold tracking-tight text-gray-900">Sign in to your account!!!</h2>
                    </div>

                    <div className="mt-8">
                        <LoginForm />
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
