"use client";

import { GET, Http } from "@/lib/http";
import { Collection, TableProps, Tag } from "@/lib/types";
import NextTable from "@/components/core/NextTable";
import React, { useCallback, useRef, useState, useTransition, useEffect } from "react";
import { Avatar, Badge, Chip, Tooltip } from "@nextui-org/react";
import { EditIcon, DeleteIcon } from "@/components/icons";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import NextModal from "@/components/core/Modal";
import SlideOut from "@/components/core/SlideOut";
import { action } from "@/app/actions";
import { Product } from "@/lib/types";
import ProductForm from "@/components/forms/ProductForm";
import { currency, imgSrc } from "@/lib/utils";

interface ChildComponentHandles {
    onOpen: () => void;
    onClose: () => void;
}

export default function TableRow({
    products = [],
    pagination,
    query,
}: {
    products: TableProps["rows"];
    pagination: TableProps["pagination"];
    query: string;
}) {
    const modalRef = useRef<ChildComponentHandles>(null);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [product, setProduct] = useState<Product>();
    const [mode, setMode] = useState<"create" | "update">("create");
    const [tags, setTags] = useState([]);
    const [collections, setCollections] = useState({} as Collection);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selected, setSeleted] = useState<string | number>(0);
    const [isPending, startTransition] = useTransition();

    const columns = [
        { name: "Picture", uid: "picture" },
        { name: "NAME", uid: "name", sortable: true },
        { name: "Price", uid: "price" },
        { name: "Tags", uid: "tags" },
        { name: "Collections", uid: "collections" },
        // { name: "CREATED_AT", uid: "create" },
        // { name: "LAST UPDATED", uid: "update" },
        { name: "ACTIONS", uid: "actions" },
    ];

    useEffect(() => {
        const fetchData = async (url: string, setDataCallback: any) => {
            try {
                const { ok, data } = await GET(url);

                if (!ok) {
                    setDataCallback([]);
                    return;
                }

                const transformedData =
                    setDataCallback === setTags
                        ? data.tags.map((tag: any) => ({ id: tag.id, value: tag.id, label: tag.name }))
                        : data.collections.map((collection: any) => ({ value: collection.id, label: collection.name }));

                setDataCallback(transformedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        // Fetch both tags and collections data
        Promise.all([fetchData("/tags/?page=1&per_page=100", setTags), fetchData("/collections/?page=1&per_page=100", setCollections)]);
    }, []);

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
            await Http(`/products/${selected}`, "DELETE", {});
            await action("products");
            if (modalRef.current) {
                modalRef.current.onClose();
            }
        });
    };

    const handleCreate = async () => {
        setShowModal(true);
        setMode("create");
    };

    const handleEdit = async (id: number | undefined) => {
        const product: Product = products.find((item) => item.id === id) as Product;
        if (!product) {
            return;
        }
        setProduct(product);
        setShowModal(true);
        setMode("update");
    };

    const onClose = async () => {
        setShowModal(false);
        setProduct({} as Product);
    };

    const rowRender = (item: any, columnKey: string | number) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "picture":
                return (
                    <Badge content="" color={item.is_active ? "success" : "danger"} shape="circle" placement="bottom-right">
                        <Avatar radius="md" src={imgSrc(item.image ?? "")} />
                    </Badge>
                );
            case "name":
                return <div className="font-bold">{item?.name}</div>;
            case "price":
                return <p>{currency(item?.price ?? 0)}</p>;
            case "tags":
                return (
                    <div className="flex flex-wrap gap-1">
                        {item?.tags?.map((tag: Tag, index: number) => (
                            <Chip key={index} color="secondary" variant="bordered">
                                {tag.name}
                            </Chip>
                        ))}
                    </div>
                );
            case "collections":
                return (
                    <div className="flex flex-wrap gap-1">
                        {item?.collections?.map((collection: Collection, index: number) => (
                            <Chip key={index} color="warning" variant="bordered">
                                {collection.name}
                            </Chip>
                        ))}
                    </div>
                );
            case "create":
                return <time dateTime={item.created_at}>{item.created_at}</time>;
            case "update":
                return <time dateTime={item.updated_at}>{item.updated_at}</time>;
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
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
                rows={products}
                pagination={pagination}
                query={query}
            />
            <NextModal ref={modalRef} onConfirm={handleDelete} isPending={isPending} modalTitle="Delete Product" action="Delete">
                <p>
                    Are you sure you want to delete this product? <br />
                </p>
            </NextModal>
            {showModal && (
                <SlideOut onClose={() => onClose()} title={mode === "create" ? "Create Product" : "Update Product"}>
                    <ProductForm product={product} mode={mode} onClose={() => onClose()} tags={tags} collections={collections} />
                </SlideOut>
            )}
        </>
    );
}
