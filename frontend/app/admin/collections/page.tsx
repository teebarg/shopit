import { GET } from "@/lib/http";
import { redirect } from "next/navigation";
import NoData from "@/components/no-data";
import TableRow from "./TableRow";

export const metadata = {
    title: "Collections | Starter Template",
    description: "Shopit admin starter template built with Tailwind CSS and Next.js.",
};

async function getData(page: string = "1", per_page: string = "10", name: string = "") {
    const { ok, status, data } = await GET(`/collections/?page=${page}&per_page=${per_page}&name=${name}`, "collections");

    if ([401, 403].includes(status)) {
        redirect("/logout");
    }

    if (!ok) {
        throw new Error("Failed to fetch data");
    }

    return data;
}

export default async function Collections({ searchParams }: { searchParams: { page: string; per_page: string; name: string } }) {
    const { collections, ...pag } = await getData(searchParams.page, searchParams.per_page, searchParams.name);

    if (!collections || collections?.length === 0) {
        return <NoData message="No Collections!" />;
    }

    return (
        <div className="py-2">
            <div>
                <h2 className="text-xl font-semibold font-display my-8">Collections</h2>
                <TableRow collections={collections} pagination={pag} query={searchParams.name} />
            </div>
        </div>
    );
}
