import React from "react";
import ProductItem from "@/components/marketplace/ProductItem";
import { sleep } from "@/lib/utils";
import { GET } from "@/lib/http";
import { Product } from "@/lib/types";

export default async function Trending() {
    let products: Product[] = [];
    try {
        await sleep(4000);
        const { ok, data } = await GET("/products/?tag=trending&per_page=4");
        if (ok) {
            products = data.products;
        } else {
            return <div>Failed to load, Please contact admin</div>;
        }
    } catch (error) {
        return <div>Failed to load</div>;
    }
    if (products.length === 0) {
        return <div className="py-4 rounded-md">No trending products!</div>;
    }
    return (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
                <ProductItem product={product} key={product.id} />
            ))}
        </div>
    );
}
