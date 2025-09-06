"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Loader from "@/components/custom ui/Loader";
import CollectionForm from "@/components/collections/CollectionForm";

const CollectionDetail = () => {
  const [loading, setLoading] = useState(true);
  const [collectionDetail, setCollectionDetail] =
    useState<CollectionType | null>(null);

  const params = useParams();

  const getDetailCollection = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/collections/${params.collectionId}`, {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json();
        setLoading(false);
        setCollectionDetail(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again");
    }
  };

  useEffect(() => {
    getDetailCollection();
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <div>
      <CollectionForm initialData={collectionDetail} />
    </div>
  );
};

export default CollectionDetail;
