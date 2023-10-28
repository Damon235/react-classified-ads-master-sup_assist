import { addMessage, getMessages, getUser } from "../../../../api/ChatReq";
import "./ChatBox.css";
import { useEffect, useRef, useState } from "react";
import { axios } from "axios";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import Avatar from "../conversations/peacedp.jpg";

const ChatBox = ({ chat, currentUser, setSendMessage, receiveMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const scroll = useRef()

  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  useEffect(() => {
    const chatId = chat?._id;
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chatId);
        console.log(data);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]);

  useEffect(() => {
    if(receiveMessage !== null && receiveMessage.chatId === chat._id ) {
      setMessages([...messages, receiveMessage])
    }
  }, [receiveMessage])

  // const handleChange = (newMessage) => {
  //   setNewMessage(newMessage);
  // };

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      chatId: chat._id,
      message: newMessage,
    };
    console.log(message);

    try {
      const { data } = await addMessage(message);
      setMessages([...messages, data]);
      setNewMessage([""]);
    } catch (error) {
      console.log(error);
    }

    // Send message to socket server
    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({...message, receiverId});
  }

  useEffect(() => {
    scroll.current?.scrollIntoView({behavior: "smooth"})
  }, [messages])

  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            <div className="chat-header">
              <div className="follower">
                <div>
                  <img
                    src={userData?.profilePicture || Avatar}
                    alt=""
                    className="dp"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="name" style={{ fontSize: "0.8rem" }}>
                    <span>{userData?.name}</span>
                  </div>
                </div>
              </div>
              <hr />
            </div>

            {/* Chatbox Messages */}
            <div className="chat-body">
              {messages.map((message) => (
                <>
                  <div ref = {scroll}
                    className={
                      message.senderId === currentUser
                        ? "message own"
                        : "message"
                    }
                  >
                    <span>{message.message}</span>
                    <span>{format(message.createdAt)}</span>
                  </div>
                </>
              ))}
            </div>

            {/* Chat Messaging area */}
            <div className="chat-sender">
              <div>+</div>
              {/* <InputEmoji 
              onChange = {handleChange}
              value = {newMessage}
              /> */}
              <textarea
                className="textInputt"
                placeholder="Type your message here..."
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              ></textarea>
              <div className="send-button" onClick={handleSend}>
                Send
              </div>
            </div>
          </>
        ) : (
          <span>
            Click On A User To Start A Conversation. Thank You.
            <br />
            <strong>Please Note:</strong>
            <br />
            You Can Only Start A Conversation With A User That Is Not Yourself.
            If You Want To Start A Conversation With A User That Is Yourself,
            Please Contact The Admin. Thank You. :){" "}
          </span>
        )}
      </div>
    </>
  );

};

export default ChatBox;
