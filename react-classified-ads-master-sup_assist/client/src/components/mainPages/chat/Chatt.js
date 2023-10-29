import "./chatt.css";
import { useState, useContext, useEffect, useRef } from "react";
import { GlobalState } from "../../../globalState";
import { userChat } from "../../../api/ChatReq";
import Conversations from "../utils/conversations/Conversations";
import ChatBox from "../utils/chatBox/ChatBox";
import { io } from "socket.io-client";

const Chatt = () => {
  const state = useContext(GlobalState);
  const [user] = state.userAPI.user;
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(() => {
    const storedValue = localStorage.getItem("showNewMessageIndicator");
    return storedValue ? JSON.parse(storedValue) : false;
  });
  const socket = useRef();
  const chatContainerRef = useRef();

  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("sendMessage", sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    socket.current = io("/");
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChat(user._id);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user]);

  useEffect(() => {
    socket.current.on("receiveMessage", (data) => {
      console.log("Received message:", data);
      setReceiveMessage(data);
    });
  }, []);

  useEffect(() => {
    if (state.currentChat && receiveMessage && receiveMessage.chatId === state.currentChat._id) {
      setShowNewMessageIndicator(false);
    } else {
      // Check the received message
      const hasNewMessageInCurrentChat = receiveMessage?.chatId === state.currentChat?._id;
      setShowNewMessageIndicator(hasNewMessageInCurrentChat);
    }
  }, [receiveMessage, state.currentChat]);

  useEffect(() => {
    // Store in local storage
    localStorage.setItem("showNewMessageIndicator", JSON.stringify(showNewMessageIndicator));
  }, [showNewMessageIndicator]);

  const handleNewMessageIndicatorClick = () => {
    setShowNewMessageIndicator(false);
  };

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  const scrollToTop = () => {
    chatContainerRef.current.scrollTop = 0;
  };

  return (
    <div className="Chat">
      <div className="Left-side-chat">
        <div className="Chat-container" ref={chatContainerRef}>
          <h2>Chats</h2>
          {showNewMessageIndicator && (
            <div className="new-message-indicator" onClick={handleNewMessageIndicatorClick}>
              New Message!
            </div>
          )}
          <div className="Chat-list">
            {chats.slice().reverse().map((chat) => (
              <div key={chat._id} onClick={() => state.setCurrentChat(chat)}>
                <Conversations data={chat} currentUser={user._id} online={checkOnlineStatus(chat)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="Right-side-chat">
        <ChatBox chat={state.currentChat} currentUser={user._id} setSendMessage={setSendMessage} receiveMessage={receiveMessage} />
      </div>
    </div>
  );
};

export default Chatt;
