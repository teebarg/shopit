import Table from "@/components/core/Table";
import { GET } from "@/lib/http";
import { User } from "@/lib/types";
import cn from "classnames";

export const metadata = {
    title: "Users | Starter Template",
    description: "Shopit admin starter template built with Tailwind CSS and Next.js.",
};

async function getUsers() {
    const { users } = await GET("/users/?limit=4");
    // throw error if response is not ok
    if (!users) {
        throw new Error("Failed to load");
    }
    return users;
}

export default async function Users() {
    let users: User[] = [];
    try {
        users = (await getUsers()) || [];
    } catch (error) {
        return <div>Failed to load</div>;
    }
    if (users.length === 0) {
        return <div className="px-6 py-8 rounded-md">No Users!</div>;
    }
    const header = ["Name", "Email", "Status", "Date", "Last Updated"];
    const rows = users.map((item: User, index: number) => {
        return [
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
                <Table header={header} rows={rows}></Table>
            </div>
        </div>
    );
}
