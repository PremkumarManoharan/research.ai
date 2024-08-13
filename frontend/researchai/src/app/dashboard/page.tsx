"use client";
import { useEffect } from "react";
import FileDrawer from "./filedrawer";
import { useState } from "react";
import { getPdfs } from "@/utils/api";
import useStorage from "@/hooks/useStorage";
import PdfViewer from "./pdfViewer";
import NoteChatTabsNoSRR from "./noteChatTabs";
function Page() {
  const [userFiles, setUserFiles] = useState<any[] | null>(null);
  const [currentFile, setCurrentFile] = useState<any | null>(null);
  const { getItem } = useStorage();

  useEffect(() => {
    const email = getItem("email", "session");
    const makeGetCall = async (email: string) => {
      const pdfs = await getPdfs(email);
      setUserFiles(pdfs);
    };

    makeGetCall(email);
  }, []);

  return (
    <>
      <div style={{ flex: "0 0 20%" }} className="border-r border-black ">
        <FileDrawer
          currentFile={currentFile}
          setCurrentFile={setCurrentFile}
          userFiles={userFiles}
          setUserFiles={setUserFiles}
        />
      </div>
      <div style={{ flex: "0 0 50%", backgroundColor: "#ffffff" }}>
        {currentFile?.name && (
          <h4 className="bg-[#F1F5F9] pl-4 pb-4 pt-4 text-md font-bold border-b flex justify-center items-center">
            {currentFile?.name}
          </h4>
        )}
        <PdfViewer currentFile={currentFile}></PdfViewer>
      </div>
      <div
        style={{ flex: "0 0 30%", backgroundColor: "white" }}
        className="border-l border-black"
      >
        <NoteChatTabsNoSRR></NoteChatTabsNoSRR>
      </div>
    </>
  );
}

export default Page;
