import { useState } from "react";
import { TrashIcon, CircleBackslashIcon } from "@radix-ui/react-icons";
import { deleteFile } from "@/utils/api";
import { useToast } from "@/components/ui/use-toast";

interface ListItemCardProps {
  fileName: string;
  fileId: string;
  currentFile: any;
  setCurrentFile: React.Dispatch<React.SetStateAction<any>>;
  userFiles: any[] | null;
  setUserFiles: React.Dispatch<React.SetStateAction<any>>;
}

const ListItemCard: React.FC<ListItemCardProps> = ({
  fileId,
  fileName,
  currentFile,
  setCurrentFile,
  userFiles,
  setUserFiles,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  function handleOpenOnClick() {
    setCurrentFile({ fileId, name: fileName });
    console.log(currentFile, fileId);
  }

  async function handleFileDelete(event: React.MouseEvent<SVGSVGElement>) {
    console.log("Delete file with id: ", fileId);
    setIsDeleting(true);
    event.stopPropagation();
    if (fileId === currentFile?.fileId) {
      setCurrentFile(null);
    }
    await deleteFile(fileId);
    setIsDeleting(false);
    setUserFiles(userFiles?.filter((file) => file.id !== fileId));
    toast({
      title: "😃 Successfully deleted!",
      duration: 2000,
      className: "",
    });
  }
  return (
    <div
      onClick={handleOpenOnClick}
      style={{ color: fileId === currentFile?.fileId ? "white" : "black" }}
      className={`${
        fileId === currentFile?.fileId
          ? "bg-black"
          : "hover:bg-gray-300 hover:shadow-md"
      } flex justify-between items-center rounded-none pl-4 pr-2 pb-1 pt-1 transition duration-200 ease-in-out`}
    >
      {fileName}
      {isDeleting ? (
        <CircleBackslashIcon className="mr-2"></CircleBackslashIcon>
      ) : (
        <TrashIcon
          className="mr-2 hover:text-red-600"
          onClick={handleFileDelete}
        />
      )}
    </div>
  );
};

export default ListItemCard;
