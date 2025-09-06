"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";

export const columns: ColumnDef<CollectionType>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      // console.log(row);
      return (
        <Link
          href={`/collections/${row.original._id}`}
          className="hover:text-red-1 cursor-pointer"
        >
          {row.original.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => (
      <p className="text-grey-1">{row.original.products.length}</p>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <Delete id={row.original._id} item="collections" />,
  },
];
