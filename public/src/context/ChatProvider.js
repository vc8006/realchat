import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState();


  const history = useNavigate();

  useEffect(() => {  
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    // console.log(userInfo)

    if (!userInfo) history("/");
  }, [history]);

  return (
    <ChatContext.Provider
      value={{selectedChat,
        setSelectedChat,
        user,
        setUser,
        chats,
        setChats,}}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
