"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Plus } from "lucide-react";
import { X } from "lucide-react";

import { Button } from "../ui/button";
import React from "react";
import Image from "next/image";

type ImageUploadProps = {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
}) => {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-4">
        {value.map((url) => (
          <div key={url} className="w-[200px] h-[150px] relative">
            <Image
              src={url}
              alt="collection"
              className="object-cover rounded-lg"
              fill
            />
            <div
              onClick={() => onRemove(url)}
              className="absolute top-0 right-0 "
            >
              <Button size={"sm"} className="bg-blue-1 text-white p-4">
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <CldUploadWidget uploadPreset="binvu1006" onUpload={onUpload}>
        {({ open }) => {
          return (
            <Button
              type="button"
              onClick={() => open()}
              className="bg-grey-1 text-white flex items-center"
            >
              <Plus className="h-4 w-4" />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </>
  );
};

export default ImageUpload;
