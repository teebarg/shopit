import { GET } from "@/lib/http";
import { redirect } from "next/navigation";
import React from "react";
import TableRow from "./TableRow";

export const metadata = {
    title: "Users | Starter Template",
    description: "Shopit admin starter template built with Tailwind CSS and Next.js.",
};

async function getData(page: string = "1", per_page: string = "1", name: string = "") {
    const { ok, status, data } = await GET(`/users/?page=${page}&per_page=${per_page}&name=${name}`, "users");

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

export default async function Users({ searchParams }: { searchParams: { page: string; per_page: string; name: string } }) {
    const { users, ...pag } = await getData(searchParams.page, searchParams.per_page, searchParams.name);

    if (users?.length === 0) {
        return <div className="px-6 py-8 rounded-md">No Users!</div>;
    }

    return (
        <div className="py-2">
            <div>
                <h2 className="text-base font-semibold font-display my-4">Users</h2>
                {users.length > 0 && <TableRow rows={users} pagination={pag} query={searchParams.name}></TableRow>}
            </div>
        </div>
    );
}
