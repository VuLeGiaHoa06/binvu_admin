"use client";

import { DataTable } from "@/components/custom ui/DataTable";
import Loader from "@/components/custom ui/Loader";
import { columns } from "@/components/products/ProductColumns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Separator } from "@/components/ui/separator";

const Products = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  const [products, setProducts] = useState<ProductType[]>([]);

  const getProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/products", {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("products_GET", error);
      toast.error("Something went wrong. Please try again!");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // console.log("products", products);

  return (
    <div className="p-10 flex flex-col">
      <div className="flex justify-between">
        <h1 className="text-heading2-bold">Products</h1>
        <Button
          className="bg-blue-1 text-white flex gap-4 items-center"
          onClick={() => router.push("/products/new")}
        >
          <span>
            <Plus className=" h-4 w-4" />
          </span>
          <span>Create Product</span>
        </Button>
      </div>
      <Separator className="bg-grey-1 mb-8 mt-4" />
      {isLoading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} data={products} searchKey="title" />
      )}
    </div>
  );
};

export default Products;
