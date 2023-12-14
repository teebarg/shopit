import React from "react";
import ProductItem from "@/components/marketplace/ProductItem";
import { sleep } from "@/lib/utils";
import { GET } from "@/lib/http";
import { Product } from "@/lib/types";

async function getProducts() {
    await sleep(4000);
    const { products } = await GET("/products/?tag=6&limit=4");
    // throw error if response is not ok
    if (!products) {
        throw new Error("Failed to load");
    }
    return products;
}

export default async function Trending() {
    let products: Product[] = [];
    try {
        products = (await getProducts()) || [];
    } catch (error) {
        return <div>Failed to load</div>;
    }
    return (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
                <ProductItem product={product} key={product.id} />
            ))}
        </div>
    );
}
