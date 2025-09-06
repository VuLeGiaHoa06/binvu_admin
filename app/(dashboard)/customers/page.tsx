"use client";

import { DataTable } from "@/components/custom ui/DataTable";
import { Separator } from "@/components/ui/separator";
import { columns } from "@/components/customers/CustomerColumns";
import { useEffect, useState } from "react";
import Loader from "@/components/custom ui/Loader";

const Customers = () => {
  const [isLoading, setisLoading] = useState(true);

  const [customers, setCustomers] = useState([]);

  const getCustomers = async () => {
    try {
      setisLoading(true);
      const res = await fetch("/api/customers");
      if (res.ok) {
        const customers = await res.json();
        setCustomers(customers);
        setisLoading(false);
      }
    } catch (error) {
      console.log("customer_GET", error);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-10">
      <h1 className="text-heading2-bold">Customers</h1>
      <Separator className="bg-grey-1 mb-8 mt-4" />
      {isLoading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} data={customers} searchKey="name" />
      )}
    </div>
  );
};

export default Customers;
