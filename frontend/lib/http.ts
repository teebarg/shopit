import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getSession } from "next-auth/react";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const Http = async (url: string, method: Method, body?: any, extra?: Object) => {
    let session: any = null;
    if (typeof window === "undefined") {
        // @ts-expect-error
        session = await getServerSession(authOptions);
    } else {
        session = await getSession();
    }

    return await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + url, {
        method,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        ...extra,
        body,
    });
};

const GET = async (path: string, tag: string = "") => {
    const res = await Http(path, "GET", null, { next: { tags: [tag] } });

    if (!res.ok) {
        return { ok: false, status: res.status, data: null };
    }

    return { ok: true, status: res.status, data: await res.json() };
};

const DELETE = async (path: string) => {
    const res = await Http(path, "DELETE");

    if (!res.ok) {
        return { ok: false, status: res.status, data: null };
    }

    return { ok: true, status: res.status, data: await res.json() };
};

export { Http, GET, DELETE };
