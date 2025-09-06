"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type DeleteProps = {
  id: string;
  item: string;
};

const Delete: React.FC<DeleteProps> = ({ id, item }) => {
  const [loading, setLoading] = useState(true);

  const itemType = item === "products" ? "products" : "collections";

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/${itemType}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLoading(false);
        toast.success(`${itemType} deleted`);
        window.location.href = `/${itemType}`;
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again!");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="p-2 bg-red-1 text-white">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-1">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {`
            This action cannot be undone. This will permanently delete your
            ${item}`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-1 text-white"
            onClick={() => onDelete(id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;
