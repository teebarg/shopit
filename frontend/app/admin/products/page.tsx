import { GET } from "@/lib/http";
import { redirect } from "next/navigation";
import ProductsComponent from "./ProductComponent";

export const metadata = {
    title: "Products | Starter Template",
    description: "Shopit admin starter template built with Tailwind CSS and Next.js.",
};

async function getData(page: string = "1", per_page: string = "10") {
    const { ok, status, data } = await GET(`/products/?page=${page}&per_page=${per_page}`, "products");

    if ([401, 403].includes(status)) {
        redirect("/logout");
    }

    if (!ok) {
        throw new Error("Failed to fetch data");
    }

    return data;
}

export default async function Products({ searchParams }: { searchParams: { page: string; per_page: string } }) {
    const { products, ...pag } = await getData(searchParams.page, searchParams.per_page);

    if (!products || products?.length === 0) {
        return <div className="px-6 py-8 rounded-md">No Products!</div>;
    }

    return (
        <div className="">
            <ProductsComponent products={products} pag={pag}></ProductsComponent>
        </div>
    );
}
