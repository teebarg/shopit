"use client";

import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type SlideOutProps = {
    onConfirm?: () => void;
    onClose?: () => void;
    isLoading?: boolean;
    title?: string;
    children?: React.ReactNode;
};

export default function SlideOut({ onClose, title = "Confirm", children }: SlideOutProps) {
    const [open] = useState(true);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative !z-30" onClose={() => onClose?.()}>
                <div className="fixed inset-0" />

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-screen flex-col bg-background shadow-xl">
                                        <div className="px-4 sm:px-6 py-6 border-b border-gray-200">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-semibold leading-6">{title}</Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative rounded-md focus:outline-none focus:ring-0"
                                                        onClick={onClose}
                                                    >
                                                        <span className="absolute -inset-2.5"></span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto">{children}</div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
