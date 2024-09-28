import { useAppStore } from "@/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LeftSidebar from "./chat-components/left-sidebar/LeftSidebar";
import RightSidebar from "./chat-components/right-sidebar/RightSidebar";
import ChatBox from "./chat-components/chat-box/ChatBox";

const Chat = () => {
  const navigate = useNavigate();

  const { userInfo, selectedChatData } = useAppStore();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue");
      navigate("/profile");
    }
  }, [userInfo]);

  return (
    <div className="fixed min-h-[100vh] min-w-[100vw] grid place-items-center">
      {loading ? (
        <p className="loading loading-dots loading-lg text-white">Loading...</p>
      ) : (
        <div
          className={`h-[95vh] w-[95%] bg-slate-400 grid ${
            selectedChatData ? "grid-cols-[1fr_2fr_1fr]" : "grid-cols-[1fr_2fr]"
          } rounded-md`}
        >
          <LeftSidebar />
          <ChatBox />
          {selectedChatData && <RightSidebar />}
        </div>
      )}
    </div>
  );
};

export default Chat;

// bg-gradient-to-r from-sky-500 to-indigo-500