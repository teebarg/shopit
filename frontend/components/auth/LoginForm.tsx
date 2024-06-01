"use client";

import { useState } from "react";
import { SignInResponse, signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import Alert from "@/components/core/Alert";
import { TextField, PasswordField } from "@/components/core/Fields";
import Google from "@/public/google.svg";
import Image from "next/image";
import { Button, Divider } from "@nextui-org/react";

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
                // eslint-disable-next-line no-undef
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
            setErrorMessage("An error occurred, please contact the administrator" + error.message);
            setLoading(false);
        }
    };

    return (
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <TextField
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Ex. email@email.com"
                    register={register}
                    error={errors?.email}
                    rules={{ required: true, email: true }}
                    isClearable
                />
            </div>
            <div>
                <PasswordField
                    name="password"
                    label="Password"
                    register={register}
                    error={errors?.password}
                    rules={{ required: true, minLength: 8 }}
                />
            </div>
            {loading ? (
                <Button color="primary" isLoading size="lg" fullWidth type="submit">
                    Loading
                </Button>
            ) : (
                <Button color="primary" variant="shadow" size="lg" fullWidth type="submit">
                    Submit
                </Button>
            )}
            <Divider className="my-4" />
            <Button
                className="w-full"
                color="primary"
                size="lg"
                variant="flat"
                startContent={<Image src={Google} alt="Google" className="w-6" />}
                onPress={() => signIn("google")}
            >
                Sign in with Google
            </Button>
            {error && (
                <Alert type="alert" delay={5000} onClose={() => setError(false)}>
                    <p>{errorMessage}</p>
                </Alert>
            )}
        </form>
    );
}
