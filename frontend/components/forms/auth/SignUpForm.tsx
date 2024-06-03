"use client";

import { useState, useRef } from "react";
import { SignInResponse, signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import Alert from "@/components/core/Alert";
import { TextField, PasswordField } from "@/components/core/Fields";
import { Button } from "@nextui-org/react";

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_DOMAIN}/signup`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                },
                body,
            });
            const data = await res.json();
            setLoading(false);
            setError(true);
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
                // eslint-disable-next-line no-undef
                window.location.href = "/";
                return;
            }
        } catch (error) {
            setErrorMessage("An error occurred, please contact the administrator");
            setLoading(false);
        }
    };
    password.current = watch("password", "");

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <TextField
                        name="firstname"
                        label="First name"
                        type="text"
                        placeholder="Ex. John"
                        autoComplete="first-name"
                        register={register}
                        error={errors?.firstname}
                        rules={{ required: true }}
                    />
                </div>

                <div className="sm:col-span-3">
                    <TextField
                        name="lastname"
                        label="Last name"
                        type="text"
                        placeholder="Ex. Mosh"
                        autoComplete="family-name"
                        register={register}
                        error={errors.lastname}
                        rules={{ required: true }}
                    />
                </div>
                <div className="sm:col-span-3">
                    <TextField
                        name="email"
                        label="Email"
                        type="text"
                        placeholder="Ex. email@email.com"
                        register={register}
                        error={errors.email}
                        rules={{ required: true, email: true }}
                    />
                </div>

                <div className="sm:col-span-3">
                    <TextField
                        name="phone"
                        label="Phone"
                        type="text"
                        placeholder="Ex. 09000000000"
                        register={register}
                        error={errors.phone}
                        rules={{ minLength: 11, maxLength: 11 }}
                    />
                </div>
                <div className="sm:col-span-3">
                    <PasswordField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Type password here....."
                        register={register}
                        error={errors.password}
                        rules={{ required: true, minLength: 6 }}
                    />
                </div>

                <div className="sm:col-span-3">
                    <PasswordField
                        name="confirmPassword"
                        label="Password"
                        type="password"
                        placeholder="Type password here....."
                        register={register}
                        error={errors.confirmPassword}
                        rules={{ confirmPassword: password.current }}
                    />
                </div>
                <div className="sm:col-span-3">
                    {loading ? (
                        <Button color="primary" isLoading size="lg" fullWidth>
                            Loading
                        </Button>
                    ) : (
                        <Button color="primary" variant="shadow" size="lg" fullWidth type="submit">
                            Submit
                        </Button>
                    )}
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
