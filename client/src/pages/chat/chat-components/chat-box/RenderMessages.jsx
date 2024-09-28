import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES, HOST } from "@/utils/constants";
import { useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import moment from "moment";

const RenderMessages = () => {
  const scrollRef = useRef();

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

  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;

    return imageRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((100 * loaded) / total);
        setFileDownloadProgress(percentCompleted);
      },
    });

    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    console.log(file);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };

  async function getAllMessages() {
    try {
      const response = await apiClient.post(
        GET_ALL_MESSAGES,
        { id: selectedChatData._id },
        { withCredentials: true }
      );

      if (response.data.messages) {
        setSelectedChatMessages(response.data.messages);
      }
    } catch (error) {
      console.log(
        "failed trying to get all messages from chatbox useEffect",
        error
      );
    }
  }

  useEffect(() => {
    if (selectedChatData?._id) {
      if (selectedChatType === "contact") {
        getAllMessages();
      }
    }
  }, [selectedChatData, selectedChatType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate; // this logic is for if n number of messages are at same date show it for nth message not for all
      lastDate = messageDate;

      return (
        <div
          key={index}
          className={`flex justify-center items-center ${
            showDate ? "flex-col" : null
          }`}
        >
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {/* {selectedChatType === "channel" && renderChannelMessage(message)} */}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => (
    <div
      className={`flex items-end ${
        message.sender === selectedChatData._id
          ? "justify-start "
          : "justify-start flex-row-reverse gap-[6px] "
      } w-full`}
    >
      <div className="text-xs text-gray-600 flex flex-col justify-center items-center gap-1">
        {/* {df} */}

        {/* <Avatar className="h-10 w-10 rounded-full overflow-hidden">
        <AvatarImage
          src={assets.avatar_icon}
          alt="profile"
          className="object-cover w-full h-full bg-black"
        />
      </Avatar> */}

        {message.sender !== selectedChatData._id ? (
          <Avatar className="h-10 w-10 rounded-full overflow-hidden">
            {userInfo?.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-10 w-10 rounded-full text-lg border-[1px] flex items-center justify-center ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift() +
                    userInfo?.lastName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        ) : (
          <Avatar className="h-10 w-10 rounded-full overflow-hidden">
            {selectedChatData?.image ? (
              <AvatarImage
                src={`${HOST}/${selectedChatData.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-10 w-10 rounded-full text-lg border-[1px] flex items-center justify-center ${getColor(
                  userInfo.color
                )}`}
              >
                {selectedChatData.firstName
                  ? selectedChatData.firstName.split("").shift() +
                    selectedChatData?.lastName.split("").shift()
                  : selectedChatData.email.split("").shift()}
              </div>
            )}
          </Avatar>
        )}
        {moment(message.timestamp).format("LT")}
      </div>

      {message.messageType === "text" && (
        <p
          className={`text-white ${
            message.sender !== selectedChatData._id
              ? "bg-green-500 rounded-bl-[8px] "
              : "bg-[blue] rounded-br-[8px]"
          } p-3 max-w-[300px] text-sm mb-10  rounded-tl-[8px] rounded-tr-[8px] `}
        >
          {message.content}
        </p>
      )}

      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
              : "bg-[#2a2b33]/5 text-white/80 border-white/20 "
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words mb-10`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                alt="image"
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // const renderChannelMessage = (message) => {
  //   <div
  //     className={`flex items-end ${
  //       message.sender._id === selectedChatData._id
  //         ? "justify-start "
  //         : "justify-start flex-row-reverse gap-[6px] "
  //     } w-full`}
  //   >
  //     <div className="text-black text-5xl">{message.content}</div>
  //   </div>;
  // };

  //bg-[url('/chat-background-light.png')]
  return (
    <div className="h-[75vh] bg-grey  bg-cover bg-center w-full overflow-y-scroll flex flex-col py-[10px] px-3 gap-3 hide-scrollbar">
      {renderMessages()}
      <div ref={scrollRef} />

      {showImage && (
        <div
          className="fixed z-[1000] top-0 left-0 h-[100vh]
                w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col"
        >
          <div>
            <img
              src={`${HOST}/${imageURL}`}
              alt="oimage"
              className="h-[60vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed bottom-0 mb-[5%]">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageURL)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RenderMessages;
