import React, { ReactNode } from "react";

type TableProps = {
    header: string[];
    rows: (string | ReactNode)[][];
};

export default function Table({ header = [], rows = [] }: TableProps) {
    if (header.length === 0 || rows?.length === 0) {
        return null;
    }
    return (
        <div className="overflow-x-auto">
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
    );
}
