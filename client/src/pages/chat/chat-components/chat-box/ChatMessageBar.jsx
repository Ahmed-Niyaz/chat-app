import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES, HOST, UPLOAD_FILE_ROUTE } from "@/utils/constants";
import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "@/SocketContext/SocketContext";
import { apiClient } from "@/lib/api-client";
import EmojiPicker from "emoji-picker-react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";



const ChatMessageBar = () => {
  const fileInputRef = useRef();
  const emojiRef = useRef();

  const socket = useSocketContext();

  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
    selectedChatMessages,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore();

  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  async function handleSendMessage() {
    if (message.length > 0) {
      if (selectedChatType === "contact") {
        socket.emit("sendMessage", {
          sender: userInfo.id,
          recipient: selectedChatData._id,
          content: message,
          messageType: "text",
          fileUrl: undefined,
        });
      } else if (selectedChatType === "channel") {
        socket.emit("send-channel-message", {
          sender: userInfo.id,
          channelId: selectedChatData._id,
          content: message,
          messageType: "text",
          fileUrl: undefined,
        });
      }
      setMessage("");
    }
  }

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();

        formData.append("file", file);
        setIsUploading(true);

        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });

        if (response.status === 200 && response.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              channelId: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          }
        }
      }
      console.log("this is img file", file);
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [emojiRef]);

  useEffect(() => {
    setMessage("");
  }, [selectedChatData]);

  return (
    <div className="h-[10vh] bg-[#001030] flex justify-center items-center px-8 mb-6 gap-1">
      <div className="flex-1 flex bg-[#001030] border-2 border-solid border-white rounded-full items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-full focus:border-none focus:outline-none text-white"
          placeholder="Enter Message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button
          className="text-neutral-500 outline-none focus:border-none focus:outline-none border-none hover:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white hover:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen((prev) => !prev)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
              className="outline-none border-none"
            />
          </div>
        </div>
      </div>
      <button
        className="bg-transparent rounded-full flex items-center justify-center p-5 focus:border-none hover:bg-green-700 focus:outline-none focus:text-white duration-300 transition-all active:bg-transparent"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl text-white" />
      </button>
    </div>
  );
};

export default ChatMessageBar;
