"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Alert from "@/components/core/Alert";
import { CheckBoxField, TextField } from "@/components/core/Fields";
import { action } from "@/app/actions";
import { Tag } from "@/lib/types";
import { Http } from "@/lib/http";
import { Button } from "@nextui-org/react";

type Inputs = {
    name: string;
    is_active: boolean;
};

export default function TagForm({ tag = { name: "", is_active: true }, mode = "create" }: { tag?: Tag; mode?: string }) {
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const isCreate = mode === "create";

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>({ defaultValues: { name: tag.name, is_active: tag.is_active } });
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (loading) {
            return;
        }
        setError(false);
        setErrorMessage("");
        setLoading(true);
        const body = JSON.stringify(data);
        try {
            let res;
            if (isCreate) {
                res = await Http("/tags/", "POST", body);
            } else {
                res = await Http(`/tags/${tag.id}`, "PUT", body);
            }

            const data = await res.json();
            setLoading(false);

            if (!res.ok) {
                setError(true);
                setErrorMessage(data.detail);
                return;
            }
            if (isCreate) {
                reset();
            }
            action("tags");
            setSuccess(true);
        } catch (error) {
            setErrorMessage("An error occurred, please contact the administrator");
            setLoading(false);
        }
    };
    return (
        <form className="space-y-8 max-w-sm mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <TextField
                    name="name"
                    label="Tag Name"
                    type="text"
                    placeholder="Ex. trending"
                    register={register}
                    error={errors?.name}
                    rules={{ required: true }}
                />
            </div>
            <div>
                <CheckBoxField name="is_active" label="Status" register={register} control={control} />
            </div>
            <Button type="submit" color="primary" className="w-full" isLoading={loading}>
                {isCreate ? "Submit" : "Update"}
            </Button>
            {error && (
                <Alert type="alert" delay={5000} onClose={() => setError(false)}>
                    <p>{errorMessage}</p>
                </Alert>
            )}
            {success && (
                <Alert type="success" delay={5000} onClose={() => setSuccess(false)}>
                    <p>Tags {isCreate ? "created" : "updated"} successfully</p>
                </Alert>
            )}
        </form>
    );
}
