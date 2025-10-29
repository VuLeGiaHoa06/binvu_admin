"use client";

import { DataTable } from "@/components/custom ui/DataTable";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { columns } from "@/components/orders/OrderColumns";
import Loader from "@/components/custom ui/Loader";

const Orders = () => {
  const [isLoading, setisLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      setisLoading(true);
      const res = await fetch("/api/orders", {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        setisLoading(false);
      }
    } catch (error) {
      console.log("orders_GET", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="flex flex-col p-10">
      <h1 className="text-heading2-bold">Orders</h1>
      <Separator className="bg-grey-1 mb-8 mt-4" />
      {isLoading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} data={orders} searchKey="_id" />
      )}
    </div>
  );
};

export default Orders;

export const dynamic = "force-dynamic";
