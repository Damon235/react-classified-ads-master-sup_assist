import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ChatAPI(token) {
  const [chatRooms, setChatRooms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      const getChatRooms = async () => {
        try {
          const res = await axios.get("/rooms", {
            headers: {
              Authorization: token,
            },
          });
          setChatRooms(res.data.rooms);
          setError(null); // Clear any previous errors
          console.log(res.data.rooms);
        } catch (error) {
          setError(error.message || "An error occurred while fetching chat rooms.");
          console.log(error);
        }
      };
      getChatRooms();
    }
  }, [token]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return {
    chatRooms: [chatRooms, setChatRooms],
  };  // Render chat rooms here
  
}




