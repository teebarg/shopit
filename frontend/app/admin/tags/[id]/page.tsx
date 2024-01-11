import Button from "@/components/core/Button";
import { GET } from "@/lib/http";
import TagForm from "@/components/forms/TagForm";

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
            <div className="flex justify-between">
                <h2 className="text-base font-semibold font-display">Update Tag</h2>
                <Button type="link" href="/admin/tags">
                    Go Back
                </Button>
            </div>
            <TagForm tag={tag} mode="update" />
        </div>
    );
}
