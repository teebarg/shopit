import { GET } from "@/lib/http";
import TagForm from "@/components/forms/TagForm";
import NextLink from "next/link";

async function getData(id: string) {
    const { ok, data } = await GET(`/tags/${id}`, `tag-${id}`);

    if (!ok) {
        throw new Error("Failed to fetch data");
    }

    return data;
}

export default async function UpdateTag({ params }: { params: { id: string } }) {
    const tag = await getData(params.id);
    return (
        <div>
            <div className="flex justify-between py-8">
                <h2 className="text-base font-semibold font-display">Update Tag</h2>
                <NextLink
                    href="/admin/tags"
                    className="tap-highlight-transparent no-underline hover:opacity-80 active:opacity-disabled transition-opacity z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 h-10 text-small gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-default text-default-foreground data-[hover=true]:opacity-hover"
                >
                    Go Back
                </NextLink>
            </div>
            <TagForm tag={tag} mode="update" />
        </div>
    );
}
