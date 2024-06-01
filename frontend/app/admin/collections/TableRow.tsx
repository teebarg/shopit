"use client";

import { Http } from "@/lib/http";
import { TableProps } from "@/lib/types";
import NextTable from "@/components/core/NextTable";
import React, { useCallback, useRef, useState, useTransition } from "react";
import { Chip, Tooltip } from "@nextui-org/react";
import { EyeIcon, EditIcon, DeleteIcon } from "@/components/icons";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import NextModal from "@/components/core/Modal";
import SlideOut from "@/components/core/SlideOut";
import CollectionForm from "@/components/forms/CollectionForm";
import { Collection } from "@/lib/types";
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

    const [mode, setMode] = useState<"create" | "update">("create");
    const [collection, setCollection] = useState<Collection>({} as Collection);
    const [showModal, setShowModal] = useState<boolean>(false);
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

    const handleView = () => {
        if (modalRef.current) {
            modalRef.current.onOpen();
        }
    };

    const onDelete = async (id: number) => {
        setSeleted(id);
        if (modalRef.current) {
            modalRef.current.onOpen();
        }
    };

    const handleDelete = () => {
        startTransition(async () => {
            await Http(`/collections/${selected}`, "DELETE", {});
            await action("collections");
            if (modalRef.current) {
                modalRef.current.onClose();
            }
        });
    };

    const handleCreate = async () => {
        setShowModal(true);
        setMode("create");
    };

    const handleEdit = async (id: number) => {
        const collection: Collection = collections.find((item) => item.id == id) as Collection;
        if (!collection) {
            return;
        }
        setCollection(collection);
        setShowModal(true);
        setMode("update");
    };

    const onClose = async () => {
        setShowModal(false);
        setCollection({} as Collection);
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
                        <Tooltip content="Details">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EyeIcon onClick={handleView} />
                            </span>
                        </Tooltip>
                        <Tooltip content="Edit Collection">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EditIcon onClick={() => handleEdit(item.id)} />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete Collection">
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
            <NextModal ref={modalRef} onConfirm={handleDelete} isPending={isPending} modalTitle="Delete Collection" action="Delete">
                <p>
                    Are you sure you want to delete this collection? <br />
                </p>
            </NextModal>
            {showModal && (
                <SlideOut onClose={() => onClose()} title={mode === "create" ? "Create Collection" : "Update Collection"}>
                    <CollectionForm collection={collection} mode={mode} onClose={() => onClose()} />
                </SlideOut>
            )}
        </>
    );
}
