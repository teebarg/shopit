import React from "react";
import Link from "next/link";
import Image from "next/image";
import { imgSrc, currency } from "@/lib/utils";
import { Product } from "@/lib/types";

export default function ProductItem({ product }: { product: Product }) {
    return (
        <div key={product.id} className="group relative">
            <div className="relative aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <Image src={imgSrc(product.image)} alt={product.name} className="h-full w-full object-cover object-center" fill />
            </div>
            <div className="mt-4 flex justify-between">
                <div>
                    <h3 className="text-sm text-gray-700">
                        <Link href={`/product/${product.id}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.name}
                        </Link>
                    </h3>
                </div>
                <p className="text-sm font-medium text-gray-900">{currency(product.price)}</p>
            </div>
        </div>
    );
}
