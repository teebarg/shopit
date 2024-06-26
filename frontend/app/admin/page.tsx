"use client";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ArrowDownCircleIcon, ArrowPathIcon, ArrowUpCircleIcon, EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import cn from "classnames";
import Image from "next/image";
import Tuple from "@/public/tuple.svg";
import Reform from "@/public/reform.svg";
import SavvyCal from "@/public/savvycal.svg";
import Link from "next/link";

type Status = "Paid" | "Withdraw" | "Overdue";

type Days = {
    date: string;
    dateTime: string;
    transactions: Transactions[];
};

type Transactions = {
    id: number;
    invoiceNumber: string;
    href: string;
    amount: string;
    tax?: string;
    status: Status;
    client: string;
    description: string;
    icon: any;
};

type Client = {
    id: number;
    name: string;
    imageUrl: string;
    lastInvoice: {
        date: string;
        dateTime: string;
        amount: string;
        status: Status;
    };
};

const stats = [
    { name: "Revenue", value: "$405,091.00", change: "+4.75%", changeType: "positive" },
    { name: "Overdue invoices", value: "$12,787.00", change: "+54.02%", changeType: "negative" },
    { name: "Outstanding invoices", value: "$245,988.00", change: "-1.39%", changeType: "positive" },
    { name: "Expenses", value: "$30,156.00", change: "+10.18%", changeType: "negative" },
];
const statuses = {
    Paid: "text-green-700 bg-green-50 ring-green-600/20",
    Withdraw: "text-gray-600 bg-gray-50 ring-gray-500/10",
    Overdue: "text-red-700 bg-red-50 ring-red-600/10",
};
const days: Days[] = [
    {
        date: "Today",
        dateTime: "2023-03-22",
        transactions: [
            {
                id: 1,
                invoiceNumber: "00012",
                href: "#",
                amount: "$7,600.00 USD",
                tax: "$500.00",
                status: "Paid",
                client: "Reform",
                description: "Website redesign",
                icon: ArrowUpCircleIcon,
            },
            {
                id: 2,
                invoiceNumber: "00011",
                href: "#",
                amount: "$10,000.00 USD",
                status: "Withdraw",
                client: "Tom Cook",
                description: "Salary",
                icon: ArrowDownCircleIcon,
            },
            {
                id: 3,
                invoiceNumber: "00009",
                href: "#",
                amount: "$2,000.00 USD",
                tax: "$130.00",
                status: "Overdue",
                client: "Tuple",
                description: "Logo design",
                icon: ArrowPathIcon,
            },
        ],
    },
    {
        date: "Yesterday",
        dateTime: "2023-03-21",
        transactions: [
            {
                id: 4,
                invoiceNumber: "00010",
                href: "#",
                amount: "$14,000.00 USD",
                tax: "$900.00",
                status: "Paid",
                client: "SavvyCal",
                description: "Website redesign",
                icon: ArrowUpCircleIcon,
            },
        ],
    },
];
const clients: Client[] = [
    {
        id: 1,
        name: "Tuple",
        imageUrl: Tuple,
        lastInvoice: { date: "December 13, 2022", dateTime: "2022-12-13", amount: "$2,000.00", status: "Overdue" },
    },
    {
        id: 2,
        name: "SavvyCal",
        imageUrl: SavvyCal,
        lastInvoice: { date: "January 22, 2023", dateTime: "2023-01-22", amount: "$14,000.00", status: "Paid" },
    },
    {
        id: 3,
        name: "Reform",
        imageUrl: Reform,
        lastInvoice: { date: "January 23, 2023", dateTime: "2023-01-23", amount: "$7,600.00", status: "Paid" },
    },
];

export default function Admin() {
    return (
        <>
            <main>
                <div className="relative isolate overflow-hidden bg-content1 mt-4">
                    {/* Stats */}
                    <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
                        <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
                            {stats.map((stat, statIdx) => (
                                <div
                                    key={stat.name}
                                    className={cn(
                                        statIdx % 2 === 1 ? "sm:border-l" : statIdx === 2 ? "lg:border-l" : "",
                                        "flex items-baseline flex-wrap justify-between gap-y-2 gap-x-4 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8"
                                    )}
                                >
                                    <dt className="text-sm font-medium leading-6">{stat.name}</dt>
                                    <dd
                                        className={cn(
                                            stat.changeType === "negative" ? "text-rose-600" : "text-content4-foreground",
                                            "text-xs font-medium"
                                        )}
                                    >
                                        {stat.change}
                                    </dd>
                                    <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight">{stat.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div
                        className="absolute left-0 top-full -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl sm:left-1/2 sm:-ml-96 sm:-mt-10 sm:translate-y-0 sm:rotate-0 sm:transform-gpu sm:opacity-50"
                        aria-hidden="true"
                    >
                        <div
                            className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
                            style={{
                                clipPath:
                                    "polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)",
                            }}
                        />
                    </div>
                </div>

                <div className="space-y-16 py-16 xl:space-y-20">
                    {/* Recent activity table */}
                    <div>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <h2 className="mx-auto max-w-2xl font-semibold leading-6 lg:mx-0 lg:max-w-none">Recent activity</h2>
                        </div>
                        <div className="mt-6 overflow-hidden border-t border-default-100 bg-content1">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                                    <table className="w-full text-left">
                                        <thead className="sr-only">
                                            <tr>
                                                <th>Amount</th>
                                                <th className="hidden sm:table-cell">Client</th>
                                                <th>More details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {days.map((day) => (
                                                <Fragment key={day.dateTime}>
                                                    <tr className="text-sm leading-6">
                                                        <th scope="colgroup" colSpan={3} className="relative isolate py-2 font-semibold">
                                                            <time dateTime={day.dateTime}>{day.date}</time>
                                                            <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-default-200 bg-default-100" />
                                                            <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-default-200 bg-default-100" />
                                                        </th>
                                                    </tr>
                                                    {day.transactions.map((transaction: Transactions) => (
                                                        <tr key={transaction.id}>
                                                            <td className="relative py-5 pr-6">
                                                                <div className="flex gap-x-6">
                                                                    <transaction.icon
                                                                        className="hidden h-6 w-5 flex-none text-default-300 sm:block"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <div className="flex-auto">
                                                                        <div className="flex items-start gap-x-3">
                                                                            <div className="text-sm font-medium leading-6">{transaction.amount}</div>
                                                                            <div
                                                                                className={cn(
                                                                                    statuses[transaction.status],
                                                                                    "rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset"
                                                                                )}
                                                                            >
                                                                                {transaction.status}
                                                                            </div>
                                                                        </div>
                                                                        {transaction.tax ? (
                                                                            <div className="mt-1 text-xs leading-5 text-default-500">
                                                                                {transaction.tax} tax
                                                                            </div>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="hidden py-5 pr-6 sm:table-cell">
                                                                <div className="text-sm leading-6">{transaction.client}</div>
                                                                <div className="mt-1 text-xs leading-5 text-default-500">
                                                                    {transaction.description}
                                                                </div>
                                                            </td>
                                                            <td className="py-5 text-right">
                                                                <div className="flex justify-end">
                                                                    <a
                                                                        href={transaction.href}
                                                                        className="text-sm font-medium leading-6 text-primary hover:text-indigo-500"
                                                                    >
                                                                        View<span className="hidden sm:inline"> transaction</span>
                                                                        <span className="sr-only">
                                                                            , invoice #{transaction.invoiceNumber}, {transaction.client}
                                                                        </span>
                                                                    </a>
                                                                </div>
                                                                <div className="mt-1 text-xs leading-5 text-default-500">
                                                                    Invoice <span className="text-foreground">#{transaction.invoiceNumber}</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent client list*/}
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-semibold leading-7">Recent clients</h2>
                            </div>
                            <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8 bg-content1">
                                {clients.map((client: Client) => (
                                    <li key={client.id} className="overflow-hidden rounded-xl border border-default-100">
                                        <div className="flex items-center gap-x-4 border-b border-default-100 bg-default-100 p-6">
                                            <div className="relative h-12 w-12 flex-none rounded-lg object-cover ring-1 ring-gray-900/10 overflow-hidden">
                                                <Image src={client.imageUrl} alt={client.name} fill />
                                            </div>
                                            <div className="text-sm font-medium leading-6">{client.name}</div>
                                            <Menu as="div" className="relative ml-auto">
                                                <Menu.Button className="-m-2.5 block p-2.5">
                                                    <span className="sr-only">Open options</span>
                                                    <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                                                </Menu.Button>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-default-100 py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <Link
                                                                    href="/"
                                                                    className={cn(
                                                                        active ? "bg-default-200" : "",
                                                                        "block px-3 py-1 text-sm leading-6"
                                                                    )}
                                                                >
                                                                    View<span className="sr-only">, {client.name}</span>
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <Link
                                                                    href="/"
                                                                    className={cn(
                                                                        active ? "bg-default-200" : "",
                                                                        "block px-3 py-1 text-sm leading-6"
                                                                    )}
                                                                >
                                                                    Edit<span className="sr-only">, {client.name}</span>
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>
                                        <dl className="-my-3 divide-y divide-default-200 px-6 py-4 text-sm leading-6">
                                            <div className="flex justify-between gap-x-4 py-3">
                                                <dt className="text-default-500">Last invoice</dt>
                                                <dd>
                                                    <time dateTime={client.lastInvoice.dateTime}>{client.lastInvoice.date}</time>
                                                </dd>
                                            </div>
                                            <div className="flex justify-between gap-x-4 py-3">
                                                <dt className="text-default-500">Amount</dt>
                                                <dd className="flex items-start gap-x-2">
                                                    <div className="font-medium">{client.lastInvoice.amount}</div>
                                                    <div
                                                        className={cn(
                                                            statuses[client.lastInvoice.status],
                                                            "rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset"
                                                        )}
                                                    >
                                                        {client.lastInvoice.status}
                                                    </div>
                                                </dd>
                                            </div>
                                        </dl>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
