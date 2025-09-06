"use client";

import Loader from "@/components/custom ui/Loader";
import ProductForm from "@/components/products/ProductForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [productDetail, setProductDetail] = useState<ProductType | null>(null);

  const getProductDetail = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/products/${params.productId}`, {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json();
        setProductDetail(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("product_GET", error);
      toast.error("Something went wrong. please try again!");
    }
  };

  useEffect(() => {
    getProductDetail();
  }, []);

  return (
    <>{isLoading ? <Loader /> : <ProductForm initialData={productDetail} />}</>
  );
};

export default ProductDetails;
