import React, { useRef, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ImageUpload({ onData, defaultImage = "" }: { onData: any; defaultImage?: string }) {
    const fileInput = useRef<any>(null);
    const [file, setFile] = useState<File>();
    const [preview, setPreview] = useState<any>(defaultImage);
    const [error, setError] = useState("");

    const handleFileChange = (e: any) => {
        setError("");
        const selectedFile = e.target.files[0];

        // Check file size (in kilobytes)
        const maxFileSize = 200;
        if (selectedFile.size > maxFileSize * 1024) {
            setError(`File size exceeds ${maxFileSize} KB`);
            return;
        }

        setFile(selectedFile);
        // Invoke the callback function provided by the parent
        onData(selectedFile);

        // Preview the image
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader?.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleClick = () => {
        fileInput?.current?.click();
    };

    // const handleDrop = (e) => {
    //     e.preventDefault();
    //     setError("");
    //     const selectedFile = e.dataTransfer.files[0];

    //     // Check file size (in kilobytes)
    //     const maxFileSize = 200;
    //     if (selectedFile.size > maxFileSize * 1024) {
    //         setError(`File size exceeds ${maxFileSize} KB`);
    //         return;
    //     }
    //     setFile(selectedFile);
    //     console.log("Handling file drop");
    //     console.log(file);
    //     console.log(selectedFile);
    //     // Invoke the callback function provided by the parent
    //     onData(file);

    //     // Preview the image
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         setPreview(reader?.result);
    //     };
    //     reader.readAsDataURL(selectedFile);
    // }

    const handleCancel = () => {
        setFile(undefined);
        setPreview("");
    };

    return (
        <div>
            <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md relative border-dashed border-2 border-sky-500 min-h-[10rem]">
                {preview && (
                    <button type="button" className="absolute top-3 right-4" onClick={handleCancel}>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                )}
                {preview && <p className="text-xs text-gray-500 mb-1">{file?.name}</p>}
                {preview && <img src={preview} alt="Preview" className="max-w-full max-h-32" />}
                {!preview && (
                    <div className="mt-1 relative">
                        <input ref={fileInput} id="fileInput" type="file" className="hidden" onChange={handleFileChange} />
                        <div className="text-center space-y-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#007bff" viewBox="0 0 24 24" className="h-8 w-8 inline">
                                <path fill="none" d="M0 0h24v24H0z" />
                                <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z" />
                            </svg>
                            <p>
                                Drop your images here or{" "}
                                <span onClick={handleClick} className="link">
                                    browse.
                                </span>
                            </p>
                            <button type="button" onClick={handleClick} className="btn btn-sm btn-primary">
                                Upload
                            </button>
                            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
