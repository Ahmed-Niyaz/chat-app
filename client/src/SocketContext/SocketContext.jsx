import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useRef, useContext, useEffect } from "react";
import { io } from "socket.io-client";


const SocketContext = createContext(null);

export default function SocketProvider({children}){

    const socket = useRef();
    const { userInfo } = useAppStore();

    useEffect(() => {
        if(userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id },
            });

            socket.current.on('connect', () => {
                console.log('Connected to socket server');
            });

            const handleRecieveMessage = (message) => {

                const { selectedChatType, selectedChatData, addMessage } = useAppStore.getState();


                if (selectedChatType !== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
                    console.log('message sent from chat box', message);
                    
                    addMessage(message);
                }
            }
            const handleRecieveChannelMessage = (message) => {

                const { selectedChatType, selectedChatData, addMessage } = useAppStore.getState();


                if (selectedChatType !== undefined && selectedChatData._id === message.channelId) {
                    console.log('channel message sent from chat box', message);
                    
                    addMessage(message);
                }
            }

            socket.current.on('recieveMessage', handleRecieveMessage);
            socket.current.on('receive-channel-message', handleRecieveChannelMessage);


            return () => {
                socket.current.disconnect();
            };
        }
    }, [userInfo])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocketContext = () => {
    return useContext(SocketContext);
}