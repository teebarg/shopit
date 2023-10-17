import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const GET = async (path: string) => {
    // @ts-expect-error
    const session: any = await getServerSession(authOptions);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}${path}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
    });

    // if (res.status === 403) {
    //     try {
    //         const temp = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signout?callbackUrl=/api/auth/session`, {
    //             method: "POST",
    //             headers: {,
    //                 "Content-Type": "application/x-www-form-urlencoded",
    //             },
    //             // @ts-ignore
    //             body: new URLSearchParams({
    //                 csrfToken: await fetch(`${process.env.NEXTAUTH_URL}/api/auth/csrf`).then((rs) => rs.text()),
    //                 callbackUrl: "/",
    //                 json: true,
    //             }),
    //         });

    //         const data = await temp.json();
    //         console.log(data);

    //     } catch (error) {
    //         console.log(error);
    //     }
    //     return null;
    // }

    if (!res.ok) {
        return null;
    }

    return res.json();
};

export { GET };
