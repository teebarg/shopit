import React, { ReactNode } from "react";
import Pagination from "@/components/core/Pagination";
import { Pagination as Pag } from "@/lib/types";

type TableProps = {
    header: string[];
    rows: (string | ReactNode)[][];
    pagination: Pag;
};

export default function Table({ header = [], rows = [], pagination }: TableProps) {
    if (header.length === 0 || rows?.length === 0) {
        return null;
    }
    return (
        <div className="overflow-x-auto min-h-[80vh] flex flex-col">
            <div className="flex-1">
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            {header.map((item) => (
                                <th key={item}>{item}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows?.map((row: (string | ReactNode)[], key: number) => (
                            <tr key={key}>
                                <th>
                                    <label>
                                        <input type="checkbox" className="checkbox" />
                                    </label>
                                </th>
                                {row?.map((item: string | ReactNode, index: number) => <td key={index}>{item}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Float div element to the bottom */}
            <div className="mt-auto p-6">
                <Pagination details={pagination} />
            </div>
        </div>
    );
}
