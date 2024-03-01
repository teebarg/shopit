"use client";

import Table from "@/components/core/Table";
import { Http } from "@/lib/http";
import { Collection, Pagination } from "@/lib/types";
import cn from "classnames";
import Button from "@/components/core/Button";
import { useState, useTransition } from "react";
import SlideOut from "@/components/core/SlideOut";
import CollectionForm from "@/components/forms/CollectionForm";
import Confirm from "@/components/core/Confirm";
import { action } from "@/app/actions";

export default function CollectionsComponent({ collections, pag }: { collections: Collection[]; pag: Pagination }) {
    const [collection, setCollection] = useState<Collection>();
    const [selected, setSeleted] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [mode, setMode] = useState("create");
    const [isPending, startTransition] = useTransition();

    const startIndex = (pag.page - 1) * pag.per_page;

    if (collections?.length === 0) {
        return <div className="px-6 py-8 rounded-md">No Collections!</div>;
    }

    const handleEdit = async (id: number | undefined) => {
        const collection: Collection = collections.find((item: Collection) => item.id === id) as Collection;
        if (!collection) {
            return;
        }
        setCollection(collection);
        setShowModal(true);
        setMode("update");
    };

    const handleCreate = async () => {
        setShowModal(true);
        setMode("create");
    };

    const onDelete = async (id: number) => {
        setShowDeleteModal(true);
        setSeleted(id);
    };

    const handleDelete = () => {
        startTransition(async () => {
            await Http(`/collections/${selected}`, "DELETE", {});
            await action("collections");
            setShowDeleteModal(false);
        });
    };

    const onClose = async () => {
        setShowModal(false);
        setCollection({} as Collection);
    };

    const header = ["S/N", "Name", "Status", "Created", "Updated"];
    const rows = collections.map((item: Collection, index: number) => {
        return [
            <div className="" key={index + "g"}>
                <div className="font-bold">{startIndex + index + 1}.</div>
            </div>,
            <div className="flex items-center space-x-3" key={index + "a"}>
                <div className="font-bold">{item.name}</div>
            </div>,
            <div className="flex items-center justify-end gap-x-2 sm:justify-start" key={index + "b"}>
                <div className={cn(item.is_active ? "text-green-400 bg-green-400/10" : "text-rose-400 bg-rose-400/10", "flex-none rounded-full p-1")}>
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
            </div>,
            <time dateTime={item.created_at} key={index + "c"}>
                {item.created_at}
            </time>,
            <time dateTime={item.updated_at} key={index + "d"}>
                {item.updated_at}
            </time>,
            <div className="flex space-x-2 items-center" key={index + "e"}>
                <Button mode="danger" click={() => onDelete(item?.id ?? 0)}>
                    Delete
                </Button>
                <Button mode="primary" click={() => handleEdit(item.id)}>
                    Edit
                </Button>
            </div>,
        ];
    });

    return (
        <div className="pt-6">
            <div>
                <div className="flex justify-between">
                    <h2 className="text-base font-semibold font-display">Collections</h2>
                    <Button mode="primary" click={handleCreate}>
                        Create Collection
                    </Button>
                </div>
                <Table header={header} rows={rows} pagination={pag}></Table>
                {showModal && (
                    <SlideOut onClose={() => onClose()} title={mode === "create" ? "Create Collection" : "Update Collection"}>
                        <CollectionForm collection={collection} mode={mode} onClose={() => onClose()} />
                    </SlideOut>
                )}
                {showDeleteModal && (
                    <Confirm title="Delete Collection" isLoading={isPending} onConfirm={handleDelete} onClose={() => setShowDeleteModal(false)} />
                )}
            </div>
        </div>
    );
}
