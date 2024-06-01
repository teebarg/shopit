import React from "react";
import Link from "next/link";

const NoRecords = () => {
    return (
        <div className="flex flex-col items-center justify-center flex-1 bg-gradient-to-br from-indigo-500 to-purple-600">
            <div className="max-w-md mx-auto text-center">
                <svg className="w-20 h-20 mx-auto text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        fillRule="evenodd"
                        d="M5 5a3 3 0 015 0v8.757l3.509-3.51a3 3 0 014.242 4.243L10.74 21.502a3 3 0 01-4.243 0L.485 15.49a3 3 0 114.242-4.243L8.236 14.757V5zm6.775 14.028a1 1 0 011.414 0l6.011 6.011a1 1 0 01-1.414 1.414l-6.011-6.01a1 1 0 010-1.415zM16.47 2.53a1 1 0 011.415 0l6.01 6.01a1 1 0 11-1.415 1.415l-6.01-6.01a1 1 0 010-1.415z"
                        clipRule="evenodd"
                    />
                </svg>
                <h1 className="text-4xl font-bold text-white mt-6">No Records Found</h1>
                <p className="text-gray-200 mt-4">{`Sorry, we couldn't find any records matching your search criteria.`}</p>
                <Link href="/" className="bg-white text-indigo-600 font-semibold py-2 px-4 rounded mt-6 inline-block hover:bg-indigo-50">
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default NoRecords;
