"use client";
import { ReloadIcon, CheckIcon, FileIcon } from "@radix-ui/react-icons";
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

import FileUploadDropzone from "./fileUploadDropzone";
import { useState } from "react";
import { uploadPdf } from "@/utils/api";
import useStorage from "./../../hooks/useStorage";
import ListItemCard from "@/components/listItemCard";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const { getItem } = useStorage();
  const email = getItem("email", "session");
  const [files, setFiles] = useState<File[] | null>([]);
  const handleOnClickUpload = async () => {
    console.log("Upload button clicked");
    setIsLoading(true);
    if (files && files[0]) {
      let { data, status } = await uploadPdf(files[0], {
        email,
        filename: files[0].name,
      });

      if (status == 500) {
        setIsLoading(false);
        toast({
          title: "❌ Service not available. Try again later",
          duration: 2000,
          className: "",
        });
        return;
      }

      if (status == undefined) {
        setIsLoading(false);
        toast({
          title: "❌ Timed out. Try Smaller files",
          duration: 2000,
          className: "",
        });
        return;
      }

      if (status != 200) {
        setIsLoading(false);
        toast({
          title: "❌ Failed to upload, try again",
          duration: 2000,
          className: "",
        });
        return;
      }
      console.log(data);

      const fileId: string = data.file_id;
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
        <h4 className="bg-[#F1F5F9] pl-4 pb-4 pt-4 text-md font-bold border-b">
          Your File
        </h4>
        <div className="h-96 w-100% rounded-none">
          <div className="">
            {userFiles && userFiles?.length != 0 ? (
              userFiles.map((file) => (
                <ListItemCard
                  key={file.id}
                  setCurrentFile={setCurrentFile}
                  currentFile={currentFile}
                  fileName={file.name}
                  fileId={file.id}
                  userFiles={userFiles}
                  setUserFiles={setUserFiles}
                ></ListItemCard>
              ))
            ) : (
              <div className="mt-[100%] text-slate-500 text-center">
                <FileIcon className="inline mb-1" /> No files uploaded yet
              </div>
            )}
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
              <p className="text-sm italic text-slate-600">
                Only one file at a time (max. 40MB)
              </p>
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
                disabled={isLoading || !files || files?.length == 0}
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
