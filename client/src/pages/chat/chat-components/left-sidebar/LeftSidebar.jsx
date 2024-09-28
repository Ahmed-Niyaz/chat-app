import assets from "@/assets/g-assests/assets";
import { useNavigate } from "react-router-dom";
import NewDmDialog from "./NewDmDialog";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api-client";
import {
  GET_DM_CONTACTS_ROUTE,
  GET_USER_CHANNEL_ROUTE,
  LOGOUT_ROUTE,
} from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactsList from "./ContactsList";
import { useEffect } from "react";
import NewChannelDialog from "./NewChannelDialog";

const LeftSidebar = () => {
  const navigate = useNavigate();

  const {
    setUserInfo,
    directMessagesContacts,
    setDirectMessagesContacts,
    selectedChatData,
    channels,
    setChannels,
    selectedChatMessages,
  } = useAppStore();

  async function logout() {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUserInfo(null);
        navigate("/auth");
      }
    } catch (error) {
      toast.error(response.error.message);
      console.error(error);
    }
  }

  // useEffect (() => {
  //   async function getContactsForDM() {
  //     const response = await apiClient.get(GET_DM_CONTACTS_ROUTE, { withCredentials: true });

  //     if (response.data.contacts) {
  //       console.log('this is use Effect in leftsidebar for get-dm-contacts, type :- ', typeof response.data.contacts, response.data.contacts);
  //       setDirectMessagesContacts(response.data.contacts);
  //     }
  //   }

  //   getContactsForDM();
  // }, [selectedChatData ])

  useEffect(() => {
    async function getContactsForDM() {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTE, {
        withCredentials: true,
      });

      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts);
      }
    }

    // async function getAllChannels() {
    //   const response = await apiClient.get(GET_USER_CHANNEL_ROUTE, {
    //     withCredentials: true,
    //   });

    //   if (response.data.channels) {
    //     console.log("channel data -> ", response.data.channels);

    //     setChannels(response.data.channels);
    //   }
    // }

    getContactsForDM();
    // getAllChannels();
  }, [selectedChatData, selectedChatMessages]);



  let tempContacts = directMessagesContacts;
  if (selectedChatData) {
    const isSelectedChatDataPresentInContacts = tempContacts.some((c) => c._id === selectedChatData._id);

    if (!isSelectedChatDataPresentInContacts) {
      tempContacts.unshift(selectedChatData);
    }
  }
  
  return (
    <div className="bg-[#001030] text-white h-[95vh] rounded-l-md">
      <div className="px-8 py-6">
        <div className="flex justify-between items-center pb-4">
          <img src={assets.logo} alt="logo" className="max-w-[120px]" />
          <div className="menu relative px-0 py-[10px] group">
            <img
              src={assets.menu_icon}
              alt="menu-icon"
              className="max-h-[20px] opacity-60 cursor-pointer peer "
            />
            {/* { submenu } */}
            <div className="sub-menu hidden absolute top-[100%] right-0 w-[130px] p-[20px] rounded bg-white text-black  group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="border-none h-[1px] bg-[#a4a4a4] my-2 mx-0" />
              <p className="cursor-pointer text-sm" onClick={logout}>
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* {'this is search-bar'} */}
        {/* <div className="bg-[#002670] flex items-center gap-2 px-2 py-2 mt-5 rounded-lg">
          <img
            src={assets.search_icon}
            alt="search-icon"
            className="w-[16px]"
          />
          <input
            onChange={() => {
              console.log("handle this");
            }}
            type="text"
            placeholder="Search here..."
            className="bg-transparent border-none outline-none text-white text-lg w-[100%] placeholder:text-[#c8c8c8]"
          />
        </div> */}

        {/* {'this is for New Direct Message'} */}
        <div className="my-8">
          <div className="flex items-center justify-between">
            <h6 className="uppercase tracking-widest text-neutral-400 font-light text-opacity-90 text-sm">
              Direct Messages
            </h6>
            <NewDmDialog />
          </div>
          <div className="max-h-[50vh] mt-7 overflow-y-auto scrollbar-hidden">
            <ContactsList contacts={tempContacts} />
          </div>
        </div>

        {/* {'this is for New Channel '} */}
        {/* <div className="my-5">
          <div className="flex items-center justify-between">
            <h6 className="uppercase tracking-widest text-neutral-400 font-light text-opacity-90 text-sm">
            Channels
            </h6>
            <NewChannelDialog />
          </div>
          <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
            <ContactsList contacts={channels} isChannel={true}/>  
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LeftSidebar;
