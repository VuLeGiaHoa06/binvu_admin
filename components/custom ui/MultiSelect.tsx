"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { X } from "lucide-react";

type MultiSelectProps = {
  placeholder: string;
  value: string[];
  collections: CollectionType[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  value,
  onChange,
  onRemove,
  collections,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  let selected: CollectionType[];

  if (value.length === 0) {
    selected = [];
  } else {
    selected = value.map((id) =>
      collections.find((item) => item._id === id)
    ) as CollectionType[];
  }

  const selectables = collections.filter(
    (collection) => !selected.includes(collection)
  );

  return (
    <Command className="overflow-visible bg-white">
      <div className="border rounded-md">
        {selected.map((item) => (
          <Badge className="shadow-md ml-2 mt-2" key={item._id}>
            {item.title}
            <Button
              className="hover:text-red-1 p-0 h-2 ml-2"
              onClick={() => onRemove(item._id)}
            >
              <X />
            </Button>
          </Badge>
        ))}
        <CommandInput
          {...props}
          value={inputValue}
          onValueChange={setInputValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          onBlur={() => setIsOpen(false)}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <CommandGroup className="overflow-y-auto mt-[10px] bg-white border border-gray-200 shadow-md rounded-md p-2">
          {selectables.length === 0 ? (
            <div className="w-full flex justify-center">Empty select</div>
          ) : (
            <div className="flex flex-col gap-3">
              {selectables.map((collection) => (
                <CommandItem
                  className="shadow-md cursor-pointer hover:bg-grey-1 hover:text-white"
                  key={collection._id}
                  onMouseDown={(e) => e.preventDefault()}
                  onSelect={() => {
                    onChange(collection._id);
                    setInputValue("");
                  }}
                >
                  {collection.title}
                </CommandItem>
              ))}
            </div>
          )}
        </CommandGroup>
      )}
    </Command>
  );
};

export default MultiSelect;
