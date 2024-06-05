export default function LatestLoading() {
    return (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 animate-pulse bg-content1">
            {[1, 2, 3, 4].map((product: number) => (
                <div key={product} className="group relative">
                    <div className="w-full overflow-hidden rounded-md bg-default-400 lg:aspect-none group-hover:opacity-75 lg:h-80"></div>
                    <div className="mt-4 flex justify-between">
                        <div>
                            {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
                            <h3 className="h-4 bg-default-400"></h3>
                            <p className="mt-1 h-4 bg-default-400"></p>
                        </div>
                        <p className="h-4 bg-default-400"></p>
                    </div>
                </div>
            ))}
        </div>
    );
}
