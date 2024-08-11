"use client";
import { ReloadIcon, CheckIcon } from "@radix-ui/react-icons";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import FileUploadDropzone from "./fileUploadDropzone";
import { useState } from "react";
import { uploadPdf } from "@/utils/api";
import useStorage from "./../../hooks/useStorage";
import ListItemCard from "@/components/listItemCard";

interface FileDrawerProps {
  userFiles: any[] | null;
  setUserFiles: React.Dispatch<React.SetStateAction<any>>;
  currentFile: any | null;
  setCurrentFile: React.Dispatch<React.SetStateAction<any>>;
}

const FileDrawer: React.FC<FileDrawerProps> = ({
  userFiles,
  setUserFiles,
  currentFile,
  setCurrentFile,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const { getItem } = useStorage();
  const email = getItem("email", "session");
  const [files, setFiles] = useState<File[] | null>([]);
  const handleOnClickUpload = async () => {
    console.log("Upload button clicked");
    setIsLoading(true);
    if (files && files[0]) {
      let response = await uploadPdf(files[0], {
        email,
        filename: files[0].name,
      });
      const fileId: string = response.file_id;
      let temp = userFiles || [];
      temp.push({ name: files[0].name, id: fileId });
      setUserFiles(temp);
      setIsLoading(false);
      setIsUploadSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsDialogOpen(false);
      setCurrentFile({ fileId: fileId, name: files[0].name });

      setFiles([]);
      setIsUploadSuccess(false);
    }
  };

  const handleOnOpenChange = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="h-screen grid grid-rows-[93%_7%]">
      <div>
        <h4 className="bg-[#F1F5F9] pl-4 pb-4 pt-4 mb-4 text-md font-bold border-b">
          Your Files
        </h4>
        <div className="h-96 w-100% rounded-none">
          <div className="">
            {userFiles &&
              userFiles.map((file) => (
                <ListItemCard
                  key={file.id}
                  setCurrentFile={setCurrentFile}
                  currentFile={currentFile}
                  fileName={file.name}
                  fileId={file.id}
                ></ListItemCard>
              ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <Dialog open={isDialogOpen} onOpenChange={handleOnOpenChange}>
          <DialogTrigger asChild={true}>
            <Button>Upload Files</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="p-1">Upload Files</DialogTitle>
              <FileUploadDropzone
                files={files}
                setFiles={setFiles}
              ></FileUploadDropzone>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className={`${isUploadSuccess ? "bg-[#007a2f]" : ""}`}
                disabled={isLoading}
                onClick={handleOnClickUpload}
              >
                <ReloadIcon
                  className={`mr-2 h-4 w-4 animate-spin ${
                    isLoading ? "visible" : "hidden"
                  }`}
                />
                <CheckIcon
                  className={`${isUploadSuccess ? "visible" : "hidden"}`}
                ></CheckIcon>
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FileDrawer;
