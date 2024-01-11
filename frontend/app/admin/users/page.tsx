import Table from "@/components/core/Table";
import { GET } from "@/lib/http";
import { User } from "@/lib/types";
import cn from "classnames";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Users | Starter Template",
    description: "Shopit admin starter template built with Tailwind CSS and Next.js.",
};

async function getData(page: string = "1", per_page: string = "10") {
    const { ok, status, data } = await GET(`/users/?page=${page}&per_page=${per_page}`, "users");

    if ([401, 403].includes(status)) {
        redirect("/logout");
    }

    if (!ok) {
        throw new Error("Failed to fetch data");
    }

    return data;
}

export default async function Users({ searchParams }: { searchParams: { page: string; per_page: string } }) {
    const { users, ...pag } = await getData(searchParams.page, searchParams.per_page);
    const startIndex = (pag.page - 1) * pag.per_page;

    if (users?.length === 0) {
        return <div className="px-6 py-8 rounded-md">No Users!</div>;
    }
    const header = ["S/N", "Name", "Email", "Status", "Date", "Last Updated"];
    const rows = users.map((item: User, index: number) => {
        return [
            <div className="" key={index + "g"}>
                <div className="font-bold">{startIndex + index + 1}.</div>
            </div>,
            <div className="flex items-center space-x-3" key={index + "a"}>
                <div className="font-bold">
                    {item.firstname} {item.lastname}
                </div>
            </div>,
            <div className="flex gap-x-3" key={index + "b"}>
                <div className="font-mono text-sm leading-6 text-gray-400">{item.email}</div>
                {item.is_superuser && (
                    <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
                        admin
                    </span>
                )}
            </div>,
            <div className="flex items-center justify-end gap-x-2 sm:justify-start" key={index + "c"}>
                <div className={cn(item.is_active ? "text-green-400 bg-green-400/10" : "text-rose-400 bg-rose-400/10", "flex-none rounded-full p-1")}>
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
            </div>,
            <time dateTime={item.created_at} key={index + "d"}>
                {item.created_at}
            </time>,
            <time dateTime={item.updated_at} key={index + "d"}>
                {item.updated_at}
            </time>,
            <a href="#" className="text-indigo-600 hover:text-indigo-900" key={index + "e"}>
                Edit
            </a>,
        ];
    });

    return (
        <div className="py-2">
            <div>
                <h2 className="text-base font-semibold font-display">Users</h2>
                <Table header={header} rows={rows} pagination={pag}></Table>
            </div>
        </div>
    );
}
