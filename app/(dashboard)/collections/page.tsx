"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { columns } from "@/components/collections/CollectionColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Loader from "@/components/custom ui/Loader";

const Collection = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });
      const data = await res.json();
      setCollections(data);
      setLoading(false);
    } catch (err) {
      console.log("[collections_GET]", err);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <div className="p-10 flex flex-col ">
      <div className="flex justify-between">
        <h1 className="text-heading2-bold">Collections</h1>
        <Button
          className="bg-blue-1 text-white flex gap-4 items-center"
          onClick={() => router.push("/collections/new")}
        >
          <span>
            <Plus className=" h-4 w-4" />
          </span>
          <span>Create Collection</span>
        </Button>
      </div>
      <Separator className="bg-grey-1 mb-8 mt-4" />
      {loading ? (
        <Loader />
      ) : (
        <DataTable columns={columns} data={collections} searchKey="title" />
      )}
    </div>
  );
};

export default Collection;

export const dynamic = "force-dynamic";
