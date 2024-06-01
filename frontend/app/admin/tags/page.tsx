import { GET } from "@/lib/http";
import { redirect } from "next/navigation";
import TableRow from "./TableRow";
import NoData from "@/components/no-data";

export const metadata = {
    title: "Tags | Starter Template",
    description: "Shopit admin starter template built with Tailwind CSS and Next.js.",
};

async function getData(page: string = "1", per_page: string = "10", name: string = "") {
    const { ok, status, data } = await GET(`/tags/?page=${page}&per_page=${per_page}&name=${name}`, "tags");

    if ([401, 403].includes(status)) {
        redirect("/logout");
    }

    if (!ok) {
        throw new Error("Failed to fetch data");
    }

    return data;
}

export default async function Tags({ searchParams }: { searchParams: { page: string; per_page: string; name: string } }) {
    const { tags, ...pag } = await getData(searchParams.page, searchParams.per_page, searchParams.name);

    if (!tags || tags?.length === 0) {
        return <NoData message="No Tags!" />;
    }

    return (
        <div className="py-2">
            <div>
                <h2 className="text-xl font-semibold font-display my-8">Tags</h2>
                <TableRow collections={tags} pagination={pag} query={searchParams.name} />
            </div>
        </div>
    );
}
