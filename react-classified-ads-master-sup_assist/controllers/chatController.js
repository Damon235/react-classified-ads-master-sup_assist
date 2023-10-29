const Chats = require('../models/ChatModel.js');
const ChatMessages = require('../models/ChatMessagesModel.js');


const createChat = async (req, res) => {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;
  
    try {
      const existingChat = await Chats.findOne({
        members: { $all: [senderId, receiverId] },
      });
  
      if (existingChat) {
        return res.status(200).json(existingChat);
      }
      const newChat = new Chats({
        members: [senderId, receiverId],
      });
  
      const result = await newChat.save();
      res.status(200).json(result);
      console.log("Chat Created: ", result);
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  };
  

const userChat = async(req, res) => {
    try {
        const chat = await Chats.find({
            members: {$in: [req.params.userId]}
    })
    res.status(200).json(chat)
    } catch (error){
        res.status(500).json(error);
    }
}; 

const fetchConversation = async(req, res) => {
    try {
        const chat = await Chats.findOne({
            members: {$all: [req.params.firstId, req.params.secondId]}
        })
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteChat = async(req, res) => {
    try {
        const chat = await Chats.findByIdAndDelete(req.params.chatId)
        // check if chat exist
        if(!chat) return res.status(404).json("Chat Not Found")
        // delete all messages in chat
        res.status(200).json("Chat Deleted")
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteChatString = async(req, res) => {
    try {
        const chatMessages = await ChatMessages.findByIdAndDelete(req.params.messageId)
        console.log(chatMessages)
        res.status(200).json("Message Deleted")
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {createChat, userChat, fetchConversation, deleteChat, deleteChatString}