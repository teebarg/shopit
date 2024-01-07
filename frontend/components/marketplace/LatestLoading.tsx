export default function LatestLoading() {
    return (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 animate-pulse bg-white">
            {[1, 2, 3, 4].map((product: number) => (
                <div key={product} className="group relative">
                    <div className="w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80"></div>
                    <div className="mt-4 flex justify-between">
                        <div>
                            <h3 className="h-4 bg-gray-400"></h3>
                            <p className="mt-1 h-4 bg-gray-400"></p>
                        </div>
                        <p className="h-4 bg-gray-400"></p>
                    </div>
                </div>
            ))}
        </div>
    );
}
