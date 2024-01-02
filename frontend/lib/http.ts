import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const GET = async (path: string) => {
    // @ts-expect-error
    const session: any = await getServerSession(authOptions);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}${path}`, {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
    });

    if (!res.ok) {
        return { ok: false, status: res.status, data: null };
    }

    return { ok: true, status: res.status, data: await res.json() };
};

export { GET };
