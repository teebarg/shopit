import Table from "@/components/core/Table";

export const metadata = {
    title: "Admin | Starter Template",
    description: "Shopit admin starter template built with Tailwind CSS and Next.js.",
};

type ActivityItem = {
    user: {
        name: string;
        imageUrl: string;
    };
    commit: string;
    branch: string;
    status: "Completed" | "Error";
    duration: string;
    date: string;
    dateTime: string;
};

const activityItems: ActivityItem[] = [
    {
        user: {
            name: "Michael Foster",
            imageUrl: "/img1.png",
        },
        commit: "2d89f0c8",
        branch: "main",
        status: "Completed",
        duration: "25s",
        date: "5 minutes ago",
        dateTime: "2023-01-23T11:00",
    },
    {
        user: {
            name: "Lindsay Walton",
            imageUrl: "/img2.png",
        },
        commit: "249df660",
        branch: "staging",
        status: "Completed",
        duration: "1m 32s",
        date: "32 minutes ago",
        dateTime: "2023-01-23T10:30",
    },
    {
        user: {
            name: "Foo Bar",
            imageUrl: "/img3.png",
        },
        commit: "2d89f0c8",
        branch: "main",
        status: "Error",
        duration: "125s",
        date: "3 hours ago",
        dateTime: "2023-01-23T11:00",
    },
    {
        user: {
            name: "John Luton",
            imageUrl: "/img4.png",
        },
        commit: "4d50f0d4",
        branch: "main",
        status: "Completed",
        duration: "45s",
        date: "1 day ago",
        dateTime: "2023-01-22T08:00",
    },
];

const statuses: { Completed: string; Error: string } = { Completed: "text-green-400 bg-green-400/10", Error: "text-rose-400 bg-rose-400/10" };

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default async function Details() {
    const header = ["Name", "Title", "Status", "Duration", "Deployed at"];
    const rows = activityItems.map((item: ActivityItem) => {
        return [
            <div className="flex items-center space-x-3">
                <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                        <img src={item.user.imageUrl} alt={item.user.name} />
                    </div>
                </div>
                <div>
                    <div className="font-bold">{item.user.name}</div>
                    <div className="text-sm opacity-50">Developer</div>
                </div>
            </div>,
            <div className="flex gap-x-3">
                <div className="font-mono text-sm leading-6 text-gray-400">{item.commit}</div>
                <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
                    {item.branch}
                </span>
            </div>,
            <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                <time className="text-gray-400 sm:hidden" dateTime={item.dateTime}>
                    {item.date}
                </time>
                <div className={classNames(statuses[item?.status], "flex-none rounded-full p-1")}>
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                </div>
                <div className="hidden sm:block">{item.status}</div>
            </div>,
            item.duration,
            <time dateTime={item.dateTime}>{item.date}</time>,
        ];
    });

    return (
        <div className="py-2">
            <div className="">
                <h2 className="px-4 text-base font-semibold leading-7 sm:px-6 lg:px-8">Latest activity</h2>
                <Table header={header} rows={rows}></Table>
            </div>
        </div>
    );
}
