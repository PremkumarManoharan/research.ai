import React from "react";
import { CommandItem } from "@/components/ui/command";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ListItemCardProps {
  fileName: string;
  fileId: string;
  currentFile: any;
  setCurrentFile: React.Dispatch<React.SetStateAction<any>>;
}

const ListItemCard: React.FC<ListItemCardProps> = ({
  fileId,
  fileName,
  currentFile,
  setCurrentFile,
}) => {
  function handleOpenOnClick() {
    setCurrentFile({ fileId, name: fileName });
    console.log(currentFile, fileId);
  }
  return (
    <div
      onClick={handleOpenOnClick}
      style={{ color: fileId === currentFile?.fileId ? "white" : "black" }}
      className={`${
        fileId === currentFile?.fileId
          ? "bg-black"
          : "hover:bg-gray-300 hover:shadow-md"
      } rounded-none pl-4 pr-2 pb-1 pt-1 transition duration-200 ease-in-out`}
    >
      {fileName}
    </div>
  );
};

export default ListItemCard;
