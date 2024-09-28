import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { FaPlus } from "react-icons/fa";
import React, { useState } from "react";
import Lottie from "react-lottie";
import { useAppStore } from "@/store";
import { toast } from "react-toastify";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_ROUTE } from "@/utils/constants";

const NewDmDialog = () => {

  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const { setSelectedChatType, setSelectedChatData, selectedChatData } =
    useAppStore();

  async function searchContacts(searchTerm) {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_ROUTE,
          { searchTerm },
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        } else {
          setSearchedContacts([]);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      toast.error(response.error.message);
      console.error();
    }
  }

  function selectNewContact(contact) {
    console.log("check for contact details", contact);
    setOpenNewContactModal(false);
    console.log('you know this is different', contact);
    
    setSelectedChatData(contact);
    setSelectedChatType("contact");
    setSearchedContacts([]);
  }
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription>Select a contact to message</DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => selectNewContact(contact)}
                  >
                    <div className="w-12 h-12 relative">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {contact.image ? (
                          <AvatarImage
                            src={`${HOST}/${contact.image}`}
                            alt="profile"
                            className="object-cover w-full h-full rounded-full bg-black"
                          />
                        ) : (
                          <div
                            className={`uppercase h-12 w-12 rounded-full text-lg border-[1px] flex items-center justify-center ${getColor(
                              contact.color
                            )}`}
                          >
                            {contact.firstName
                              ? contact.firstName.split("").shift()
                              : contact.email.split("").shift()}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {!searchedContacts.length && (
            <div className="flex-1 md:flex flex-col justify-center items-center mt-5 duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-3xl text-2xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Search New <span className="text-purple-500">Contact.</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDmDialog;
