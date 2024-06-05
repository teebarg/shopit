import React from "react";
import Link from "next/link";
import Image from "next/image";
import { imgSrc, currency } from "@/lib/utils";
import { Product } from "@/lib/types";

export default function ProductItem({ product }: { product: Product }) {
    return (
        <div key={product.id} className="group relative">
            <div className="relative aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-red-500 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <Image src={imgSrc(product.image ?? "")} alt={product.name} className="h-full w-full object-cover object-center" fill />
            </div>
            <div className="mt-4 flex justify-between">
                <div>
                    <h3 className="text-sm">
                        <Link href={`/product/${product.id}`}>
                            <span aria-hidden="true" className="absolute inset-0 font-semibold" />
                            {product.name}
                        </Link>
                    </h3>
                </div>
                <p className="text-sm font-medium">{currency(product.price ?? 0)}</p>
            </div>
        </div>
    );
}
