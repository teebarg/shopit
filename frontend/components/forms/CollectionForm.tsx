"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Alert from "@/components/core/Alert";
import { SwitchField, TextField } from "@/components/core/Fields";
import { action } from "@/app/actions";
import { Collection } from "@/lib/types";
import { Http } from "@/lib/http";
import { Button } from "@nextui-org/react";

type Inputs = {
    name: string;
    is_active: boolean;
};

export default function CollectionForm({
    collection = { name: "", is_active: false },
    mode = "create",
    onClose,
}: {
    collection?: Collection;
    mode?: string;
    onClose?: () => void;
}) {
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
    } = useForm<Inputs>({ defaultValues: { name: collection.name, is_active: collection.is_active } });
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
                res = await Http("/collections/", "POST", body);
            } else {
                res = await Http(`/collections/${collection.id}`, "PUT", body);
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
            action("collections");
            setSuccess(true);
        } catch (error) {
            setErrorMessage("An error occurred, please contact the administrator");
            setLoading(false);
        }
    };
    return (
        <form className="contents" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                <div className="relative flex-1 px-4 sm:px-6">
                    <div className="space-y-8 max-w-sm mt-4">
                        <div>
                            <TextField
                                name="name"
                                label="Collection Name"
                                type="text"
                                placeholder="Ex. trending"
                                register={register}
                                error={errors?.name}
                                rules={{ required: true }}
                            />
                        </div>
                        <div>
                            <SwitchField name="is_active" label="Status" register={register} control={control} />
                        </div>
                        {error && (
                            <Alert type="alert" delay={5000} onClose={() => setError(false)}>
                                <p>{errorMessage}</p>
                            </Alert>
                        )}
                        {success && (
                            <Alert type="success" delay={5000} onClose={() => setSuccess(false)}>
                                <p>Collection {isCreate ? "created" : "updated"} successfully</p>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-shrink-0 justify-end px-4 py-4 space-x-2 border-t border-gray-200">
                <Button color="danger" onPress={onClose}>
                    Cancel
                </Button>
                <Button type="submit" color="primary" isLoading={loading}>
                    {isCreate ? "Submit" : "Update"}
                </Button>
            </div>
        </form>
    );
}
