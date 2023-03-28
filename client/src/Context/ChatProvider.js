

import React, { useEffect, useContext, createContext, useState } from 'react';
const ChatContext = createContext();
const ChatProvider = ({ children }) => {
    const [user, setUser] = useState()
    const [selectedChat, setSelectedChat] = useState();
    const [notification, setNotification] = useState([]);
    const [chats, setChats]= useState()

    
    return (
        <ChatContext.Provider value={{selectedChat,   setSelectedChat,    user,   setUser, notification, setNotification,  chats,   setChats}}>
            {children }
        </ChatContext.Provider>
    )
}
export const ChatState = () => useContext(ChatContext)

export default ChatProvider
// name: "Guest",
//     pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
//         email: "guest@example.com",
//             _id: "640359bca3c7948a1e2eadf5"