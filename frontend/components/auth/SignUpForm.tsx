"use client";

import { useState, useRef } from "react";
import { SignInResponse, signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import Alert from "@/components/core/Alert";

type Inputs = {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
};

export default function SignUpForm() {
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const password = useRef({});

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (loading) {
            return;
        }
        setLoading(true);
        const { email, password } = data;
        const body = JSON.stringify(data);
        try {
            // Sign Up
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
                body,
            });
            const data = await res.json();
            setLoading(false);
            if (res.status === 400) {
                setErrorMessage(data.detail);
                return;
            } else if (res.status === 422) {
                setErrorMessage("Please check your inputs and try again");
                return;
            }
            // Sign In to Next Auth
            const response: SignInResponse | undefined = await signIn("credentials", { redirect: false, email, password });
            if (response?.ok) {
                window.location.href = "/";
                return;
            }
        } catch (error) {
            console.log("🚀 ~ file: LoginForm.tsx:26 ~ handleSubmit ~ error:", error);
            setErrorMessage("An error occurred, please contact the administrator");
            setLoading(false);
        }
    };
    password.current = watch("password", "");

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                        First name
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            placeholder="Ex. John"
                            className="input input-bordered w-full form-fix"
                            autoComplete="first-name"
                            {...register("firstname", { required: true })}
                        />
                        {errors.firstname && <span>Firstname is required</span>}
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                        Last name
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            placeholder="Ex. Mosh"
                            className="input input-bordered w-full form-fix"
                            autoComplete="family-name"
                            {...register("lastname", { required: "Lastname is required" })}
                        />
                        {errors.lastname && <span role="alert">{errors.lastname.message}</span>}
                    </div>
                </div>
                <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Email
                    </label>
                    <div className="mt-2">
                        <input
                            id="email"
                            type="text"
                            placeholder="Ex. email@email.com"
                            className="input input-bordered w-full form-fix"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Entered value does not match email format",
                                },
                            })}
                        />
                        {errors.email && <span role="alert">{errors.email.message}</span>}
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                        Phone
                    </label>
                    <div className="mt-2">
                        <input
                            id="phone"
                            type="text"
                            placeholder="Ex. 09000000000"
                            className="input input-bordered w-full form-fix"
                            {...register("phone", {
                                minLength: {
                                    value: 11,
                                    message: "Phone number must have at least 11 characters",
                                },
                                maxLength: {
                                    value: 11,
                                    message: "Phone number must have at most 11 characters",
                                },
                            })}
                        />
                        {errors.phone && <span role="alert">{errors.phone.message}</span>}
                    </div>
                </div>
                <div className="sm:col-span-3">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                        Password
                    </label>
                    <div className="mt-2">
                        <input
                            id="password"
                            type="password"
                            placeholder="Type password here....."
                            className="input input-bordered w-full form-fix"
                            {...register("password", {
                                required: "You must specify a password",
                                minLength: {
                                    value: 6,
                                    message: "Password must have at least 6 characters",
                                },
                            })}
                        />
                        {errors.password && <span>{errors.password.message}</span>}
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-900">
                        Confirm Password
                    </label>
                    <div className="mt-2">
                        <input
                            id="confirm-password"
                            type="password"
                            placeholder="Re-type password here....."
                            className="input input-bordered w-full form-fix"
                            {...register("confirmPassword", {
                                validate: (value) => value === password.current || "Passwords do not match",
                            })}
                        />
                        {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
                    </div>
                </div>
                <div className="sm:col-span-3">
                    <button type="submit" className="btn btn-primary w-full">
                        {loading && <span className="loading loading-spinner"></span>}
                        {loading ? "Loading" : "Submit"}
                    </button>
                </div>
            </div>
            {error && (
                <Alert type="alert" delay={5000} onClose={() => setError(false)}>
                    <p>{errorMessage}</p>
                </Alert>
            )}
        </form>
    );
}
