"use client";

import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User } from "@nextui-org/react";
import { useSession, signOut } from "next-auth/react";
import NextLink from "next/link";

export default function UserDropDown() {
    const { data: session } = useSession();
    return (
        <Dropdown placement="bottom-start">
            <DropdownTrigger>
                <User
                    as="button"
                    avatarProps={{
                        isBordered: true,
                        src: session?.user?.image || "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                    }}
                    className="transition-transform"
                    description={session?.user?.email}
                    name={session?.user?.name}
                />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="user" className="h-14 gap-2">
                    <p className="font-bold">Signed in as</p>
                    <p className="font-bold">@{session?.user?.email}</p>
                </DropdownItem>

                <DropdownItem key="admin">
                    <NextLink href="/admin">Admin</NextLink>
                </DropdownItem>
                <DropdownItem key="profile">
                    <NextLink href="/profile">Profile</NextLink>
                </DropdownItem>
                <DropdownItem key="settings">
                    <NextLink href="/admin/settings">Settings</NextLink>
                </DropdownItem>
                <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                <DropdownItem onClick={() => signOut()} key="logout" color="danger">
                    Log Out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
