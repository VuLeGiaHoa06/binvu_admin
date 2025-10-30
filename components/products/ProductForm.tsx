"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "../custom ui/ImageUpload";

import React, { useEffect, useState } from "react";
import Delete from "../custom ui/Delete";
import MultiText from "../custom ui/MultiText";
import MultiSelect from "../custom ui/MultiSelect";
import Loader from "../custom ui/Loader";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z
    .string()
    .min(2, { error: "Title must be required at least 2 characters" })
    .max(50),
  description: z.string().min(2).max(500).trim(),
  media: z.array(z.string()),
  category: z.string(),
  collections: z.array(z.string()),
  tags: z.array(z.string()),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  price: z.coerce.number().min(0.1),
  orgPrice: z.coerce.number().min(0.1),
  expense: z.coerce.number().min(0.1),
});

type ProductFormProps = {
  initialData?: ProductType | null;
};

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<CollectionType[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          collections: initialData.collections.map(
            (collection) => collection._id
          ),
        }
      : {
          title: "",
          description: "",
          media: [],
          category: "",
          collections: [],
          tags: [],
          sizes: [],
          colors: [],
          price: 0.1,
          orgPrice: 0.1,
          expense: 0.1,
        },
  });

  const { isValid, isSubmitting } = form.formState;

  const getCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/collections", {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json();
        setCollections(data);
        setLoading(false);
      }
    } catch (error) {
      console.log("collections_GET", error);
      toast.error("SOmething went wrong. Please try again!");
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/products/${initialData._id}`
        : "/api/products";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setLoading(false);
        toast.success(`Product ${initialData ? "updated" : "created"}`);
        router.push("/products");
        router.refresh();

        // window.location.href = "/products";
        // router.push("/products");
      }
    } catch (error) {
      console.log("Products_POST", error);
      toast.error("Something went wrong. Please try again!");
    }
  };

  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="p-10">
      {initialData ? (
        <div className="flex justify-between">
          <h1 className="text-heading2-bold">Update Product</h1>
          <Delete id={initialData._id} item="products"></Delete>
        </div>
      ) : (
        <h1 className="text-heading2-bold">Create Product</h1>
      )}

      <Separator className="bg-grey-1 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Title"
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your message here..."
                    {...field}
                    rows={5}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="media"
            render={({ field }) => {
              // console.log(field);

              return (
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(url) => field.onChange([...field.value, url])}
                      onRemove={(url) =>
                        field.onChange(
                          field.value.filter(
                            (urlToRemove) => url !== urlToRemove
                          )
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="md:grid md:grid-cols-3 gap-x-2 gap-y-1">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orgPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orginal Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Expense"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Category"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Tags"
                      value={field.value}
                      onChange={(tag) => field.onChange([...field.value, tag])}
                      onRemove={(tagToRemove) =>
                        field.onChange(
                          field.value.filter((tag) => tag !== tagToRemove)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="collections"
              render={({ field }) => {
                // console.log("field", field);

                return (
                  <FormItem>
                    <FormLabel>Collections</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Collections"
                        value={field.value}
                        collections={collections}
                        onChange={(_id) =>
                          field.onChange([...field.value, _id])
                        }
                        onRemove={(idToRemove) =>
                          field.onChange(
                            field.value.filter((id) => id !== idToRemove)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="colors"
              render={({ field }) => {
                // console.log(field);

                return (
                  <FormItem>
                    <FormLabel>Colors</FormLabel>
                    <FormControl>
                      <MultiText
                        placeholder="Colors"
                        value={field.value}
                        onChange={(color) =>
                          field.onChange([...field.value, color])
                        }
                        onRemove={(colorToRemove) =>
                          field.onChange(
                            field.value.filter(
                              (color) => color !== colorToRemove
                            )
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => {
                // console.log(field);

                return (
                  <FormItem>
                    <FormLabel>Sizes</FormLabel>
                    <FormControl>
                      <MultiText
                        placeholder="Sizes"
                        value={field.value}
                        onChange={(size) =>
                          field.onChange([...field.value, size])
                        }
                        onRemove={(sizeToRemove) =>
                          field.onChange(
                            field.value.filter((size) => size !== sizeToRemove)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex gap-4">
            <Button
              disabled={!isValid || isSubmitting}
              className="bg-blue-1 text-white"
              type="submit"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <p>{initialData ? "Update" : "Submit"}</p>
              )}
              {/* {initialData ? "Update" : "Submit"} */}
            </Button>
            <Button
              className="bg-blue-1 text-white"
              onClick={() => router.push("/products")}
              type="button"
            >
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
