import Button from "@/components/core/Button";
import TagForm from "@/components/forms/TagForm";

export default function CreateTag() {
    return (
        <div>
            <div className="flex justify-between">
                <h2 className="text-base font-semibold font-display">Create Tag</h2>
                <Button type="link" href="/admin/tags">
                    Go Back
                </Button>
            </div>
            <TagForm />
        </div>
    );
}
