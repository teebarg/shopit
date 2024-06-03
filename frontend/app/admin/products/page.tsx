import { GET } from "@/lib/http";
import { redirect } from "next/navigation";
import TableRow from "./TableRow";
import NoData from "@/components/no-data";

export const metadata = {
    title: "Products | Starter Template",
    description: "Shopit admin starter template built with Tailwind CSS and Next.js.",
};

async function getData(page: string = "1", per_page: string = "10", name: string = "") {
    const { ok, status, data } = await GET(`/products/?page=${page}&per_page=${per_page}&name=${name}`, "products");

    if ([401].includes(status)) {
        redirect("/logout");
    }

    if ([403].includes(status)) {
        redirect("/");
    }

    if (!ok) {
        throw new Error("Failed to fetch data");
    }

    return data;
}

export default async function Products({ searchParams }: { searchParams: { page: string; per_page: string; name: string } }) {
    const { products, ...pag } = await getData(searchParams.page, searchParams.per_page, searchParams.name);

    if (!products || products?.length === 0) {
        return <NoData message="No Products!" />;
    }

    return (
        <div className="py-2">
            <div>
                <h2 className="text-xl font-semibold font-display my-8">Products</h2>
                <TableRow products={products} pagination={pag} query={searchParams.name} />
            </div>
        </div>
    );
}
