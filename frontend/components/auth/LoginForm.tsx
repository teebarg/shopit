"use client";

import { useState } from "react";
import { SignInResponse, signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import Alert from "@/components/core/Alert";
import { TextField } from "@/components/core/Fields";
import Google from "@/public/google.svg";
import Image from "next/image";

type Inputs = {
    email: string;
    password: string;
};

export default function LoginForm() {
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (loading) {
            return;
        }
        setError(false);
        setErrorMessage("");
        setLoading(true);
        const { email, password } = data;
        try {
            const response: SignInResponse | undefined = await signIn("credentials", { redirect: false, email, password });
            if (response?.ok) {
                window.location.href = "/";
                setLoading(false);
                return;
            }

            setError(true);
            if (response?.status === 401) {
                setErrorMessage("Invalid credentials");
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setErrorMessage("An error occurred, please contact the administrator");
            setLoading(false);
        }
    };

    return (
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <TextField
                    name="email"
                    label="Email"
                    type="text"
                    placeholder="Ex. email@email.com"
                    register={register}
                    error={errors?.email}
                    rules={{ required: true }}
                />
            </div>
            <div>
                <TextField
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Type password here....."
                    register={register}
                    error={errors?.password}
                    rules={{ required: true }}
                />
            </div>
            <button type="submit" className="btn btn-primary w-full">
                {loading && <span className="loading loading-spinner"></span>}
                {loading ? "Loading" : "Submit"}
            </button>
            <div className="divider">OR</div>
            <button type="button" className="btn w-full" onClick={() => signIn("google")}>
                <Image src={Google} alt="Google" className="w-8" />
                Sign in with Google
            </button>
            {error && (
                <Alert type="alert" delay={5000} onClose={() => setError(false)}>
                    <p>{errorMessage}</p>
                </Alert>
            )}
        </form>
    );
}
