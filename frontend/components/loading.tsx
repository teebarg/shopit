export default function Loading() {
    return (
        <div className="items-start bg-white rounded-lg mt-4 animate-pulse">
            <div className="h-40 w-full bg-base-300 rounded-md mb-4"></div>
            <div className="grid grid-cols-2 gap-2">
                <div className="h-10 w-full bg-base-300 rounded-md"></div>
                <div className="h-10 w-full bg-base-300 rounded-md"></div>
            </div>
            <div className="mt-4 h-[700px] w-full bg-base-300 rounded-md"></div>
        </div>
    );
}
