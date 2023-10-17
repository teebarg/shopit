import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Image from "next/image";
import { GET } from "@/lib/http";

export const metadata = {
    title: "Profile | Starter Template",
    description: "Shopit profile starter template built with Tailwind CSS and Next.js.",
};

export default async function Profile() {
    const me = await GET("/users/me");
    if (!me) {
        return <div>An error occurred</div>;
    }
    const user = me.user;
    // @ts-expect-error
    const session = await getServerSession(authOptions);
    const image: string = session?.user?.image || "";
    return (
        <div className="px-4 py-2">
            <h2 className="text-base font-semibold leading-7">Personal Information</h2>
            <p className="text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>
            <div className="flex mt-6">
                <div className="h-32 w-32 rounded-lg relative overflow-hidden">
                    <Image src={image || "/avatar.png"} alt="profile" fill/>
                </div>
                <div className="flex-1 ml-6 space-y-4">
                    <div>
                        <p className="text-sm">Firstname:</p>
                        <p className="text-lg font-semibold mt-0">{user.firstname}</p>
                    </div>
                    <div>
                        <p className="text-sm">Lastname:</p>
                        <p className="text-lg font-semibold mt-0">{user.lastname}</p>
                    </div>
                    <div>
                        <p className="text-sm">Email:</p>
                        <p className="text-lg font-semibold mt-0">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
