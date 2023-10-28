import React, { useContext, useEffect, useRef, useState } from "react";
import "./Chat.css";
import Conversations from "../utils/conversations/Conversations";
import Message from "../utils/message/Message";
import { GlobalState } from "../../../globalState";
import axios from "axios";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import Avatar from "../utils/conversations/peacedp.png";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arraivalMessage, setArraivalMessage] = useState("");
  const [startChat, setStartChat] = useState(false);
  const [seller, setSeller] = useState(null);
  const socket = useRef();
  const state = useContext(GlobalState);
  const [user] = state.userAPI.user;
  const [chatRooms, setChatRooms] = state.chatAPI.chatRooms;
  const [token] = state.token;
  const scrollRef = useRef();
  const param = useParams();

  useEffect(() => {
    socket.current = io("ws://localhost:5000");
    socket.current.on("getMessage", (data) => {
      setArraivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  // Check if chatRooms is populated
  useEffect(() => {
    console.log(chatRooms);
  }, [chatRooms]);

  useEffect(() => {
    if (currentChat && token) {
      const getMessage = async () => {
        try {
          const res = await axios.get("/chat/" + currentChat._id, {
            headers: {
              Authorization: token,
            },
          });
          console.log(res.data);
          setMessages(res.data.conversation);
        } catch (error) {
          console.log(error);
        }
      };
      getMessage();
    }
  }, [currentChat, token]);

  useEffect(() => {
    if (param.id) {
      const isFriend = conversations.find((conversation) =>
        conversation.members.includes(param.id)
      );

      if (isFriend) {
        setCurrentChat(isFriend);
      } else {
      }
      setStartChat(true);
    }
  }, [conversations, param.id]);

  useEffect(() => {
    arraivalMessage &&
      currentChat?.members.includes(arraivalMessage.sender) &&
      setMessages((prev) => [...prev, arraivalMessage]);
  }, [arraivalMessage, currentChat]);

  useEffect(() => {
    if (user) {
      socket.current.emit("addUser", user._id);
      socket.current.on("getUsers", (users) => {
        // console.log(users);
      });
    }
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChatRoom = (chatRoom) => {
    setCurrentChat(chatRoom);
    const sellerInfo = chatRoom.membersInfo.find(
      (member) => member._id !== user._id
    );
    setSeller(sellerInfo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      message: newMessage,
    };
    const receiverId = currentChat.membersInfo.find(
      (member) => member._id !== user._id
    );
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });
    try {
      const res = await axios.post(
        "/rooms" + currentChat._id + "/message",
        { ...message },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            {chatRooms.length === 0 ? (
              <div>No chat rooms available.</div>
            ) : (
              chatRooms.map((chatRoom) => (
                <div key={chatRoom._id} onClick={() => handleChatRoom(chatRoom)}>
                  <Conversations chatRoom={chatRoom} currentUser={user} />
                </div>
              ))
            )}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            <div className="chatBoxHeader">
              {currentChat ? (
                <div>
                  <img src={Avatar} alt="dp" className="dp" />
                  <span>{seller.name}</span>
                </div>
              ) : (
                ""
              )}
            </div>
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((message, index) => (
                    <Message
                      key={index}
                      message={message}
                      own={message.sender._id === user._id}
                      ref={index === messages.length - 1 ? scrollRef : null}
                    />
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="textInput"
                    placeholder="Type your message here..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button type="submit" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="noConversation">
                <span>Open a chat to start a conversation</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
