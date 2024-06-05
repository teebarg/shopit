"use client";

import TagForm from "@/components/forms/TagForm";
import { Button, Link } from "@nextui-org/react";

export default function CreateTag() {
    return (
        <div>
            <div className="flex justify-between py-8">
                <h2 className="text-xl font-semibold font-display">Create Tag</h2>
                <Button as={Link} href="/admin/tags" showAnchorIcon variant="solid">
                    Go Back
                </Button>
            </div>
            <TagForm />
        </div>
    );
}
