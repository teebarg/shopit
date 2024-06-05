"use client";

import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, HomeIcon, XMarkIcon, UsersIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import cn from "classnames";
import UserDropDown from "@/components/user-menu";
import NextLink from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";
import { Kbd } from "@nextui-org/kbd";
import { Input } from "@nextui-org/input";
import { SearchIcon, NotificationIcon } from "@/components/icons";
import { Badge, Button } from "@nextui-org/react";

const navigation = [
    { name: "Dashboard", path: "/admin", icon: HomeIcon },
    { name: "Users", path: "/admin/users", icon: UsersIcon },
    { name: "Collections", path: "/admin/collections", icon: UsersIcon },
    { name: "Tags", path: "/admin/tags", icon: UsersIcon },
    { name: "Products", path: "/admin/products", icon: UsersIcon },
];

export default function SideBar({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { data: session } = useSession();
    const pathname: string | null = usePathname();

    // Define the active route
    const isActiveRoute = (route: string): boolean => {
        return pathname === route;
    };

    return (
        <div>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative lg:hidden" onClose={setSidebarOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                {/* Sidebar component, swap this element with another sidebar if you like */}
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                                    <p>
                                        ShpIT <span className="">Beta</span>{" "}
                                    </p>
                                    <nav className="flex flex-1 flex-col">
                                        <ul className="flex flex-1 flex-col gap-y-7">
                                            <li>
                                                <ul className="-mx-2 space-y-1">
                                                    {navigation.map((item) => (
                                                        <li key={item.name}>
                                                            <Link
                                                                href={item.path}
                                                                className={cn(
                                                                    isActiveRoute(item.path) ? "bg-primary" : "text-gray-700 hover:bg-base-300",
                                                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                                                )}
                                                            >
                                                                <item.icon
                                                                    className={cn(
                                                                        isActiveRoute(item.path) ? "text-primary-content" : "text-gray-400",
                                                                        "h-6 w-6 shrink-0"
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-default-200 px-6 pb-4">
                    <div className="flex gap-2 h-16 shrink-0 items-center">
                        <Link href={"/"} className="text-3xl font-semibold text-rose-400 flex gap-2 items-baseline">
                            <span>ShpIT</span> <span className="text-xs">Beta</span>
                        </Link>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.path}
                                                className={cn(
                                                    isActiveRoute(item.path)
                                                        ? "bg-pink-400 text-primary-foreground"
                                                        : "text-default-500 hover:bg-base-300",
                                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                                )}
                                            >
                                                <item.icon
                                                    className={cn(
                                                        isActiveRoute(item.path) ? "text-primary-content" : "text-gray-400",
                                                        "h-6 w-6 shrink-0"
                                                    )}
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="lg:pl-72">
                <div className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-x-4 border-b border-default-300 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 bg-background">
                    <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Separator */}
                    <div className="h-6 w-px lg:hidden" aria-hidden="true" />

                    <div className="flex flex-1 gap-x-4 lg:gap-x-6 items-center">
                        <Input
                            aria-label="Search"
                            classNames={{
                                inputWrapper: "bg-default-100",
                                input: "text-sm",
                            }}
                            endContent={
                                <Kbd className="hidden lg:inline-block" keys={["command"]}>
                                    K
                                </Kbd>
                            }
                            labelPlacement="outside"
                            placeholder="Search..."
                            startContent={<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />}
                            type="search"
                        />
                        <div className="flex items-center gap-x-4 lg:gap-x-6 min-w-80">
                            {/* Notification */}
                            <Badge content="99+" shape="circle" color="danger">
                                <Button radius="full" isIconOnly aria-label="more than 99 notifications" variant="light">
                                    <NotificationIcon size={24} />
                                </Button>
                            </Badge>

                            {/* Separator */}
                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                            {/* ThemeSwitch */}
                            <ThemeSwitch />

                            {/* Profile dropdown */}
                            {session ? (
                                <UserDropDown />
                            ) : (
                                <NextLink href="/login" className="text-sm font-semibold leading-6">
                                    Log In <span aria-hidden="true">&rarr;</span>
                                </NextLink>
                            )}
                        </div>
                    </div>
                </div>

                <main>
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
