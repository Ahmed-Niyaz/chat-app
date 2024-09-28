import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";

const ContactsList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
  } = useAppStore();

  function selectContactToChat(contact) {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");

    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  }

  return (
    <div className="">
      {
      contacts.length > 0
      &&
      contacts.map((contact) => {
        return (
          <div
            key={contact._id}
            className={`pl-2 py-2 transition-all duration-300 rounded-xl mb-1 cursor-pointer ${
              selectedChatData && selectedChatData._id === contact._id
              ? "bg-green-400 bg-opacity-30"
              : "hover:bg-[#f1f1f111]"
            }`}
            onClick={() => selectContactToChat(contact)}
          >
            <div className="flex gap-5 justify-start items-center text-neutral-300">
              {!isChannel && (
                <Avatar className={`h-10 w-10 rounded-full overflow-hidden`}>
                  {contact?.image ? (
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt="profile"
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <div
                      className={`${getColor(contact?.color)}} uppercase h-10 w-10 rounded-full text-lg border-[1px] border-${getColor(contact.color)} flex items-center justify-center`}
                    >
                      {contact.firstName
                        ? contact.firstName.split("").shift()
                        : contact.email.split("").shift()}
                    </div>
                  )}
                </Avatar>
              )}
              {isChannel && (
                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                  #
                </div>
              )}
              {isChannel ? <span>{contact.name}</span> : <span>{`${contact.firstName} ${contact?.lastName}`}</span> }
            </div>
          </div>
        );
      })
      }
    </div>
  );
};

export default ContactsList;
