"use client";

import Table from "@/components/core/Table";
import { GET, Http } from "@/lib/http";
import { Product, Pagination } from "@/lib/types";
import cn from "classnames";
import Button from "@/components/core/Button";
import { useEffect, useState, useTransition } from "react";
import SlideOut from "@/components/core/SlideOut";
import ProductForm from "@/components/forms/ProductForm";
import Confirm from "@/components/core/Confirm";
import { action } from "@/app/actions";
import { currency, imgSrc } from "@/lib/utils";
import Image from "next/image";

export default function ProductsComponent({ products, pag }: { products: Product[]; pag: Pagination }) {
    const [product, setProduct] = useState<Product>();
    const [selected, setSeleted] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [mode, setMode] = useState("create");
    const [isPending, startTransition] = useTransition();
    const [tags, setTags] = useState([]);
    const [collections, setCollections] = useState([]);

    const startIndex = (pag.page - 1) * pag.per_page;

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

    if (products?.length === 0) {
        return <div className="px-6 py-8 rounded-md">No Products!</div>;
    }

    const handleEdit = async (id: number | undefined) => {
        const product: Product = products.find((item: Product) => item.id === id) as Product;
        if (!product) {
            return;
        }
        setProduct(product);
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
            await Http(`/products/${selected}`, "DELETE", {});
            await action("products");
            setShowDeleteModal(false);
        });
    };

    const onClose = async () => {
        setShowModal(false);
        setProduct({} as Product);
    };

    const header = ["S/N", "Name", "Status", "Price", "Tags", "Collections", "Created"];
    const rows = products.map((item: Product, index: number) => {
        return [
            <div className="" key={index + "g"}>
                <div className="font-bold">{startIndex + index + 1}.</div>
            </div>,
            <div className="flex items-center space-x-3" key={index + "a"}>
                <div className="relative aspect-h-1 aspect-w-1 overflow-hidden bg-gray-800 lg:aspect-none inline-block h-12 w-12 rounded-md p-4 border">
                    <Image src={imgSrc(item.image ?? "")} alt={item.name} className="h-full w-full object-cover object-center" fill />
                </div>
                <div className="font-bold">{item.name}</div>
            </div>,
            <div className="flex items-center justify-end gap-x-2 sm:justify-start" key={index + "b"}>
                <div className={cn(item.is_active ? "text-green-400 bg-green-400/10" : "text-rose-400 bg-rose-400/10", "flex-none rounded-full p-1")}>
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
            </div>,
            <p key={index + "currency"}>{currency(item?.price ?? 0)}</p>,
            <div key={index + "tag"} className="flex flex-wrap">
                {item?.tags?.map((tag, index) => (
                    <span className="badge badge-purple" key={index}>
                        {tag.name}
                    </span>
                ))}
            </div>,
            <div key={index + "badge"} className="flex flex-wrap">
                {item?.collections?.map((collection, index) => (
                    <span className="badge badge-red" key={index}>
                        {collection.name}
                    </span>
                ))}
            </div>,
            <time dateTime={item.created_at} key={index + "c"}>
                {item.created_at}
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
                    <h2 className="text-base font-semibold font-display">Products</h2>
                    <Button mode="primary" click={handleCreate}>
                        Create Product
                    </Button>
                </div>
                <Table header={header} rows={rows} pagination={pag}></Table>
                {showModal && (
                    <SlideOut onClose={() => onClose()} title={mode === "create" ? "Create Product" : "Update Product"}>
                        <ProductForm product={product} mode={mode} onClose={() => onClose()} tags={tags} collections={collections} />
                    </SlideOut>
                )}
                {showDeleteModal && (
                    <Confirm title="Delete Product" isLoading={isPending} onConfirm={handleDelete} onClose={() => setShowDeleteModal(false)} />
                )}
            </div>
        </div>
    );
}
