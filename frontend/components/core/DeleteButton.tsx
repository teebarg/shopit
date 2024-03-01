"use client";

import React, { ReactNode, useTransition, useState } from "react";
import { Http } from "@/lib/http";
import { action } from "@/app/actions";
import Confirm from "@/components/core/Confirm";
import Button from "@/components/core/Button";

type BtnProps = {
    path?: string;
    children?: ReactNode;
    id: string | number | undefined;
};

export default function DeleteButton({ path = "/", children, id }: BtnProps) {
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        startTransition(async () => {
            await Http(`/${path}/${id}`, "DELETE", {});
            await action("tags");
            setOpen(false);
        });
    };

    return (
        <>
            <Button mode="danger" click={() => setOpen(true)}>
                {children}
            </Button>
            {open && <Confirm title="Delete User" isLoading={isPending} onConfirm={handleDelete} onClose={() => setOpen(false)} />}
        </>
    );
}
