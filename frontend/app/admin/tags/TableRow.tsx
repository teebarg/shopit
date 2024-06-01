"use client";

import { Http } from "@/lib/http";
import { TableProps } from "@/lib/types";
import NextTable from "@/components/core/NextTable";
import React, { useCallback, useRef, useState, useTransition } from "react";
import { Chip, Tooltip } from "@nextui-org/react";
import { EditIcon, DeleteIcon } from "@/components/icons";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import NextModal from "@/components/core/Modal";
import { action } from "@/app/actions";

interface ChildComponentHandles {
    onOpen: () => void;
    onClose: () => void;
}

export default function TableRow({
    collections = [],
    pagination,
    query,
}: {
    collections: TableProps["rows"];
    pagination: TableProps["pagination"];
    query: string;
}) {
    const modalRef = useRef<ChildComponentHandles>(null);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [selected, setSeleted] = useState<string | number>(0);
    const [isPending, startTransition] = useTransition();

    const columns = [
        { name: "NAME", uid: "name", sortable: true },
        { name: "STATUS", uid: "status", sortable: true },
        { name: "LAST UPDATED", uid: "update" },
        { name: "CREATED_AT", uid: "create" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams?.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    const onSearchChange = (value: string) => {
        router.push(pathname + "?" + createQueryString("name", value));
    };

    const onDelete = async (id: number) => {
        setSeleted(id);
        if (modalRef.current) {
            modalRef.current.onOpen();
        }
    };

    const handleDelete = () => {
        startTransition(async () => {
            await Http(`/tags/${selected}`, "DELETE", {});
            await action("tags");
            if (modalRef.current) {
                modalRef.current.onClose();
            }
        });
    };

    const handleCreate = async () => {
        router.push("/admin/tags/create");
    };

    const handleEdit = async (id: number) => {
        router.push(`/admin/tags/${id}`);
    };

    const rowRender = (item: any, columnKey: string | number) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "name":
                return (
                    <div className="flex items-center space-x-3">
                        <div className="font-bold">{item?.name}</div>
                    </div>
                );
            case "status":
                return (
                    <Chip color={item.is_active ? "success" : "warning"} variant="bordered">
                        {item.is_active ? "Active" : "Inactive"}
                    </Chip>
                );
            case "create":
                return <time dateTime={item.created_at}>{item.created_at}</time>;
            case "update":
                return <time dateTime={item.updated_at}>{item.updated_at}</time>;
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Edit Tag">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EditIcon onClick={() => handleEdit(item.id)} />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete Tag">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <DeleteIcon onClick={() => onDelete(item?.id ?? 0)} />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    };

    return (
        <>
            <NextTable
                callbackFunction={rowRender}
                onSearchChange={onSearchChange}
                onAddNew={handleCreate}
                columns={columns}
                rows={collections}
                pagination={pagination}
                query={query}
            />
            <NextModal ref={modalRef} onConfirm={handleDelete} isPending={isPending} modalTitle="Delete Tag" action="Delete">
                <p>
                    Are you sure you want to delete this tag? <br />
                </p>
            </NextModal>
        </>
    );
}
