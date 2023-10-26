import React from "react";
import ProductItem from "@/components/marketplace/ProductItem";
import { sleep } from "@/lib/utils";

const raw = [
    {
        id: 1,
        name: "Basic Tee",
        href: "#",
        imageSrc: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
        imageAlt: "Front of men's Basic Tee in black.",
        price: "$35",
        color: "Black",
    },
    {
        id: 2,
        name: "Basic Tee",
        href: "#",
        imageSrc: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
        imageAlt: "Front of men's Basic Tee in black.",
        price: "$35",
        color: "Black",
    },
];

async function getProducts() {
    await sleep(5000);
    return raw;
}

export default async function Latest() {
    const products = await getProducts();
    return (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
                <ProductItem product={product} />
            ))}
        </div>
    );
}
