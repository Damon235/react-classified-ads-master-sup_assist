import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Conversations.css";
import { getUser } from "../../../../api/ChatReq";
import Avatar from "./peacedp.jpg";


const Conversations = ({ data, currentUser, online, scrollToTop }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUser);
    // console.log(userId)
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (data !== null) getUserData();
  }, [data, currentUser]);

  return (
    <>
      <div className="conversation" onClick={scrollToTop}>
        <div>
          {online && <div className="online-dot"></div>}
          {/* <div className="online-dot"></div> */}
          <img
            src={userData?.profilePicture || Avatar}
            alt=""
            className="dp"
            style={{ width: "50px", height: "50px" }}
          />
          <div className="name" style={{ fontSize: "0.8rem" }}>
            <span>{userData?.name}</span>
            <span>{online ? "-Online" : "-Offline"}</span>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};
export default Conversations;
