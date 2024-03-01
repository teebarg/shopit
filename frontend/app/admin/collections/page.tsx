import { GET } from "@/lib/http";
import { redirect } from "next/navigation";
import CollectionsComponent from "./CollectionComponent";

export const metadata = {
    title: "Collections | Starter Template",
    description: "Shopit admin starter template built with Tailwind CSS and Next.js.",
};

async function getData(page: string = "1", per_page: string = "10") {
    const { ok, status, data } = await GET(`/collections/?page=${page}&per_page=${per_page}`, "collections");

    if ([401, 403].includes(status)) {
        redirect("/logout");
    }

    if (!ok) {
        throw new Error("Failed to fetch data");
    }

    return data;
}

export default async function Collections({ searchParams }: { searchParams: { page: string; per_page: string } }) {
    const { collections, ...pag } = await getData(searchParams.page, searchParams.per_page);

    if (!collections || collections?.length === 0) {
        return <div className="px-6 py-8 rounded-md">No Tags!</div>;
    }

    return (
        <div className="">
            <CollectionsComponent collections={collections} pag={pag}></CollectionsComponent>
        </div>
    );
}
