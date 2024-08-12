import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useRef, useState } from "react";
import useStorage from "@/hooks/useStorage";
import { getNotes, postNotes } from "@/utils/api";
import { useToast } from "@/components/ui/use-toast";
import { MagicWandIcon } from "@radix-ui/react-icons";

function NoteChatTabs() {
  const { toast } = useToast();
  const { setItem, getItem } = useStorage();
  const editor = useCreateBlockNote();
  const email = getItem("email", "session");
  const changeCount = useRef(0);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    let email = getItem("email", "session");

    const grabNotes = async () => {
      let notes: any = await getNotes(email);
      if (notes.content) {
        notes = JSON.parse(notes.content);
      } else {
        notes = [];
      }

      const blocks = editor.document;
      if (blocks.length === 1) {
        console.log(notes);
        editor.insertBlocks(notes, blocks[0].id);
      }
    };

    grabNotes();
  }, []);

  const handleNoteUpdate = async () => {
    const blocks = editor.document;
    // setItem("notes", JSON.stringify(blocks));
    changeCount.current = changeCount.current + 1;
    console.log("Change count:", changeCount.current);
    if (changeCount.current > 10) {
      changeCount.current = 0;
      await postNotes(email, JSON.stringify(blocks));
      console.log("Notes has been posted successfully");
      toast({
        title: "Auto Saved",
        duration: 2000,
        className: "",
      });
    }
  };

  const handleChatActive = () => {
    setShowChat(true);
  };

  const handleNoteActive = () => {
    console.log("Note active");
    setShowChat(false);
  };

  return (
    <>
      <Tabs
        defaultValue="notes"
        className="w-full p-0 rounded-none bg-[#F1F5F9]"
      >
        <TabsList className="grid p-0 w-full grid-cols-2 ">
          <TabsTrigger
            onClick={handleNoteActive}
            className="h-[48px] bg-[#F1F5F9] border-black border-1"
            value="notes"
          >
            Notes
          </TabsTrigger>
          <TabsTrigger
            className="h-[48px] border-black border-1"
            value="chat"
            onClick={handleChatActive}
          >
            <MagicWandIcon className="mr-2"></MagicWandIcon>{" "}
            <span> Ask AI</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent className="h-screen bg-white" value="notes">
          <div className="w-full h-screen rounded-none pt-10">
            <BlockNoteView
            theme="light"
              onChange={handleNoteUpdate}
              className=""
              editor={editor}
            />
          </div>
        </TabsContent>
        <TabsContent value="chat" className="bg-white"></TabsContent>
      </Tabs>
      {console.log(showChat)}
      <iframe
        src={`https://document-reader.streamlit.app?embed=true&email=${email}`}
        className={`w-full h-[96vh] ${showChat ? "" : "hidden"}`}
      ></iframe>
    </>
  );
}

export default NoteChatTabs;
