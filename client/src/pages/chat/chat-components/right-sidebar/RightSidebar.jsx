import { apiClient } from "@/lib/api-client";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTE, SELECTED_USER_INFO_ROUTE } from "@/utils/constants";
import { useEffect, useState } from "react";
import { FaFile } from "react-icons/fa";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const RightSidebar = () => {
  const navigate = useNavigate();
  const {selectedChatData, selectedChatMessages, setIsDownloading, setFileDownloadProgress, setUserInfo } = useAppStore()
  const [fileMessages, setFileMessages] = useState([]);

  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  async function logout() {
    try {
      const response = await apiClient.post(LOGOUT_ROUTE, {}, {withCredentials: true});

      if (response.status === 200) {
        navigate('/auth')
        setUserInfo(null)
      }

    } catch (error) {
      toast.error(response.error.message);
      console.error(error);
    }
  }

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

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;

    return imageRegex.test(filePath);
  };



  useEffect(() => {
    let tempArr = [];
    if (selectedChatMessages.length > 0) {
      selectedChatMessages.map(msg => {
        if (msg.messageType === 'file') {
          tempArr.push(msg.fileUrl);
        }
      })
      setFileMessages(tempArr);
    }
  }, [selectedChatData, selectedChatMessages])

  useEffect(() => {
    if (selectedChatData) {
      const getSelectedUserData = async () => {
        try {
          const response = await apiClient.post(SELECTED_USER_INFO_ROUTE, {id: selectedChatData._id} ,{ withCredentials: true });
    
          if (response.status === 200) {
            // console.log('retrieved userdata', response.data.user)
            setSelectedUserDetails(response.data.user)
          }
          
        } catch (error) {
          console.error(error.response.data);
        } 
      }
      console.log('cooking');
      
      getSelectedUserData()
    }
  }, [selectedChatData])

  // <img className="w-[110px] aspect-square rounded-[50%]" src={selectedChatData?.image ? `${HOST}/${selectedChatData?.image}` : assets.avatar_icon} alt="profile-image" />

  return selectedUserDetails ? (
    <div className="rs text-white bg-[#001030] relative h-[95vh] overflow-y-scroll hide-scrollbar rounded-r-md">
      <div className="rs-profile flex flex-col justify-center items-center text-center max-w-[70%] m-auto pt-6">
        {
          selectedUserDetails?.image 
          ?
          <img className="max-w-[50%] aspect-square rounded-[50%]" src={`${HOST}/${selectedUserDetails?.image}`} alt="profile-image" />
          :
          <div className={`uppercase md:w-28 md:h-28 rounded-full text-2xl border-[1px] flex items-center justify-center ${getColor(selectedUserDetails.color)}`}>
                    { selectedUserDetails.firstName ? (selectedUserDetails.lastName ? (selectedUserDetails.firstName.split('').shift() + selectedUserDetails.lastName.split('').shift() ) : selectedUserDetails.firstName.split('').shift()) : selectedUserDetails.email.split('').shift() }
          </div>
        }
        <h3 className="mt-4 text-xl font-normal flex items-center justify-center gap-1 my-1 mx-0">{`${selectedUserDetails.firstName} ${selectedUserDetails.lastName} `}</h3>
        <p className="text-lg font-light opacity-[80%]">{selectedUserDetails?.bio}</p>
      </div>
      <hr className="bg-[#ffffff50] my-[15px] mx-0" />
      <div className="rs-media py-0 px-5 text-sm">
        <p className="text-center text-lg">{fileMessages.length > 0 ? 'Media' : 'No Media'}</p>
        <div className="max-h-[180px] overflow-y-scroll hide-scrollbar grid grid-cols-[1fr_1fr_1fr_1fr] p-3 mt-2">
          {fileMessages.map((url, index) => {
            return <div key={index} className="">
              {checkIfImage(url) ? (<img key={index} className="max-w-[60px] rounded-md cursor-pointer" src={`${HOST}/${url}`} alt={`${url}`} onClick={() => {setImageURL(url); setShowImage(true)}} />):
            <div>
              <FaFile className="text-5xl cursor-pointer" onClick={() => {setImageURL(url); setShowImage(true)}} />
            </div>}
            </div>
          })}
          {/* <img className="w-[60px] rounded-md cursor-pointer" src={assets.pic1} alt="" />
          <img className="w-[60px] rounded-md cursor-pointer" src={assets.pic2} alt="" />
          <img className="w-[60px] rounded-md cursor-pointer" src={assets.pic3} alt="" />
          <img className="w-[60px] rounded-md cursor-pointer" src={assets.pic4} alt="" />
          <img className="w-[60px] rounded-md cursor-pointer" src={assets.pic1} alt="" />
          <img className="w-[60px] rounded-md cursor-pointer" src={assets.pic2} alt="" /> */}
        </div>
      </div>
      <button className="absolute bottom-[20px] left-[50%] translate-x-[-50%] bg-[#077eff] text-white border-none text-sm font-light py-[10px] px-[65px] rounded-3xl cursor-pointer" onClick={logout}>Logout</button>
      
      
      
      
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
  )
  :
  (
    <div className="rs text-white bg-[#001030] relative h-[95vh] overflow-y-scroll hide-scrollbar">
      <button className="absolute bottom-[20px] left-[50%] translate-x-[-50%] bg-[#077eff] text-white border-none text-sm font-light py-[10px] px-[65px] rounded-3xl cursor-pointer" onClick={logout}>Logout</button>
    </div>
  )

}

export default RightSidebar