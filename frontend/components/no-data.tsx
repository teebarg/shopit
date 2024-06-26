import Link from "next/link";

export default function NoData({ message = "No data found" }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
                <svg className="w-20 h-20 mx-auto text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                <h1 className="text-4xl font-bold text-gray-800 mt-6">Oops! {message}</h1>
                <p className="text-gray-600 mt-4">{`No records found or doesn't exist.`}</p>
                <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mt-6 inline-block">
                    Go to Home
                </Link>
            </div>
        </div>
    );
}
