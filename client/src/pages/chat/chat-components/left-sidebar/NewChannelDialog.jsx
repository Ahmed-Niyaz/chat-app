import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import MultipleSelector from "@/components/ui/multipleselect";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTE } from "@/utils/constants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

const NewChannelDialog = () => {

  const [newChannelModal, setNewChannelModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  const { setSelectedChatType, addChannel } =
    useAppStore();

    
    const createChannel = async () => {
        try {
          if(channelName.length > 0 && selectedContacts.length > 0) {
            const response = await apiClient.post(
              CREATE_CHANNEL_ROUTE,
              {
                name: channelName,
                members: selectedContacts.map((contact) => contact.value),
              },
              { withCredentials: true }
            );
    
            if (response.status === 201) {
              setChannelName("");
              setSelectedContacts([]);
              setNewChannelModal(false);
              addChannel(response.data.channel);
            }
          } else {
            if (selectedContacts.length <= 0) {
                toast.error('Please select a contact')
            } else {
                toast.error('Please Enter Channel Name')
              }
          }

        } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
        const getAllContacts = async () => {
          const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {
            withCredentials: true,
          });
          setAllContacts(response.data.contacts);
        };
    
        getAllContacts();
      }, []);

  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setNewChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setChannelName(e.target.value)}
            />
          </div>
          
          <div>
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts}
              placeholder="Search Contacts"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">
                  No results found
                </p>
              }
            />
          </div>
          <div>
            <button
              className="btn w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewChannelDialog;
