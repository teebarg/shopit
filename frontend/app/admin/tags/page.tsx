import Table from "@/components/core/Table";
import { GET } from "@/lib/http";
import { Tag } from "@/lib/types";
import cn from "classnames";
import { redirect } from "next/navigation";
import Button from "@/components/core/Button";
import DeleteButton from "@/components/core/DeleteButton";
import Link from "next/link";

export const metadata = {
    title: "Tags | Starter Template",
    description: "Shopit admin starter template built with Tailwind CSS and Next.js.",
};

async function getData() {
    const { ok, status, data } = await GET("/tags/?offset=0&limit=10", "tags");

    if ([401, 403].includes(status)) {
        redirect("/logout");
    }

    if (!ok) {
        throw new Error("Failed to fetch data");
    }

    return data;
}

export default async function Tags() {
    const { tags } = await getData();

    if (tags?.length === 0) {
        return <div className="px-6 py-8 rounded-md">No Tags!</div>;
    }
    const header = ["S/N", "Name", "Status", "Created", "Updated"];
    const rows = tags.map((item: Tag, index: number) => {
        return [
            <div className="" key={index + "g"}>
                <div className="font-bold">{index + 1}.</div>
            </div>,
            <div className="flex items-center space-x-3" key={index + "a"}>
                <div className="font-bold">{item.name}</div>
            </div>,
            <div className="flex items-center justify-end gap-x-2 sm:justify-start" key={index + "b"}>
                <div className={cn(item.is_active ? "text-green-400 bg-green-400/10" : "text-rose-400 bg-rose-400/10", "flex-none rounded-full p-1")}>
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
            </div>,
            <time dateTime={item.created_at} key={index + "c"}>
                {item.created_at}
            </time>,
            <time dateTime={item.updated_at} key={index + "d"}>
                {item.updated_at}
            </time>,
            <div className="flex space-x-2 items-center" key={index + "e"}>
                <Link href={`/admin/tags/${item.id}`} className="text-indigo-600 hover:text-indigo-900">
                    Edit
                </Link>
                <DeleteButton id={item.id} path="tags">
                    Delete
                </DeleteButton>
            </div>,
        ];
    });

    return (
        <div className="py-2">
            <div>
                <div className="flex justify-between">
                    <h2 className="text-base font-semibold font-display">Tags</h2>
                    <Button type="link" mode="primary" href="/admin/tags/create">
                        Create Tag
                    </Button>
                </div>
                <Table header={header} rows={rows}></Table>
            </div>
        </div>
    );
}
