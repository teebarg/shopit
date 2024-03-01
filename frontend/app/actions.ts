"use server";

import { revalidateTag } from "next/cache";

export async function action(tag: string) {
    revalidateTag(tag);
}
