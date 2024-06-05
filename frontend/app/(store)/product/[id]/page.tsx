"use client";

import { CheckIcon, QuestionMarkCircleIcon, StarIcon } from "@heroicons/react/20/solid";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import cn from "classnames";
import { imgSrc, currency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@nextui-org/react";

const product = {
    name: "Everyday Ruck Snack",
    price: 22000,
    description:
        "Don't compromise on snack-carrying capacity with this lightweight and spacious bag. The drawstring top keeps all your favorite chips, crisps, fries, biscuits, crackers, and cookies secure.",
    imageSrc: "featured-product.jpeg",
    imageAlt: "Model wearing light green backpack with black canvas straps and front zipper pouch.",
    breadcrumbs: [
        { id: 1, name: "Travel", href: "#" },
        { id: 2, name: "Bags", href: "#" },
    ],
    sizes: [
        { name: "18L", description: "Perfect for a reasonable amount of snacks." },
        { name: "20L", description: "Enough room for a serious amount of snacks." },
    ],
};
const reviews = { average: 4, totalCount: 1624 };

export default function Product() {
    return (
        <div>
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 bg-content1 mt-4">
                {/* Product details */}
                <div className="lg:max-w-lg lg:self-end">
                    <nav aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            {product.breadcrumbs.map((breadcrumb, breadcrumbIdx) => (
                                <li key={breadcrumb.id}>
                                    <div className="flex items-center text-sm">
                                        <Link href={breadcrumb.href} className="font-medium">
                                            {breadcrumb.name}
                                        </Link>
                                        {breadcrumbIdx !== product.breadcrumbs.length - 1 ? (
                                            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="ml-2 h-5 w-5 flex-shrink-0">
                                                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                            </svg>
                                        ) : null}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    <div className="mt-4">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
                    </div>

                    <section aria-labelledby="information-heading" className="mt-4">
                        <h2 id="information-heading" className="sr-only">
                            Product information
                        </h2>

                        <div className="flex items-center">
                            <p className="text-lg sm:text-xl">{currency(product.price)}</p>

                            <div className="ml-4 border-l border-gray-300 pl-4">
                                <h2 className="sr-only">Reviews</h2>
                                <div className="flex items-center">
                                    <div>
                                        <div className="flex items-center">
                                            {[0, 1, 2, 3, 4].map((rating) => (
                                                <StarIcon
                                                    key={rating}
                                                    className={cn(
                                                        reviews.average > rating ? "text-yellow-400" : "text-gray-300",
                                                        "h-5 w-5 flex-shrink-0"
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            ))}
                                        </div>
                                        <p className="sr-only">{reviews.average} out of 5 stars</p>
                                    </div>
                                    <p className="ml-2 text-sm">{reviews.totalCount} reviews</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-6">
                            <p className="text-base">{product.description}</p>
                        </div>

                        <div className="mt-6 flex items-center">
                            <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
                            <p className="ml-2 text-sm">In stock and ready to ship</p>
                        </div>
                    </section>
                </div>

                {/* Product image */}
                <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
                    <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg relative min-h-[400px] bg-red-500">
                        <Image src={imgSrc(product.imageSrc)} alt={product.imageAlt} fill className="h-full w-full" />
                    </div>
                </div>

                {/* Product form */}
                <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
                    <section aria-labelledby="options-heading">
                        <h2 id="options-heading" className="sr-only">
                            Product options
                        </h2>
                        <form>
                            <div>
                                <p>Size</p>
                                <div className="flex gap-4">
                                    {product.sizes.map((size) => (
                                        <div
                                            key={size.name}
                                            className="relative block cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none"
                                        >
                                            {size.name}
                                            {size.description}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link href="/" className="group inline-flex text-sm">
                                    <span>What size should I buy?</span>
                                    <QuestionMarkCircleIcon
                                        className="ml-2 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                </Link>
                            </div>
                            <div className="mt-10">
                                <Button type="submit" color="primary" variant="bordered" className="w-full">
                                    Add to bag
                                </Button>
                            </div>
                            <div className="mt-6 text-center">
                                <Link href="/" className="group inline-flex text-base font-medium">
                                    <ShieldCheckIcon
                                        className="mr-2 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                    <span className="text-gray-500 hover:text-gray-700">Lifetime Guarantee</span>
                                </Link>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
