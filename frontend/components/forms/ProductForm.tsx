"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Alert from "@/components/core/Alert";
import { CheckBoxField, MutiSelectField, TextField } from "@/components/core/Fields";
import { action } from "@/app/actions";
import { Product } from "@/lib/types";
import { Http } from "@/lib/http";
import Button from "@/components/core/Button";
import ImageUpload from "@/components/core/ImageUpload";
import { useSession } from "next-auth/react";
import { imgSrc } from "@/lib/utils";

type Inputs = {
    name: string;
    is_active: boolean;
    tags: { value: string; label: string }[];
    collections: { value: string; label: string }[];
    price: number;
};

export default function ProductForm({
    product = { name: "", is_active: true },
    tags = [],
    collections = [],
    mode = "create",
    onClose,
}: {
    product?: Product;
    tags?: any[];
    collections?: any[];
    mode?: string;
    onClose?: () => void;
}) {
    const { data: session }: any = useSession();

    const [file, setFile] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageLoader, setImageLoader] = useState(false);

    const isCreate = mode === "create";

    const selectedTags = product?.tags?.map((item: any) => ({ value: item.id, label: item.name })) ?? [];
    const selectedCollections = product?.collections?.map((item: any) => ({ value: item.id, label: item.name })) ?? [];

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: {
            name: product.name,
            is_active: product.is_active,
            price: product.price ?? 0,
            collections: selectedCollections,
            tags: selectedTags,
        },
    });
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const tags = data.tags.map((item: any) => item.value);
        const collections = data.collections.map((item: any) => item.value);
        if (loading) {
            return;
        }
        setError(false);
        setErrorMessage("");
        setLoading(true);
        const body = JSON.stringify({ ...data, tags, collections });
        try {
            let res;
            if (isCreate) {
                res = await Http("/products/", "POST", body);
            } else {
                res = await Http(`/products/${product.id}`, "PUT", body);
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
            action("products");
            setSuccess(true);
        } catch (error) {
            console.log(error);
            setErrorMessage("An error occurred, please contact the administrator");
            setLoading(false);
        }
    };

    // const handleFileChange = (file: any) => {
    //     setFile(file);
    // };

    const handleUpload = async () => {
        setImageLoader(true);
        console.log(file);
        try {
            const formData = new FormData();
            if (!file) {
                setImageLoader(false);
                return;
            }
            formData.append("file", file);

            await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/products/${product.id}/image`, {
                method: "PATCH",
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${session?.user?.accessToken}`,
                },
                body: formData,
            });

            setImageLoader(false);
            action("products");
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <form className="contents" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                <div className="relative flex-1 px-4 sm:px-6">
                    <div className="space-y-8 max-w-sm mt-4">
                        {/* Image uploader */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Image</label>
                            {!isCreate && <ImageUpload onData={setFile} defaultImage={product.image ? imgSrc(product.image) : ""} />}
                            {file && (
                                <Button type="button" click={handleUpload} mode="primary" isLoading={imageLoader} css="mt-1">
                                    Update Image
                                </Button>
                            )}
                        </div>
                        <TextField
                            name="name"
                            label="Product Name"
                            type="text"
                            placeholder="Ex. trending"
                            register={register}
                            error={errors?.name}
                            rules={{ required: true }}
                        />
                        <CheckBoxField name="is_active" label="Status" register={register} />
                        <MutiSelectField name="tags" label="Tags" register={register} options={tags} control={control} />
                        <MutiSelectField name="collections" label="Collections" register={register} options={collections} control={control} />
                        <TextField
                            name="price"
                            label="Product Price"
                            type="number"
                            placeholder="Ex. 2500"
                            register={register}
                            error={errors?.price}
                            rules={{ required: true }}
                        />
                        {error && (
                            <Alert type="alert" delay={5000} onClose={() => setError(false)}>
                                <p>{errorMessage}</p>
                            </Alert>
                        )}
                        {success && (
                            <Alert type="success" delay={5000} onClose={() => setSuccess(false)}>
                                <p>Product {isCreate ? "created" : "updated"} successfully</p>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-shrink-0 justify-end px-4 py-4 space-x-2 border-t border-gray-200">
                <Button mode="white" click={onClose}>
                    Cancel
                </Button>
                <Button type="submit" mode="primary" isLoading={loading}>
                    {isCreate ? "Submit" : "Update"}
                </Button>
            </div>
        </form>
    );
}
