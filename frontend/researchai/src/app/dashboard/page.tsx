"use client";
import { useEffect } from "react";
import FileDrawer from "./filedrawer";
import { useState } from "react";
import { getPdfs } from "@/utils/api";
import useStorage from "@/hooks/useStorage";
import PdfViewer from "./pdfViewer";
import NoteChatTabs from "./noteChatTabs";
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
        <PdfViewer currentFile={currentFile}></PdfViewer>
      </div>
      <div
        style={{ flex: "0 0 30%", backgroundColor: "white" }}
        className="border-l border-black"
      >
        <NoteChatTabs></NoteChatTabs>
      </div>
    </>
  );
}

export default Page;
