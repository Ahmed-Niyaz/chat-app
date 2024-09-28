import assets from "@/assets/g-assests/assets";
import { useAppStore } from "@/store";
import ChatMessageBar from "./ChatMessageBar";
import RenderMessages from "./RenderMessages";
import ChatBoxHeader from "./ChatBoxHeader";
import EmptyChatBox from "../empty-chatbox/EmptyChatBox";


const ChatBox = () => {
  const { selectedChatData } = useAppStore();

  
  return selectedChatData ? (
    <div className="chat-box h-[95vh] relative bg-[#1c1d25]">
      <ChatBoxHeader />

      <RenderMessages />

      <ChatMessageBar />
    </div>
  ) : (
    <EmptyChatBox />
  );
};

export default ChatBox;
