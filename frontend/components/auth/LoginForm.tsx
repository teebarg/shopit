"use client";

import { useState } from "react";
import { SignInResponse, signIn } from "next-auth/react";
import Alert from "@/components/core/Alert";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (loading) {
            return;
        }
        setError(false);
        setErrorMessage("");
        setLoading(true);
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
        <>
            <div className="space-y-8">
                <div>
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Ex. email@email.com"
                        className="input input-bordered w-full form-fix"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input
                        type="password"
                        placeholder="Type password here....."
                        className="input input-bordered w-full form-fix"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary w-full" onClick={handleSubmit}>
                    {loading && <span className="loading loading-spinner"></span>}
                    {loading ? "Loading" : "Submit"}
                </button>
                <div className="divider">OR</div>
                <button className="btn btn-accent w-full" onClick={() => signIn("google")}>
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm5 7h-4v3h2c1.1 0 2-.9 2-2s-.9-2-2-2a2 2 0 0 0-2 2.45v2.09h3z"
                        />
                    </svg>
                    Sign in with Google
                </button>
            </div>
            {error && (
                <Alert type="alert" delay={5000} onClose={() => setError(false)}>
                    <p>{errorMessage}</p>
                </Alert>
            )}
        </>
    );
}
