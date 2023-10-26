import React from "react";
import SideBar from "@/components/admin/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    return <SideBar>{children}</SideBar>;
}
